const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebarPanel");
const overlay = document.getElementById("overlay");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("show");
  overlay.classList.toggle("show");
  menuBtn.classList.toggle("active");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("show");
  overlay.classList.remove("show");
  menuBtn.classList.remove("active");
});

document.querySelectorAll(".sidebar a").forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 480) {
      sidebar.classList.remove("show");
      overlay.classList.remove("show");
      menuBtn.classList.remove("active");
    }
  });
});
