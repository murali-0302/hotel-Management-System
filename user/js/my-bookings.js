const container = document.getElementById("statusList");
const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

container.innerHTML = "";

bookings.forEach(b => {
  container.innerHTML += `
    <div class="card">
      <h3>Room ${b.room}</h3>
      <p>Status: <strong>${b.status}</strong></p>
    </div>
  `;
});
