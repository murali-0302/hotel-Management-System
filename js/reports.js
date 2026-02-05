import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let ALL_BOOKINGS = [];

/* =========================
   LOAD REPORTS
========================= */
document.addEventListener("DOMContentLoaded", loadReports);

async function loadReports() {
  const q = query(
    collection(db, "bookings"),
    where("status", "==", "Approved")
  );

  const snapshot = await getDocs(q);

  ALL_BOOKINGS = [];
  snapshot.forEach(doc => ALL_BOOKINGS.push(doc.data()));

  renderTable(ALL_BOOKINGS);
  updateSummary(ALL_BOOKINGS);
  loadChart(ALL_BOOKINGS);
}

/* =========================
   RENDER TABLE
========================= */
function renderTable(bookings) {
  const tableBody = document.getElementById("bookingTable");
  tableBody.innerHTML = "";

  let sno = 1;

  bookings.forEach(b => {
    tableBody.innerHTML += `
      <tr>
        <td>${sno++}</td>
        <td>${b.guestName || "-"}</td>
        <td>${b.rooms?.join(", ") || "-"}</td>
        <td>${formatDate(b.checkIn)}</td>
        <td>${formatDate(b.checkOut)}</td>
        <td>₹${b.amount || 0}</td>
        <td>${b.paymentMethod || "-"}</td>    `;
  });
}

/* =========================
   SUMMARY
========================= */
function updateSummary(bookings) {
  let revenue = 0;
  let roomSet = new Set();

  bookings.forEach(b => {
    revenue += Number(b.amount || 0);
    b.rooms?.forEach(r => roomSet.add(r));
  });

  document.getElementById("totalBookings").innerText = bookings.length;
  document.getElementById("totalRooms").innerText = roomSet.size;
  document.getElementById("totalRevenue").innerText = "₹" + revenue;
}

/* =========================
   SEARCH + DATE FILTER
========================= */
document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("fromDate").addEventListener("change", applyFilters);
document.getElementById("toDate").addEventListener("change", applyFilters);

function applyFilters() {
  const search = searchInput.value.toLowerCase();
  const from = fromDate.value;
  const to = toDate.value;

  const filtered = ALL_BOOKINGS.filter(b => {
    const guest = b.guestName?.toLowerCase() || "";
    const room = b.rooms?.join(",").toLowerCase() || "";

    if (search && !guest.includes(search) && !room.includes(search)) return false;
    if (from && b.checkIn < from) return false;
    if (to && b.checkOut > to) return false;

    return true;
  });

  renderTable(filtered);
  updateSummary(filtered);
  loadChart(filtered);
}

/* =========================
   EXPORT CSV
========================= */
window.exportCSV = function () {
  let csv = "Guest,Rooms,CheckIn,CheckOut,Amount,Payment\n";

  ALL_BOOKINGS.forEach(b => {
    csv += `"${b.guestName}","${b.rooms?.join(" ")}","${b.checkIn}","${b.checkOut}","${b.amount}","${b.paymentMethod}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "reports.csv";
  link.click();
};

/* =========================
   IMAGE MODAL
========================= */
window.openImage = function (src) {
  document.getElementById("modalImg").src = src;
  document.getElementById("imageModal").style.display = "flex";
};

document.getElementById("imageModal").onclick = () => {
  document.getElementById("imageModal").style.display = "none";
};

/* =========================
   HELPERS
========================= */
function formatDate(d) {
  return d ? new Date(d).toLocaleDateString() : "-";
}

/* =========================
   CHART
========================= */
let chart;
function loadChart(bookings) {
  const map = {};

  bookings.forEach(b => {
    if (!b.checkIn) return;
    const day = b.checkIn.split("T")[0];
    map[day] = (map[day] || 0) + Number(b.amount || 0);
  });

  if (chart) chart.destroy();

  chart = new Chart(revenueChart, {
    type: "bar",
    data: {
      labels: Object.keys(map),
      datasets: [{
        label: "Daily Revenue",
        data: Object.values(map)
      }]
    }
  });
}
