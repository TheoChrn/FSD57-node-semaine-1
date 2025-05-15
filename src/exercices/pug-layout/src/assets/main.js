(function preventSpam() {
  const b64encodedEmail = "amVhbi5kdXBvbnRAZ21haWwuY29t";
  document.getElementById("generate-email").textContent = atob(b64encodedEmail);
})();
