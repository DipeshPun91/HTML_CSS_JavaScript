document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("toggle");

  const passwordInput = document.getElementById("signup-password");
  const strengthBar = document.getElementById("password-strength-bar");
  const strengthText = document.getElementById("password-strength-text");

  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      const password = this.value;
      let strength = 0;

      if (password.length >= 8) strength += 1;
      if (password.length >= 12) strength += 1;

      if (/\d/.test(password)) strength += 1;

      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;

      let width = 0;
      let color = "#ef4444";
      let text = "Weak";

      if (strength <= 1) {
        width = 25;
      } else if (strength <= 3) {
        width = 50;
        color = "#f59e0b";
        text = "Medium";
      } else if (strength <= 4) {
        width = 75;
        color = "#10b981";
        text = "Strong";
      } else {
        width = 100;
        color = "#10b981";
        text = "Very Strong";
      }

      strengthBar.style.width = width + "%";
      strengthBar.style.backgroundColor = color;
      strengthText.textContent = "Password strength: " + text;
      strengthText.style.color = color;
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;
      const name = document.getElementById("signup-name");
      const email = document.getElementById("signup-email");
      const password = document.getElementById("signup-password");
      const terms = document.getElementById("terms");

      if (!name.value.trim()) {
        document.getElementById("name-error").style.display = "block";
        name.classList.add("error");
        isValid = false;
      } else {
        document.getElementById("name-error").style.display = "none";
        name.classList.remove("error");
      }

      if (!validateEmail(email.value)) {
        document.getElementById("email-error").style.display = "block";
        email.classList.add("error");
        isValid = false;
      } else {
        document.getElementById("email-error").style.display = "none";
        email.classList.remove("error");
      }

      if (password.value.length < 8) {
        document.getElementById("password-error").style.display = "block";
        password.classList.add("error");
        isValid = false;
      } else {
        document.getElementById("password-error").style.display = "none";
        password.classList.remove("error");
      }

      if (!terms.checked) {
        terms.classList.add("error");
        isValid = false;
      } else {
        terms.classList.remove("error");
      }

      if (isValid) {
        const button = document.getElementById("signup-button");
        button.disabled = true;
        button.classList.add("loading");

        setTimeout(() => {
          button.disabled = false;
          button.classList.remove("loading");
          alert("Account created successfully!");
          toggle.checked = false;
          signupForm.reset();
        }, 1500);
      }
    });
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;
      const email = document.getElementById("login-email");
      const password = document.getElementById("login-password");

      if (!validateEmail(email.value)) {
        document.getElementById("login-email-error").style.display = "block";
        email.classList.add("error");
        isValid = false;
      } else {
        document.getElementById("login-email-error").style.display = "none";
        email.classList.remove("error");
      }

      if (!password.value) {
        document.getElementById("login-password-error").style.display = "block";
        password.classList.add("error");
        isValid = false;
      } else {
        document.getElementById("login-password-error").style.display = "none";
        password.classList.remove("error");
      }

      if (isValid) {
        const button = document.getElementById("login-button");
        button.disabled = true;
        button.classList.add("loading");

        setTimeout(() => {
          button.disabled = false;
          button.classList.remove("loading");
          alert("Logged in successfully!");
          loginForm.reset();
        }, 1500);
      }
    });
  }
});
