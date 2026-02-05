import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const seatGrid = document.getElementById("seatGrid");
const roomInput = document.getElementById("roomNumber");
const floorSelect = document.getElementById("floorSelect");
const availableBox = document.getElementById("availableRooms");

const roomsPerFloor = 20;
let selectedRooms = [];

/* =========================
   GET APPROVED ROOMS ONLY
========================= */
async function getBookedRooms() {
  const q = query(
    collection(db, "bookings"),
    where("status", "==", "Approved")
  );

  const snapshot = await getDocs(q);
  let rooms = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.rooms) rooms.push(...data.rooms);
  });

  return rooms;
}

/* =========================
   RENDER ROOMS
========================= */
async function renderRooms() {
  seatGrid.innerHTML = "";
  availableBox.innerHTML = "";
  selectedRooms = [];
  roomInput.value = "";

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
   SELECT / DESELECT
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
window.changeFloor = function () {
  renderRooms();
};

/* =========================
   ENABLE EDIT
========================= */
window.enableEdit = function () {
  document
    .querySelectorAll(".booking-form input, .booking-form select")
    .forEach(el => (el.disabled = false));
};

/* =========================
   ADD BOOKING (AUTO APPROVE)
========================= */
window.addBooking = async function () {
  if (selectedRooms.length === 0) {
    alert("Please select at least one room!");
    return;
  }

  const booking = {
    guestName: guestName.value,
    email: email.value,
    phone: phone.value,
    guests: guests.value,

    rooms: selectedRooms,
    floor: floorSelect.value,
    checkIn: checkIn.value,
    checkOut: checkOut.value,
    paymentMethod: paymentMethod.value,
    amount: Number(amount.value),

    status: "Approved",
    approvedBy: "Admin",
    approvedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    source: "Admin"
  };

  try {
    await addDoc(collection(db, "bookings"), booking);
    alert("✅ Multiple rooms booked & approved!");
    renderRooms();
  } catch (err) {
    console.error(err);
    alert("❌ Failed to save booking");
  }
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
