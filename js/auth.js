import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* =========================
   LOGIN
========================= */
window.login = async function () {
  const identifier = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!identifier || !password) {
    alert("All fields are required");
    return;
  }

  // 🔍 CHECK ADMIN (username + password)
  const adminQuery = query(
    collection(db, "users"),
    where("username", "==", identifier),
    where("password", "==", password),
    where("role", "==", "admin")
  );

  const adminSnap = await getDocs(adminQuery);

  if (!adminSnap.empty) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", "admin");
    localStorage.setItem("admin", identifier);

    window.location.href = "booking.html";
    return;
  }

  // 🔍 CHECK USER (email + password)
  const userQuery = query(
    collection(db, "users"),
    where("email", "==", identifier),
    where("password", "==", password),
    where("role", "==", "user")
  );

  const userSnap = await getDocs(userQuery);

  if (userSnap.empty) {
    alert("Invalid credentials");
    return;
  }

  const user = userSnap.docs[0].data();

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
  const snap = await getDocs(q);

  if (!snap.empty) {
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

  alert("Registration successful");
  window.location.href = "login.html";
};
