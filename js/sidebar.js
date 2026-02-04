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
