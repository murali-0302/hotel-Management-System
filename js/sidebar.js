<<<<<<< HEAD
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
=======
document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", function (e) {

    const href = this.getAttribute("href");

    // Ignore logout or external links
    if (!href || href === "#" || href.startsWith("http")) return;

    e.preventDefault();

    const page = document.querySelector(".page");
    page.classList.add("fade-exit");

    setTimeout(() => {
      window.location.href = href;
    }, 300);
  });
});
>>>>>>> 484c6510888383d3b60300bdec6210e080812d48
