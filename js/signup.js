document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.querySelector('input[name="username"]').value;
  const fullname = document.querySelector('input[name="fullname"]').value;
  const password = document.querySelector('input[name="password"]').value;
  const confirmPassword = document.querySelector('input[name="confirm_password"]').value;

  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return;
  }

  localStorage.setItem("username", username);
  localStorage.setItem("fullname", fullname);

  window.location.assign(`${window.location.hostname}/onboarding.html`);
});