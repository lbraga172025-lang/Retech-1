(function () {
  "use strict";
  var estado = document.getElementById("estado-confirmacao");
  if (!estado) return;
  var token = new URLSearchParams(window.location.search).get("token");
  if (!token) {
    estado.className = "form-status form-status--erro";
    estado.textContent = "Link inválido ou incompleto. Volte ao formulário e solicite um novo e-mail.";
    return;
  }
  var baseApi = window.RETECH_API_URL || "";
  fetch(baseApi + "/api/confirmar?token=" + encodeURIComponent(token))
    .then(function (res) { return res.json().then(function (data) { if (!res.ok) throw new Error(data.error || "Não foi possível confirmar o endereço."); return data; }); })
    .then(function () {
      estado.className = "form-status form-status--ok";
      estado.textContent = "E-mail confirmado com sucesso! Seu endereço foi verificado e sua mensagem foi registrada para a equipe ReTech.";
    })
    .catch(function (erro) {
      estado.className = "form-status form-status--erro";
      estado.textContent = erro.message || "Link expirado ou inválido. Solicite uma nova confirmação.";
    });
})();
