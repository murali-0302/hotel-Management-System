const seatGrid = document.getElementById("seatGrid");
const roomInput = document.getElementById("roomNumber");
const floorSelect = document.getElementById("floorSelect");
const availableBox = document.getElementById("availableRooms");

const roomsPerFloor = 20;
let selectedRooms = [];

/* =========================
   GET APPROVED ROOMS ONLY
========================= */
function getBookedRooms() {
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  return bookings
    .filter(b => b.status === "Approved")
    .flatMap(b => b.rooms || []);
}

/* =========================
   RENDER ROOMS
========================= */
function renderRooms() {
  seatGrid.innerHTML = "";
  availableBox.innerHTML = "";
  selectedRooms = [];
  roomInput.value = "";

  const floor = floorSelect.value;
  const bookedRooms = getBookedRooms();

  for (let i = 1; i <= roomsPerFloor; i++) {
    const roomNo = `${floor}${i < 10 ? "0" + i : i}`;
    const seat = document.createElement("div");

    seat.className = "seat";
    seat.innerText = roomNo;

    if (bookedRooms.includes(roomNo)) {
      seat.classList.add("occupied");
    } else {
      seat.onclick = () => toggleRoom(seat, roomNo);

      const chip = document.createElement("span");
      chip.className = "room-chip";
      chip.innerText = roomNo;
      availableBox.appendChild(chip);
    }

    seatGrid.appendChild(seat);
  }
}

/* =========================
   SELECT / DESELECT ROOMS
========================= */
function toggleRoom(seat, roomNo) {
  if (selectedRooms.includes(roomNo)) {
    selectedRooms = selectedRooms.filter(r => r !== roomNo);
    seat.classList.remove("selected");
  } else {
    selectedRooms.push(roomNo);
    seat.classList.add("selected");
  }

  roomInput.value = selectedRooms.join(", ");
}

/* =========================
   FLOOR CHANGE
========================= */
function changeFloor() {
  renderRooms();
}

/* =========================
   ENABLE EDIT
========================= */
function enableEdit() {
  document
    .querySelectorAll(".booking-form input, .booking-form select")
    .forEach(el => (el.disabled = false));
}

/* =========================
   ADD BOOKING (AUTO APPROVE)
========================= */
window.addBooking = function () {
  if (selectedRooms.length === 0) {
    alert("Please select at least one room!");
    return;
  }

  const booking = {
    id: Date.now(),
    guestName: guestName.value,
    email: email.value,
    phone: phone.value,
    guests: guests.value,

    /* 🔥 MULTI ROOM */
    rooms: selectedRooms,

    floor: floorSelect.value,
    checkIn: checkIn.value,
    checkOut: checkOut.value,
    paymentMethod: paymentMethod.value,
    amount: amount.value,

    status: "Approved",
    approvedBy: "Admin",
    approvedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    source: "Admin"
  };

  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));

  alert("✅ Multiple rooms booked & approved!");
  renderRooms();
};

/* =========================
   INIT
========================= */
renderRooms();

/* =========================
   DOCUMENT UPLOAD PREVIEW
========================= */
document.querySelectorAll(".upload").forEach(uploadBox => {
  const fileInput = uploadBox.querySelector("input[type='file']");
  const previewImg = uploadBox.querySelector(".preview");
  const statusDiv = uploadBox.querySelector(".status");

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image only!");
      fileInput.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      previewImg.src = reader.result;
      previewImg.style.display = "block";
      statusDiv.textContent = "✅ Uploaded";
      statusDiv.style.color = "green";
    };
    reader.readAsDataURL(file);
  });
});
