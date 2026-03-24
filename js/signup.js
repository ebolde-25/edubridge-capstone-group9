document.querySelector("form").addEventListener("submit", function () {
  const username = document.querySelector('input[name="username"]').value;
  localStorage.setItem("username", username);

  // Remove any existing progress so onboarding starts fresh
  localStorage.removeItem("progressData");
  localStorage.removeItem("userLevel");
});