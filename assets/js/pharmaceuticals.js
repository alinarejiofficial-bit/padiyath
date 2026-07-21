(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  function initPharmaPage() {
    const p = window.PADIYATH_PHARMACEUTICALS;
    if (!p) return;

    document.title = `${p.name} | Padiyath Ayurveda`;

    const short = document.querySelector("[data-pharma-short]");
    const desc = document.querySelector("[data-pharma-desc]");
    const descExt = document.querySelector("[data-pharma-desc-ext]");
    const img = document.querySelector("[data-pharma-image]");
    const stats = document.querySelector("[data-pharma-stats]");
    const products = document.querySelector("[data-pharma-products]");
    const clinics = document.querySelector("[data-pharma-clinics]");

    if (short) short.textContent = p.shortDescription;
    if (desc) desc.textContent = p.description;
    if (descExt) descExt.textContent = p.descriptionExtended;
    if (img) {
      img.src = p.image;
      img.alt = p.name;
    }

    if (stats && p.stats) {
      stats.innerHTML = p.stats
        .map(
          (item) => `
        <article class="impact-stat" role="listitem">
          <p class="impact-stat-value impact-stat-value--static">${item.value}</p>
          <h3>${item.label}</h3>
        </article>`
        )
        .join("");
    }

    if (products && p.products) {
      products.innerHTML = p.products
        .map(
          (item, i) => `
        <article class="pharma-product-card${i === 0 ? " pharma-product-card--featured" : ""}" role="listitem">
          <span class="pharma-product-num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
          <h3>${item.name}</h3>
          <p>${item.note}</p>
        </article>`
        )
        .join("");
    }

    if (clinics && p.clinics) {
      clinics.innerHTML = p.clinics
        .map(
          (clinic, i) => `
        <article class="pharma-clinic-card">
          <span class="pharma-clinic-num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
          <h3>${clinic.name}</h3>
          ${clinic.label ? `<p class="pharma-clinic-label">${clinic.label}</p>` : ""}
          <p class="pharma-clinic-address">${clinic.address}</p>
          <a class="pharma-clinic-phone" href="tel:${clinic.phone.replace(/\s/g, "")}">${clinic.phone}</a>
        </article>`
        )
        .join("");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initPharmaPage();
    initReveal();
    initFooter();
    initBackToTop();
  });
})();
