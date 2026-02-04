/* ===============================
   ELEMENTS
================================ */
const seatGrid = document.getElementById("seatGrid");
const roomInput = document.getElementById("roomNumber");
const floorSelect = document.getElementById("floorSelect");
const availableBox = document.getElementById("availableRooms");
const checkInInput = document.getElementById("checkIn");
const checkOutInput = document.getElementById("checkOut");
const amountInput = document.getElementById("amount");
const saveBtn = document.getElementById("saveBooking");

const ROOM_PRICE_PER_DAY = 1500;
const roomsPerFloor = 20;

let selectedRooms = [];

/* ===============================
   GET APPROVED ROOMS
================================ */
function getBookedRooms() {
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  return bookings
    .filter(b => b.status === "Approved")
    .flatMap(b => b.rooms || []);
}

/* ===============================
   RENDER ROOMS
================================ */
function renderRooms() {
  seatGrid.innerHTML = "";
  availableBox.innerHTML = "";
  selectedRooms = [];
  roomInput.value = "";
  amountInput.value = "";

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
      seat.addEventListener("click", () => toggleRoom(seat, roomNo));

      const chip = document.createElement("span");
      chip.className = "room-chip";
      chip.innerText = roomNo;
      availableBox.appendChild(chip);
    }

    seatGrid.appendChild(seat);
  }
}

/* ===============================
   SELECT / DESELECT ROOMS
================================ */
function toggleRoom(seat, roomNo) {
  if (selectedRooms.includes(roomNo)) {
    selectedRooms = selectedRooms.filter(r => r !== roomNo);
    seat.classList.remove("selected");
  } else {
    selectedRooms.push(roomNo);
    seat.classList.add("selected");
  }

  roomInput.value = selectedRooms.join(", ");
  calculateAmount();
}

/* ===============================
   CALCULATE AMOUNT
================================ */
function calculateAmount() {
  if (
    selectedRooms.length === 0 ||
    !checkInInput.value ||
    !checkOutInput.value
  ) {
    amountInput.value = "";
    return;
  }

  const checkIn = new Date(checkInInput.value);
  const checkOut = new Date(checkOutInput.value);

  if (checkOut <= checkIn) {
    amountInput.value = "";
    return;
  }

  const diffTime = checkOut - checkIn;
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  amountInput.value =
    days * selectedRooms.length * ROOM_PRICE_PER_DAY;
}

/* ===============================
   FLOOR CHANGE
================================ */
function changeFloor() {
  renderRooms();
}

checkInInput.addEventListener("change", calculateAmount);
checkOutInput.addEventListener("change", calculateAmount);

/* ===============================
   IMAGE UPLOAD PREVIEW
================================ */
document.querySelectorAll(".upload").forEach(uploadBox => {
  const fileInput = uploadBox.querySelector('input[type="file"]');
  const previewImg = uploadBox.querySelector(".preview");
  const statusDiv = uploadBox.querySelector(".status");

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      statusDiv.innerText = "❌ Please upload an image";
      statusDiv.style.color = "red";
      fileInput.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      previewImg.src = e.target.result;
      previewImg.style.display = "block";
      statusDiv.innerText = "✅ Uploaded successfully";
      statusDiv.style.color = "green";
    };
    reader.readAsDataURL(file);
  });
});

/* ===============================
   SAVE BOOKING
================================ */
saveBtn.addEventListener("click", () => {
  const booking = {
    id: Date.now(),
    guestName: document.getElementById("guestName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    guests: document.getElementById("guests").value,
    rooms: selectedRooms,
    checkIn: checkInInput.value,
    checkOut: checkOutInput.value,
    paymentMethod: document.getElementById("paymentMethod").value,
    amount: amountInput.value,
    status: "Pending"
  };

  if (
    !booking.guestName ||
    !booking.email ||
    !booking.phone ||
    !booking.guests ||
    booking.rooms.length === 0 ||
    !booking.checkIn ||
    !booking.checkOut ||
    !booking.paymentMethod ||
    !booking.amount
  ) {
    alert("⚠️ Please fill all fields and select rooms");
    return;
  }

  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));

  alert("✅ Booking saved successfully!");

  document.querySelector(".booking-form").reset();
  selectedRooms = [];
  renderRooms();
});

/* ===============================
   INIT
================================ */
renderRooms();
