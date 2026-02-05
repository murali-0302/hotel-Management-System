import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* =========================
   ADMIN EMAIL LIST
========================= */
const ADMIN_EMAILS = ["admin@gmail.com", "admin@hotel.com"];

/* =========================
   AUTH STATE CHECK
========================= */
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.email);
  } else {
    console.log("Not logged in");
  }
});

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
    // 1️⃣ Create AUTH user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    const role = ADMIN_EMAILS.includes(user.email) ? "admin" : "user";

    // 2️⃣ CREATE FIRESTORE USER DOCUMENT  ✅ THIS WAS MISSING
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: user.email,
      role: role,
      createdAt: new Date()
    });

    // 3️⃣ Local storage (UI only)
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("email", user.email);
    localStorage.setItem("role", role);

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
    const role = ADMIN_EMAILS.includes(user.email) ? "admin" : "user";

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("email", user.email);
    localStorage.setItem("role", role);

    window.location.href = "booking.html";

  } catch (error) {
    alert("Invalid Email or Password");
    console.error(error);
  }
};

/* =========================
   LOGOUT FUNCTION
========================= */
window.logout = async function () {
  await signOut(auth);
  localStorage.clear();
  window.location.href = "index.html";
};
