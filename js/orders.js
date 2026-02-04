document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("ordersTable");

  function loadOrders() {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    table.innerHTML = "";

    bookings.forEach((b, index) => {
      // 👉 SHOW ONLY PENDING BOOKINGS
      if ((b.status || "Pending") !== "Pending") return;

      table.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${b.guestName}</td>
          <td>${b.roomNumber}</td>
          <td>${b.checkIn || "-"}</td>
          <td>${b.checkOut || "-"}</td>
          <td>₹${b.amount}</td>
          <td>
            <span class="badge pending">Pending</span>
          </td>
          <td>
            <button class="btn approve" onclick="updateStatus(${index}, 'Approved')">
              Approve
            </button>
            <button class="btn reject" onclick="updateStatus(${index}, 'Rejected')">
              Reject
            </button>
          </td>
        </tr>
      `;
    });
  }

  // 🔥 APPROVE / REJECT
  window.updateStatus = (index, status) => {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings[index].status = status;
    localStorage.setItem("bookings", JSON.stringify(bookings));
    loadOrders(); // refresh orders page
  };

  loadOrders();
});
