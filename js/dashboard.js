import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const resultTitle = document.getElementById("resultTitle");
const resultList = document.getElementById("resultList");

// RUN ONLY ON DASHBOARD PAGE
if (document.getElementById("resultBox")) {

  const resultTitle = document.getElementById("resultTitle");
  const resultList = document.getElementById("resultList");

  /* ---------- BOOKING ROOMS ---------- */
  window.showBookingRooms = async () => {
    resultTitle.innerText = "Booking Rooms";
    resultList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "bookings"));

    if (snapshot.empty) {
      resultList.innerHTML = "<li>No bookings found</li>";
      return;
    }

    snapshot.forEach(doc => {
      const b = doc.data();
      resultList.innerHTML += `
        <li>
          ${b.guestName} | Room ${b.roomNo}<br>
          ${b.checkIn} → ${b.checkOut}<br>
          ₹${b.amount} (${b.paymentMethod})
        </li>
      `;
    });
  };

  /* ---------- AVAILABLE ROOMS ---------- */
  window.showAvailableRooms = async () => {
    resultTitle.innerText = "Available Rooms";
    resultList.innerHTML = "";

    const q = query(
      collection(db, "rooms"),
      where("status", "==", "Available")
    );

    const snapshot = await getDocs(q);
    resultTitle.innerText = `Available Rooms (${snapshot.size})`;

    if (snapshot.empty) {
      resultList.innerHTML = "<li>No rooms available</li>";
      return;
    }

    snapshot.forEach(doc => {
      const r = doc.data();
      resultList.innerHTML += `<li>Room ${r.roomNo}</li>`;
    });
  };

  /* ---------- ACTIVE BOOKINGS ---------- */
  window.showActiveBookings = async () => {
    resultTitle.innerText = "Active Bookings";
    resultList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "bookings"));

    if (snapshot.empty) {
      resultList.innerHTML = "<li>No active bookings</li>";
      return;
    }

    snapshot.forEach(doc => {
      const b = doc.data();
      resultList.innerHTML += `
        <li>
          ${b.guestName} | Room ${b.roomNo}<br>
          ${b.checkIn} → ${b.checkOut}<br>
          ₹${b.amount} (${b.paymentMethod})
        </li>
      `;
    });
  };

  /* ---------- REVENUE ---------- */
  window.showRevenue = async () => {
    resultTitle.innerText = "Revenue";
    resultList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "payments"));
    let total = 0;

    snapshot.forEach(doc => {
      total += doc.data().amount;
    });

    resultList.innerHTML = `<li><strong>Total Revenue: ₹${total}</strong></li>`;
  };
}
