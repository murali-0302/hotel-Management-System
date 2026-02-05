import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const table = document.getElementById("ordersTable");

/* =========================
   LOAD PENDING ORDERS
========================= */
async function loadOrders() {
  table.innerHTML = "";

  const q = query(
    collection(db, "bookings"),
    where("status", "==", "Pending")
  );

  const snapshot = await getDocs(q);
  let index = 1;

  snapshot.forEach(docSnap => {
    const b = docSnap.data();

    table.innerHTML += `
      <tr>
        <td>${index++}</td>
        <td>${b.guestName}</td>
        <td>${(b.rooms || []).join(", ")}</td>
        <td>${b.checkIn || "-"}</td>
        <td>${b.checkOut || "-"}</td>
        <td>₹${b.amount}</td>
        <td>
          <span class="badge pending">Pending</span>
        </td>
        <td>
          <button class="btn approve"
            onclick="updateStatus('${docSnap.id}', 'Approved')">
            Approve
          </button>
          <button class="btn reject"
            onclick="updateStatus('${docSnap.id}', 'Rejected')">
            Reject
          </button>
        </td>
      </tr>
    `;
  });
}

/* =========================
   APPROVE / REJECT
========================= */
window.updateStatus = async (docId, status) => {
  try {
    await updateDoc(doc(db, "bookings", docId), {
      status,
      approvedAt: new Date().toISOString(),
      approvedBy: "Admin"
    });

    loadOrders(); // refresh table
  } catch (err) {
    console.error(err);
    alert("❌ Failed to update booking");
  }
};

/* =========================
   INIT
========================= */
loadOrders();
