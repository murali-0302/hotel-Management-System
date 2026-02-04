const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebarPanel");
const overlay = document.getElementById("overlay");

/* Open / Close sidebar */
menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
  menuBtn.classList.toggle("active");

  document.body.style.overflow =
    sidebar.classList.contains("active") ? "hidden" : "";
});

/* Close on overlay click */
overlay.addEventListener("click", closeSidebar);

/* Auto close on link click (mobile) */
document.querySelectorAll(".sidebar a").forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  });
});

/* Swipe to close (mobile) */
let startX = 0;

sidebar.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

sidebar.addEventListener("touchmove", (e) => {
  const moveX = e.touches[0].clientX;

  if (startX - moveX > 50) {
    closeSidebar();
  }
});

/* Helper */
function closeSidebar() {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  menuBtn.classList.remove("active");
  document.body.style.overflow = "";
}
