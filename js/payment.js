let bookings = JSON.parse(localStorage.getItem("hotel_bookings")) || [];
const table = document.getElementById("adminBookings");

function render() {
  table.innerHTML = "";
  bookings.forEach((b, i) => {
    table.innerHTML += `
      <tr>
        <td>${b.id}</td>
        <td>${b.userEmail}</td>
        <td>${b.room}</td>
        <td>${b.checkIn} → ${b.checkOut}</td>
        <td>₹${b.amount}</td>
        <td>${b.bookingStatus}</td>
        <td>
          <button onclick="approve(${i})">Approve</button>
          <button onclick="reject(${i})">Reject</button>
        </td>
      </tr>
    `;
  });
}

function approve(index) {
  bookings[index].bookingStatus = "Approved";
  localStorage.setItem("hotel_bookings", JSON.stringify(bookings));
  render();
}

function reject(index) {
  bookings[index].bookingStatus = "Rejected";
  localStorage.setItem("hotel_bookings", JSON.stringify(bookings));
  render();
}

render();
