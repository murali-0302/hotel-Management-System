/* =========================
   DEFAULT ADMIN CREDENTIALS
========================= */
const ADMIN_EMAIL = "admin@hotel.com";
const ADMIN_PASSWORD = "12345";

/* =========================
   LOGIN FUNCTION
========================= */
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // ---------- ADMIN LOGIN ----------
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", "admin");
    localStorage.setItem("email", email);

    window.location.href = " booking.html";
    return;
  }
  

  // ---------- USER LOGIN ----------
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (user) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", "user");
    localStorage.setItem("email", email);
    localStorage.setItem("username", user.name);

    window.location.href = "booking.html";
  } else {
    alert("Invalid Email or Password");
  }
}

/* =========================
   USER REGISTRATION
========================= */
function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("All fields are required");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if user already exists
  if (users.some(user => user.email === email)) {
    alert("User already exists");
    return;
  }

  users.push({
    name: name,
    email: email,
    password: password
  });

  localStorage.setItem("users", JSON.stringify(users));

  alert("Registration successful!");
  window.location.href = "login.html";

}

/* =========================
   LOGOUT FUNCTION
========================= */
function logout() {
  localStorage.clear();
  window.location.href = "../index.html";
}

/* =========================
   ADMIN PAGE PROTECTION
========================= */
function protectAdminPage() {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("role") !== "admin"
  ) {
    window.location.href = "../index.html";
  }
}

/* =========================
   USER PAGE PROTECTION
========================= */
function protectUserPage() {
  if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("role") !== "user"
  ) {
    window.location.href = "../booking.html";
  }
}

/* =========================
   SHOW LOGGED USER INFO
========================= */
function showUserInfo() {
  const name = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  if (name && document.getElementById("userName")) {
    document.getElementById("userName").innerText = name;
  }

  if (email && document.getElementById("userEmail")) {
    document.getElementById("userEmail").innerText = email;
  }
}

import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

window.register = async function () {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("All fields are required");
    return;
  }

  // Check if user exists
  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    alert("User already exists");
    return;
  }

  await addDoc(collection(db, "users"), {
    name,
    email,
    password,
    role: "user",
    createdAt: new Date()
  });

  alert("Registration successful!");
  window.location.href = "login.html";
};
