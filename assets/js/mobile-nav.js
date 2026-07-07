(function () {
  "use strict";

  function initMobileNav() {
    const drawer = document.getElementById("nav-drawer");
    const overlay = document.getElementById("nav-drawer-overlay");
    const openBtn = document.getElementById("nav-menu-btn");
    const closeBtn = document.getElementById("nav-drawer-close");
    if (!drawer || !overlay || !openBtn) return;

    function setOpen(isOpen) {
      drawer.classList.toggle("is-open", isOpen);
      overlay.classList.toggle("is-visible", isOpen);
      overlay.hidden = !isOpen;
      openBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      drawer.setAttribute("aria-hidden", isOpen ? "false" : "true");
      document.body.classList.toggle("nav-drawer-open", isOpen);

      if (isOpen) {
        drawer.removeAttribute("inert");
        closeBtn?.focus();
      } else {
        drawer.setAttribute("inert", "");
      }
    }

    function close() {
      setOpen(false);
    }

    function toggle() {
      setOpen(!drawer.classList.contains("is-open"));
    }

    openBtn.addEventListener("click", toggle);
    closeBtn?.addEventListener("click", close);
    overlay.addEventListener("click", close);

    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", close);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && drawer.classList.contains("is-open")) {
        close();
        openBtn.focus();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", initMobileNav);
})();
