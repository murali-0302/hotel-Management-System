document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const booking = {
      id: Date.now(),
      guest: document.getElementById("guestName").value,
      room: document.getElementById("selectedRoom").value,
      checkIn: document.getElementById("checkIn").value,
      checkOut: document.getElementById("checkOut").value,
      amount: document.getElementById("amount").value,
      status: "Pending"
    };

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    alert("Booking saved successfully!");
    form.reset();
  });
});
