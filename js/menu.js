/*
  ReTech — menu responsivo e navegação direcional por teclado.
  Tab/Shift+Tab continuam disponíveis. Com foco em um link do menu,
  as quatro setas movem o foco para outro link na direção indicada.
*/
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  var botao = document.getElementById("menu-toggle");
  var lista = document.getElementById("menu-lista");
  if (!lista) return;

  function definir(aberto) {
    if (!botao) return;
    lista.classList.toggle("is-open", aberto);
    botao.setAttribute("aria-expanded", aberto ? "true" : "false");
    botao.textContent = aberto ? "Fechar menu" : "Menu";
  }

  if (botao) {
    botao.addEventListener("click", function () {
      definir(botao.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && botao.getAttribute("aria-expanded") === "true") {
        definir(false);
        botao.focus();
      }
    });
  }

  function linksVisiveis() {
    return Array.prototype.slice.call(lista.querySelectorAll("a[href]"))
      .filter(function (link) { return link.getClientRects().length > 0; });
  }

  function centro(el) {
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  lista.addEventListener("keydown", function (evento) {
    var direcoes = {
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 }
    };
    var direcao = direcoes[evento.key];
    var atual = evento.target.closest("a[href]");
    if (!direcao || !atual || !lista.contains(atual)) return;

    var links = linksVisiveis();
    if (links.length < 2) return;
    var origem = centro(atual);
    var melhor = null;
    var menorPontuacao = Infinity;

    links.forEach(function (link) {
      if (link === atual) return;
      var ponto = centro(link);
      var dx = ponto.x - origem.x;
      var dy = ponto.y - origem.y;
      var principal = dx * direcao.x + dy * direcao.y;
      if (principal <= 2) return;
      var transversal = Math.abs(dx * direcao.y - dy * direcao.x);
      // Prioriza itens alinhados na direção escolhida, sem ignorar menus em mais de uma linha.
      var pontuacao = principal + transversal * 1.7;
      if (pontuacao < menorPontuacao) {
        menorPontuacao = pontuacao;
        melhor = link;
      }
    });

    // Se não existir item nessa direção (ex.: esquerda/direita em menu vertical),
    // oferece uma sequência previsível sem retirar o suporte ao Tab.
    if (!melhor) {
      var indice = links.indexOf(atual);
      var avancar = evento.key === "ArrowRight" || evento.key === "ArrowDown";
      var proximo = (indice + (avancar ? 1 : -1) + links.length) % links.length;
      melhor = links[proximo];
    }

    if (melhor) {
      evento.preventDefault();
      melhor.focus();
    }
  });
})();
