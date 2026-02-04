import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/* =========================
   ADMIN EMAIL LIST
========================= */
const ADMIN_EMAILS = ["admin@gmail.com", "admin@hotel.com"];

/* =========================
   LOGIN FUNCTION
========================= */
window.login = async function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("email", user.email);

    // ADMIN CHECK
    if (ADMIN_EMAILS.includes(user.email)) {
      localStorage.setItem("role", "admin");
      window.location.href = "booking.html";
    } else {
      localStorage.setItem("role", "user");
      window.location.href = "booking.html";
    }

  } catch (error) {
    alert("Invalid Email or Password");
    console.error(error.message);
  }
};

/* =========================
   LOGOUT
========================= */
window.logout = async function () {
  await signOut(auth);
  localStorage.clear();
  window.location.href = "index.html";
};

/* =========================
   ADMIN PAGE PROTECTION
========================= */
window.protectAdminPage = function () {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("role") !== "admin"
  ) {
    window.location.href = "index.html";
  }
};

/* =========================
   USER PAGE PROTECTION
========================= */
window.protectUserPage = function () {
  if (
    localStorage.getItem("isLoggedIn") !== "true"
  ) {
    window.location.href = "index.html";
  }
};
