// Update this if your backend runs on a different port/host than your frontend
// (e.g., "http://localhost:5000" when using Live Server, or "" if served by Express)
const API_BASE_URL = "https://bu-entrephub-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const rememberInput = document.getElementById("remember");
  const loginError = document.getElementById("loginError");

  if (!loginForm || !emailInput || !passwordInput) return;

  // Restore saved email if "Remember me" was used previously
  const savedEmail = localStorage.getItem("bu_hangout_remember_email");
  if (savedEmail) {
    emailInput.value = savedEmail;
    if (rememberInput) rememberInput.checked = true;
  }

  function showError(msg) {
    if (!loginError) return;
    loginError.textContent = msg;
    loginError.classList.remove("d-none");
  }

  function hideError() {
    if (!loginError) return;
    loginError.textContent = "";
    loginError.classList.add("d-none");
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideError();

    loginForm.classList.add("was-validated");
    if (!loginForm.checkValidity()) {
      return;
    }

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const remember = rememberInput ? rememberInput.checked : false;

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : "";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Logging in...";
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Invalid email or password.");
      }

      const user = data.user;

      // Save authenticated user session
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("bu_hangout_user", JSON.stringify(user));

      if (remember) {
        localStorage.setItem("bu_hangout_remember_email", user.email || email);
      } else {
        localStorage.removeItem("bu_hangout_remember_email");
      }

      // Redirect based on role ("Consumer", "seller", or "admin")
      // Adjust target filenames if your pages use different names
      if (user.role === "admin") {
        window.location.href = "dashboard.html";
      } else if (user.role === "seller") {
        window.location.href = "dashboard.html";
      } else {
        window.location.href = "dashboard.html";
      }
    } catch (err) {
      // Network/CORS errors often throw "Failed to fetch"
      if (err.message === "Failed to fetch") {
        showError("Cannot reach the server. Make sure your backend is running and CORS is enabled.");
      } else {
        showError(err.message || "Login failed. Please try again.");
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
});
