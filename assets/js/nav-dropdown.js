(function () {
  "use strict";

  function initDesktopDropdowns() {
    document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
      const trigger = dropdown.querySelector(".nav-dropdown-trigger");
      if (!trigger) return;

      const open = () => {
        dropdown.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      };

      const close = () => {
        dropdown.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      };

      trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        dropdown.classList.contains("is-open") ? close() : open();
      });

      dropdown.addEventListener("mouseenter", open);
      dropdown.addEventListener("mouseleave", close);
    });

    document.addEventListener("click", () => {
      document.querySelectorAll(".nav-dropdown.is-open").forEach((dropdown) => {
        dropdown.classList.remove("is-open");
        dropdown.querySelector(".nav-dropdown-trigger")?.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initDrawerSubmenus() {
    document.querySelectorAll(".nav-drawer-group-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const group = trigger.closest(".nav-drawer-group");
        if (!group) return;
        const isOpen = group.classList.toggle("is-open");
        trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initDesktopDropdowns();
    initDrawerSubmenus();
  });
})();
