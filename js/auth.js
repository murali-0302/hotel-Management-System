import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/* =========================
   ADMIN EMAIL LIST
========================= */
const ADMIN_EMAILS = ["admin@gmail.com", "admin@hotel.com"];

/* =========================
   REGISTER FUNCTION
========================= */
window.register = async function () {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("All fields are required");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("email", user.email);

    if (ADMIN_EMAILS.includes(user.email)) {
      localStorage.setItem("role", "admin");
    } else {
      localStorage.setItem("role", "user");
    }

    alert("Registration successful!");
    window.location.href = "booking.html";

  } catch (error) {
    alert(error.message);
    console.error(error);
  }
};

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
    localStorage.setItem("email", user.email); // ✅ FIXED HERE

    if (ADMIN_EMAILS.includes(user.email)) {
      localStorage.setItem("role", "admin");
    } else {
      localStorage.setItem("role", "user");
    }

    window.location.href = "booking.html";

  } catch (error) {
    alert("Invalid Email or Password");
    console.error(error);
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
