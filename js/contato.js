/*
  ReTech — validação JavaScript e rascunho local do formulário.
  O projeto é estático: os dados permanecem no navegador (LocalStorage) e
  NÃO são transmitidos a servidor, e-mail ou serviço externo.
*/
(function () {
  "use strict";

  var CHAVE_RASCUNHO = "retech-formulario-contato-v1";
  var formulario = document.getElementById("form-contato");
  var resultado = document.getElementById("resultado-formulario");
  if (!formulario || !resultado) return;

  var campos = Array.prototype.slice.call(formulario.querySelectorAll("input, select, textarea"));
  var camposValidaveis = campos.filter(function (campo) { return campo.type !== "reset" && campo.type !== "submit"; });
  var data = document.getElementById("data-contato");
  var rascunhoRestaurado = false;

  // A data de preferência não pode ser anterior à data local de hoje.
  if (data) {
    var agora = new Date();
    data.min = agora.getFullYear() + "-" + String(agora.getMonth() + 1).padStart(2, "0") + "-" + String(agora.getDate()).padStart(2, "0");
  }

  function obterErro(campo) {
    var v = campo.validity;
    if (v.valueMissing) return campo.type === "checkbox" ? "Marque esta opção para continuar." : "Preencha este campo obrigatório.";
    if (v.typeMismatch && campo.type === "email") return "Digite um e-mail válido, como nome@exemplo.com.";
    if (v.patternMismatch) return campo.title || "Confira o formato informado.";
    if (v.tooShort) return "O texto está muito curto. Verifique a quantidade mínima de caracteres.";
    if (v.tooLong) return "O texto ultrapassou o limite de caracteres.";
    if (v.rangeUnderflow) return campo.type === "date" ? "Escolha hoje ou uma data futura." : "O valor está abaixo do mínimo permitido.";
    if (v.rangeOverflow) return "O valor ultrapassou o máximo permitido.";
    if (v.stepMismatch) return "Informe um número inteiro válido.";
    if (v.badInput) return "Confira o valor informado.";
    return "Confira este campo.";
  }

  function elementoErro(campo) {
    var id = campo.id + "-erro";
    var erro = document.getElementById(id);
    if (!erro) {
      erro = document.createElement("span");
      erro.id = id;
      erro.className = "field-error";
      erro.setAttribute("role", "alert");
      var grupo = campo.closest(".field") || campo.parentNode;
      grupo.appendChild(erro);
    }
    var descricoes = (campo.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
    if (descricoes.indexOf(id) === -1) descricoes.push(id);
    campo.setAttribute("aria-describedby", descricoes.join(" "));
    return erro;
  }

  function validarCampo(campo, mostrar) {
    var erro = elementoErro(campo);
    var valido = campo.checkValidity();
    if (!valido && mostrar) {
      erro.textContent = obterErro(campo);
      campo.classList.add("is-invalid");
      campo.setAttribute("aria-invalid", "true");
    } else {
      erro.textContent = "";
      campo.classList.remove("is-invalid");
      campo.removeAttribute("aria-invalid");
    }
    return valido;
  }

  function coletarDados() {
    var dados = {};
    camposValidaveis.forEach(function (campo) {
      dados[campo.name] = campo.type === "checkbox" ? campo.checked : campo.value;
    });
    return dados;
  }

  function salvarRascunho() {
    try {
      localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(coletarDados()));
      return true;
    } catch (erro) {
      resultado.className = "form-status form-status--erro";
      resultado.textContent = "Não foi possível salvar o rascunho. Verifique se o armazenamento do navegador está habilitado.";
      return false;
    }
  }

  function restaurarRascunho() {
    try {
      var salvo = localStorage.getItem(CHAVE_RASCUNHO);
      if (!salvo) return;
      var dados = JSON.parse(salvo);
      camposValidaveis.forEach(function (campo) {
        if (!Object.prototype.hasOwnProperty.call(dados, campo.name)) return;
        if (campo.type === "checkbox") campo.checked = Boolean(dados[campo.name]);
        else campo.value = dados[campo.name];
      });
      rascunhoRestaurado = true;
      resultado.className = "form-status form-status--info";
      resultado.textContent = "Rascunho recuperado deste navegador. Você pode continuar preenchendo ou limpar os dados.";
    } catch (erro) {
      try { localStorage.removeItem(CHAVE_RASCUNHO); } catch (ignorado) { /* armazenamento indisponível */ }
    }
  }

  restaurarRascunho();

  camposValidaveis.forEach(function (campo) {
    campo.addEventListener("input", function () {
      if (campo.classList.contains("is-invalid")) validarCampo(campo, true);
      salvarRascunho();
    });
    campo.addEventListener("change", function () {
      if (campo.classList.contains("is-invalid")) validarCampo(campo, true);
      salvarRascunho();
    });
    campo.addEventListener("blur", function () {
      if (campo.value || campo.required) validarCampo(campo, true);
    });
  });

  async function enviarSolicitacao() {
    var botaoEnviar = formulario.querySelector('button[type="submit"]');
    var dados = coletarDados();
    delete dados.ciencia;
    resultado.className = "form-status form-status--info";
    resultado.textContent = "Enviando solicitação de confirmação…";
    if (botaoEnviar) botaoEnviar.disabled = true;

    try {
      var baseApi = window.RETECH_API_URL || "";
      var resposta = await fetch(baseApi + "/api/confirmacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });
      var retorno = await resposta.json().catch(function () { return {}; });
      if (!resposta.ok) throw new Error(retorno.error || "Não foi possível solicitar a confirmação.");
      resultado.className = "form-status form-status--ok";
      resultado.textContent = "Solicitação recebida. Enviamos um link de confirmação para " + dados.email + ". Abra a mensagem e clique no link para confirmar seu endereço. Se não encontrar, confira o spam.";
      resultado.focus();
    } catch (erro) {
      resultado.className = "form-status form-status--erro";
      resultado.textContent = erro.message || "Falha de conexão. Tente novamente em instantes.";
      resultado.focus();
    } finally {
      if (botaoEnviar) botaoEnviar.disabled = false;
    }
  }

  formulario.addEventListener("submit", function (evento) {
    // Exigência da atividade: impedir o envio padrão e validar via JavaScript.
    evento.preventDefault();
    var primeiroInvalido = null;
    var tudoValido = true;
    camposValidaveis.forEach(function (campo) {
      if (!validarCampo(campo, true)) {
        tudoValido = false;
        if (!primeiroInvalido) primeiroInvalido = campo;
      }
    });

    if (!tudoValido) {
      resultado.className = "form-status form-status--erro";
      resultado.textContent = "Há campos que precisam de correção. Confira as mensagens indicadas e tente novamente.";
      if (primeiroInvalido) primeiroInvalido.focus();
      return;
    }

    enviarSolicitacao();
  });

  formulario.addEventListener("reset", function () {
    window.setTimeout(function () {
      try { localStorage.removeItem(CHAVE_RASCUNHO); } catch (erro) { /* armazenamento indisponível */ }
      camposValidaveis.forEach(function (campo) {
        campo.classList.remove("is-invalid");
        campo.removeAttribute("aria-invalid");
        var erro = document.getElementById(campo.id + "-erro");
        if (erro) erro.textContent = "";
      });
      resultado.className = "form-status";
      resultado.textContent = "Rascunho e campos limpos deste navegador.";
    }, 0);
  });
})();
