document.addEventListener("DOMContentLoaded", () => {

  const allBookings = JSON.parse(localStorage.getItem("bookings")) || [];

  // ✅ ONLY APPROVED BOOKINGS IN REPORTS
  const bookings = allBookings.filter(b => b.status === "Approved");

  const tableBody = document.getElementById("bookingTable");

  let totalRevenue = 0;
  let roomSet = new Set();

  tableBody.innerHTML = "";

  bookings.forEach((b, i) => {
    totalRevenue += Number(b.amount || 0);
    if (b.roomNumber) roomSet.add(b.roomNumber);

    tableBody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${b.guestName || "-"}</td>
        <td>${b.roomNumber || "-"}</td>
        <td>${b.checkIn || "-"}</td>
        <td>${b.checkOut || "-"}</td>
        <td>₹${b.amount || 0}</td>
        <td>${b.paymentMethod || "-"}</td>
        <td>
          ${b.aadhaarImg 
            ? `<img src="${b.aadhaarImg}" class="proof-img" onclick="openImage('${b.aadhaarImg}')">`
            : "-"
          }
        </td>
        <td>
          ${b.panImg 
            ? `<img src="${b.panImg}" class="proof-img" onclick="openImage('${b.panImg}')">`
            : "-"
          }
        </td>
        <td>
          <button onclick="deleteBooking(${i})">Delete</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("totalBookings").innerText = bookings.length;
  document.getElementById("totalRooms").innerText = roomSet.size;
  document.getElementById("totalRevenue").innerText = "₹" + totalRevenue;

  loadChart(bookings);
});

// ❌ DELETE (REPORT ONLY)
function deleteBooking(i) {
  let all = JSON.parse(localStorage.getItem("bookings")) || [];
  const approved = all.filter(b => b.status === "Approved");
  const target = approved[i];

  all = all.filter(b => b !== target);

  localStorage.setItem("bookings", JSON.stringify(all));
  location.reload();
}

// 📤 EXPORT CSV
function exportCSV() {
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  const approved = bookings.filter(b => b.status === "Approved");

  let csv = "Guest,Room,CheckIn,CheckOut,Amount,Payment\n";

  approved.forEach(b => {
    csv += `${b.guestName},${b.roomNumber},${b.checkIn},${b.checkOut},${b.amount},${b.paymentMethod}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "reports.csv";
  link.click();
}

// 🔍 FILTER SAFE
function filterTable() {
  const search = (document.getElementById("searchInput").value || "").toLowerCase();
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;

  document.querySelectorAll("#bookingTable tr").forEach(row => {
    const text = row.innerText.toLowerCase();
    const date = row.children[3].innerText;

    let show = text.includes(search);

    if (from && date < from) show = false;
    if (to && date > to) show = false;

    row.style.display = show ? "" : "none";
  });
}

// 📊 CHART
function loadChart(bookings) {
  const map = {};

  bookings.forEach(b => {
    if (!b.checkIn) return;
    map[b.checkIn] = (map[b.checkIn] || 0) + Number(b.amount || 0);
  });

  new Chart(document.getElementById("revenueChart"), {
    type: "bar",
    data: {
      labels: Object.keys(map),
      datasets: [{
        label: "Daily Revenue",
        data: Object.values(map),
        backgroundColor: "#6c63ff"
      }]
    }
  });
}

// 🖼️ IMAGE VIEW
function openImage(src) {
  document.getElementById("modalImg").src = src;
  document.getElementById("imageModal").style.display = "flex";
}

function closeImage() {
  document.getElementById("imageModal").style.display = "none";
}
