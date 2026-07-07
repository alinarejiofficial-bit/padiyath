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

  function initDeptCursorGlow(section) {
    const glow = section.querySelector(".dept-cursor-glow");
    if (!glow || prefersReducedMotion) return;

    section.addEventListener("mousemove", (e) => {
      const rect = section.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
    });
  }

  function initDeptCardTilt(section) {
    const cards = section.querySelectorAll("[data-tilt]");
    if (!cards.length || prefersReducedMotion) return;

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) perspective(700px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  function initDeptForm() {
    const form = document.querySelector(".dept-detail-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector(".book-submit");
      if (btn) {
        const original = btn.textContent;
        btn.textContent = "Request Sent ✓";
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
          form.reset();
          const deptSelect = form.querySelector('[name="department"]');
          if (deptSelect && deptSelect.dataset.selected) {
            deptSelect.value = deptSelect.dataset.selected;
          }
        }, 2500);
      }
    });
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

  function renderDepartmentDetail() {
    const root = document.getElementById("department-detail");
    if (!root || !window.getDepartmentBySlug) return;

    const slug = new URLSearchParams(window.location.search).get("dept");
    const dept = window.getDepartmentBySlug(slug);

    if (!dept) {
      root.innerHTML = `
        <section class="dept-detail-empty">
          <h1>Department Not Found</h1>
          <p>The department you are looking for does not exist.</p>
          <a class="btn-primary" href="departments.html">View All Departments</a>
        </section>`;
      document.title = "Department Not Found | Padiyath Hospital";
      return;
    }

    document.title = `${dept.name} | Padiyath Hospital`;

    const banner = root.querySelector("[data-dept-banner]");
    const description = root.querySelector("[data-dept-description]");
    const servicesList = root.querySelector("[data-dept-services]");
    const doctorsGrid = root.querySelector("[data-dept-doctors]");
    const deptSelect = root.querySelector('[name="department"]');
    const doctorSelect = root.querySelector('[name="doctor"]');

    const breadcrumb = document.querySelector("[data-dept-breadcrumb]");
    if (breadcrumb) breadcrumb.textContent = dept.name;

    if (banner) {
      banner.querySelector("[data-dept-name]").textContent = dept.name;
      banner.querySelector("[data-dept-short]").textContent = dept.shortDescription;
      const img = banner.querySelector("img");
      if (img) {
        img.src = dept.image;
        img.alt = `${dept.name} department at Padiyath Hospital`;
      }
      const media = banner.querySelector(".dept-detail-banner-media");
      if (media) {
        media.className = `dept-detail-banner-media ${dept.mediaClass}`;
      }
    }

    if (description) {
      description.textContent = dept.description;
    }

    if (servicesList) {
      servicesList.innerHTML = dept.services
        .map(
          (service) => `
        <li class="dept-detail-service-item">
          <span class="dept-detail-service-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5 9.5 17 19 7" /></svg>
          </span>
          ${service}
        </li>`
        )
        .join("");
    }

    if (doctorsGrid) {
      doctorsGrid.innerHTML = dept.doctors
        .map(
          (doc, i) => `
        <article class="spec-card">
          <div class="spec-portrait ${doc.portrait}">
            <span class="spec-initials" aria-hidden="true">${doc.initials}</span>
          </div>
          <div class="spec-card-panel">
            <h3>${doc.name}</h3>
            <p class="spec-specialty">${doc.specialty}</p>
            <p class="spec-meta"><span>${doc.years}</span> · <span>${doc.qualifications}</span></p>
            <p class="spec-desc">${doc.description}</p>
            <a class="spec-book-btn" href="#dept-appointment">Book Appointment</a>
          </div>
        </article>`
        )
        .join("");
    }

    if (deptSelect) {
      deptSelect.innerHTML =
        window.PADIYATH_DEPARTMENTS.map(
          (d) => `<option value="${d.name}"${d.slug === dept.slug ? " selected" : ""}>${d.name}</option>`
        ).join("");
      deptSelect.dataset.selected = dept.name;
    }

    if (doctorSelect && dept.doctors.length) {
      doctorSelect.innerHTML =
        `<option value="">Any available doctor</option>` +
        dept.doctors.map((doc) => `<option value="${doc.name}">${doc.name}</option>`).join("");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderDepartmentDetail();
    initReveal();
    initDeptForm();

    const listing = document.querySelector(".departments-page-section");
    if (listing) {
      initDeptCursorGlow(listing);
      initDeptCardTilt(listing);
    }

    initFooter();
    initBackToTop();
  });
})();
