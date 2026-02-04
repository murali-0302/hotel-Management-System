const email = localStorage.getItem("loggedUser") || prompt("Enter your email");
localStorage.setItem("loggedUser", email);

const bookings = JSON.parse(localStorage.getItem("hotel_bookings")) || [];
const myBooking = bookings.find(b => b.userEmail === email);

// Section toggle
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// Booking Details
if (myBooking) {
  document.getElementById("bookingDetails").innerHTML = `
    <p><b>Room:</b> ${myBooking.room}</p>
    <p><b>Dates:</b> ${myBooking.checkIn} → ${myBooking.checkOut}</p>
    <p><b>Amount:</b> ₹${myBooking.amount}</p>
  `;

  document.getElementById("statusDetails").innerHTML = `
    <span class="badge ${myBooking.bookingStatus.toLowerCase()}">
      ${myBooking.bookingStatus}
    </span>
  `;
} else {
  document.getElementById("bookingDetails").innerText = "No bookings found";
}

// Logout
function logout() {
  localStorage.removeItem("loggedUser");
  window.location.href = "login.html";
}
