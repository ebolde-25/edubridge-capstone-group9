document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.querySelector('input[name="username"]').value;

  if (!username) {
    alert("Please enter your username.");
    return;
  }

  localStorage.setItem("username", username);
  window.location.assign(`dashboard.html`);
});