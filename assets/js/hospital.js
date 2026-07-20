(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const LINK_CLASSES = [
    "hospital-clinic-menu-link hospital-clinic-menu-link--primary",
    "hospital-clinic-menu-link hospital-clinic-menu-link--accent",
    "hospital-clinic-menu-link",
    "hospital-clinic-menu-link",
    "hospital-clinic-menu-link",
  ];

  function initReveal() {
    const reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;

    if (prefersReducedMotion) {
      reveals.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  function initFooter() {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const glow = footer.querySelector(".foot-cursor-glow");
    if (!glow || prefersReducedMotion) return;

    footer.addEventListener("mousemove", (e) => {
      const rect = footer.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
    });
  }

  function initBackToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;

    function updateVisibility() {
      const visible = window.scrollY > 420;
      btn.classList.toggle("is-visible", visible);
      btn.setAttribute("aria-hidden", visible ? "false" : "true");
      btn.tabIndex = visible ? 0 : -1;
    }

    window.addEventListener("scroll", updateVisibility, { passive: true });
    updateVisibility();

    btn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  function renderHospitalPage() {
    const depts = window.getHospitalDepartments ? window.getHospitalDepartments() : [];
    const menu = document.querySelector("[data-hospital-clinic-links]");
    const cards = document.querySelector("[data-hospital-clinic-cards]");

    if (menu && depts.length) {
      menu.innerHTML = depts
        .map(
          (dept, i) => `
        <li>
          <a class="${LINK_CLASSES[i] || "hospital-clinic-menu-link"}" href="department.html?dept=${dept.slug}">
            <span class="hospital-clinic-menu-chevron" aria-hidden="true">&rsaquo;</span>
            ${dept.name}
          </a>
        </li>`
        )
        .join("");
    }

    if (cards && depts.length) {
      cards.innerHTML = depts
        .map(
          (dept, i) => `
        <a href="department.html?dept=${dept.slug}" class="hospital-clinic-card reveal reveal-delay-${Math.min(i + 1, 5)}">
          <div class="hospital-clinic-card-logo">
            <img src="${dept.logo || dept.image}" alt="" loading="lazy" decoding="async" />
          </div>
          <div class="hospital-clinic-card-body">
            <h3>${dept.name}</h3>
            <p>${dept.shortDescription}</p>
            <span class="dept-card-link">
              View Details
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </div>
        </a>`
        )
        .join("");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHospitalPage();
    initReveal();
    initFooter();
    initBackToTop();
  });
})();
