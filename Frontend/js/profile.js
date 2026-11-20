// Update this if your backend runs on a different port/host than your frontend
const PROFILE_API_BASE_URL = "http://localhost:5000";

function getStoredUser() {
  const fromLocal = localStorage.getItem("bu_hangout_user");
  if (fromLocal) {
    try {
      return { user: JSON.parse(fromLocal), storage: localStorage };
    } catch (_) {}
  }

  const fromSession = sessionStorage.getItem("bu_hangout_user");
  if (fromSession) {
    try {
      return { user: JSON.parse(fromSession), storage: sessionStorage };
    } catch (_) {}
  }

  return { user: null, storage: localStorage };
}

function splitFullName(fullName = "") {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
}

function getInitials(fullName = "", email = "") {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "BU";
}

function formatRoleLabel(role = "") {
  const normalized = String(role).trim().toLowerCase();
  if (normalized === "seller") return "Stall owner";
  if (normalized === "admin") return "Admin";
  if (normalized === "consumer") return "Consumer";
  return role || "Member";
}

function showProfileNotice(formEl, message, type = "success") {
  if (!formEl) return;
  let alertBox = formEl.querySelector(".profile-feedback-alert");
  if (!alertBox) {
    alertBox = document.createElement("div");
    alertBox.className = `alert alert-${type} fw-bold mt-3 mb-0 profile-feedback-alert`;
    alertBox.setAttribute("role", "alert");
    formEl.appendChild(alertBox);
  }
  alertBox.className = `alert alert-${type} fw-bold mt-3 mb-0 profile-feedback-alert`;
  alertBox.textContent = message;
}

document.addEventListener("DOMContentLoaded", () => {
  let { user, storage } = getStoredUser();

  // If nobody is logged in, send back to login.html
  if (!user || !user.email) {
    window.location.href = "login.html";
    return;
  }

  const avatarInitials = document.getElementById("avatarInitials");
  const summaryName = document.getElementById("summaryName");
  const summaryEmail = document.getElementById("summaryEmail");
  const summarySection = document.getElementById("summarySection");
  const summaryRole = document.getElementById("summaryRole");
  const navMyStall = document.getElementById("navMyStall");
  const footerMyStall = document.getElementById("footerMyStall");

  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");
  const sectionInput = document.getElementById("section");
  const contactInput = document.getElementById("contact");

  const profileForm = document.getElementById("profileForm");
  const passwordForm = document.getElementById("passwordForm");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmNewPasswordInput = document.getElementById("confirmNewPassword");
  const deleteAccountForm = document.getElementById("deleteAccountForm");

  function renderProfile(currentUser) {
    const parsed = splitFullName(currentUser.name || "");
    const first = currentUser.firstName ?? currentUser.first_name ?? parsed.firstName;
    const last = currentUser.lastName ?? currentUser.last_name ?? parsed.lastName;
    const fullName =
      currentUser.name || [first, last].filter(Boolean).join(" ") || currentUser.email;
    const email = currentUser.email || "";
    const section = currentUser.section || currentUser.courseSection || "BSIS 2B";
    const contact = currentUser.contact || currentUser.contactNumber || "";
    const normalizedRole = String(currentUser.role || "").trim().toLowerCase();
    const isSeller = normalizedRole === "seller";
    const roleLabel = formatRoleLabel(currentUser.role);

    if (navMyStall) navMyStall.classList.toggle("d-none", !isSeller);
    if (footerMyStall) footerMyStall.classList.toggle("d-none", !isSeller);

    if (avatarInitials) avatarInitials.textContent = getInitials(fullName, email);
    if (summaryName) summaryName.textContent = fullName;
    if (summaryEmail) summaryEmail.textContent = email;
    if (summarySection) summarySection.textContent = section;
    if (summaryRole) summaryRole.textContent = roleLabel;

    if (firstNameInput) firstNameInput.value = first;
    if (lastNameInput) lastNameInput.value = last;
    if (emailInput) emailInput.value = email;
    if (sectionInput) sectionInput.value = section;
    if (contactInput) contactInput.value = contact;
  }

  renderProfile(user);

  // Reset button should restore the current user's data instead of blanking out
  if (profileForm) {
    profileForm.addEventListener("reset", (event) => {
      event.preventDefault();
      renderProfile(user);
      profileForm.classList.remove("was-validated");
    });

    profileForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      profileForm.classList.add("was-validated");
      if (!profileForm.checkValidity()) return;

      const updatedFirst = firstNameInput ? firstNameInput.value.trim() : "";
      const updatedLast = lastNameInput ? lastNameInput.value.trim() : "";
      const updatedName = [updatedFirst, updatedLast].filter(Boolean).join(" ");
      const updatedSection = sectionInput ? sectionInput.value.trim() : "";
      const updatedContact = contactInput ? contactInput.value.trim() : "";

      const updatedUser = {
        ...user,
        name: updatedName || user.name,
        firstName: updatedFirst,
        lastName: updatedLast,
        section: updatedSection,
        contact: updatedContact,
      };

      user = updatedUser;
      storage.setItem("bu_hangout_user", JSON.stringify(user));
      renderProfile(user);
      showProfileNotice(profileForm, "Profile updated.", "success");
    });
  }

  // Confirm password match validation
  if (newPasswordInput && confirmNewPasswordInput) {
    const checkPasswordMatch = () => {
      if (confirmNewPasswordInput.value && newPasswordInput.value !== confirmNewPasswordInput.value) {
        confirmNewPasswordInput.setCustomValidity("Passwords must match.");
      } else {
        confirmNewPasswordInput.setCustomValidity("");
      }
    };
    newPasswordInput.addEventListener("input", checkPasswordMatch);
    confirmNewPasswordInput.addEventListener("input", checkPasswordMatch);
  }

  if (passwordForm) {
    passwordForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (newPasswordInput && confirmNewPasswordInput) {
        if (newPasswordInput.value !== confirmNewPasswordInput.value) {
          confirmNewPasswordInput.setCustomValidity("Passwords must match.");
        } else {
          confirmNewPasswordInput.setCustomValidity("");
        }
      }
      passwordForm.classList.add("was-validated");
      if (!passwordForm.checkValidity()) return;

      showProfileNotice(
        passwordForm,
        "Password form validated. Connect a password-update endpoint in Userroutes.js to save to MongoDB.",
        "warning"
      );
    });
  }

  if (deleteAccountForm) {
    deleteAccountForm.addEventListener("submit", (event) => {
      event.preventDefault();
      localStorage.removeItem("bu_hangout_user");
      sessionStorage.removeItem("bu_hangout_user");
      window.location.href = "login.html";
    });
  }
});