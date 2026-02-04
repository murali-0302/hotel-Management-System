/* =========================
   FIREBASE IMPORTS
========================= */
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* =========================
   ADMIN CREDENTIALS
========================= */
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "12345";

/* =========================
   LOGIN FUNCTION
========================= */
window.login = async function () {
  const emailOrUsername = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!emailOrUsername || !password) {
    alert("All fields are required");
    return;
  }

  /* ---------- ADMIN LOGIN ---------- */
  if (
    emailOrUsername === ADMIN_USERNAME &&
    password === ADMIN_PASSWORD
  ) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", "admin");
    localStorage.setItem("admin", ADMIN_USERNAME);

    window.location.href = "booking.html";
    return;
  }

  /* ---------- USER LOGIN (Firestore) ---------- */
  const q = query(
    collection(db, "users"),
    where("email", "==", emailOrUsername),
    where("password", "==", password)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    alert("Invalid credentials");
    return;
  }

  const user = snapshot.docs[0].data();

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("role", "user");
  localStorage.setItem("email", user.email);
  localStorage.setItem("username", user.name);

  window.location.href = "booking.html";
};

/* =========================
   USER REGISTRATION
========================= */
window.register = async function () {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("All fields are required");
    return;
  }

  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    alert("User already exists");
    return;
  }

  await addDoc(collection(db, "users"), {
    name,
    email,
    password, // ⚠️ demo only
    role: "user",
    createdAt: new Date()
  });

  alert("Registration successful!");
  window.location.href = "login.html";
};

/* =========================
   LOGOUT
========================= */
window.logout = function () {
  localStorage.clear();
  window.location.href = "../index.html";
};

/* =========================
   ADMIN PAGE PROTECTION
========================= */
window.protectAdminPage = function () {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("role") !== "admin"
  ) {
    window.location.href = "../login.html";
  }
};

/* =========================
   USER PAGE PROTECTION
========================= */
window.protectUserPage = function () {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("role") !== "user"
  ) {
    window.location.href = "../login.html";
  }
};

/* =========================
   SHOW USER INFO
========================= */
window.showUserInfo = function () {
  const name = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  if (name && document.getElementById("userName")) {
    document.getElementById("userName").innerText = name;
  }

  if (email && document.getElementById("userEmail")) {
    document.getElementById("userEmail").innerText = email;
  }
};
