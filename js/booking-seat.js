import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
   GET APPROVED ROOMS (FIRESTORE)
================================ */
async function getBookedRooms() {
  const q = query(
    collection(db, "bookings"),
    where("status", "==", "Approved")
  );

  const snapshot = await getDocs(q);
  let rooms = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.rooms) {
      rooms.push(...data.rooms);
    }
  });

  return rooms;
}

/* ===============================
   RENDER ROOMS
================================ */
async function renderRooms() {
  seatGrid.innerHTML = "";
  availableBox.innerHTML = "";
  selectedRooms = [];
  roomInput.value = "";
  amountInput.value = "";

  const floor = floorSelect.value;
  const bookedRooms = await getBookedRooms();

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
   SELECT / DESELECT
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

  const days = Math.ceil(
    (checkOut - checkIn) / (1000 * 60 * 60 * 24)
  );

  amountInput.value =
    days * selectedRooms.length * ROOM_PRICE_PER_DAY;
}

/* ===============================
   FLOOR CHANGE
================================ */
function changeFloor() {
  renderRooms();
}
window.changeFloor = changeFloor;

checkInInput.addEventListener("change", calculateAmount);
checkOutInput.addEventListener("change", calculateAmount);

/* ===============================
   SAVE BOOKING (🔥 FIRESTORE)
================================ */
saveBtn.addEventListener("click", async () => {
  const booking = {
    guestName: document.getElementById("guestName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    guests: document.getElementById("guests").value,
    rooms: selectedRooms,
    checkIn: checkInInput.value,
    checkOut: checkOutInput.value,
    paymentMethod: document.getElementById("paymentMethod").value,
    amount: Number(amountInput.value),
    status: "Pending",
    createdAt: new Date()
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

  try {
    await addDoc(collection(db, "bookings"), booking);
    alert("✅ Booking saved to Firestore!");

    document.querySelector(".booking-form").reset();
    selectedRooms = [];
    renderRooms();
  } catch (err) {
    console.error(err);
    alert("❌ Failed to save booking");
  }
});

/* ===============================
   INIT
================================ */
renderRooms();
