(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const departments = [
    "All Departments",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
    "General Medicine",
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

  function initSpecCursorGlow(section) {
    const glow = section.querySelector(".spec-cursor-glow");
    if (!glow || prefersReducedMotion) return;

    section.addEventListener("mousemove", (e) => {
      const rect = section.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
    });
  }

  function initDocCardTilt(section) {
    const cards = section.querySelectorAll("[data-doc-tilt]");
    if (!cards.length || prefersReducedMotion) return;

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) perspective(700px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  function initDocForm() {
    const form = document.querySelector(".doc-detail-form");
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
          const doctorSelect = form.querySelector('[name="doctor"]');
          if (doctorSelect && doctorSelect.dataset.selected) {
            doctorSelect.value = doctorSelect.dataset.selected;
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
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  function doctorCardHtml(doc) {
    return `
      <article class="spec-card doc-card" data-doc-tilt data-department="${doc.department}">
        <div class="spec-portrait ${doc.portrait}">
          <span class="spec-initials" aria-hidden="true">${doc.initials}</span>
        </div>
        <div class="spec-card-panel">
          <h3>${doc.name}</h3>
          <p class="spec-specialty">${doc.specialty}</p>
          <p class="spec-meta"><span>${doc.years}</span> · <span>${doc.qualifications}</span></p>
          <p class="spec-desc">${doc.description}</p>
          <div class="spec-card-actions">
            <a class="spec-view-btn" href="doctor.html?doctor=${doc.slug}">View Details</a>
            <a class="spec-book-btn" href="doctor.html?doctor=${doc.slug}#doc-appointment">Book Appointment</a>
          </div>
        </div>
      </article>`;
  }

  function featuredDoctorHtml(doc) {
    return `
      <div class="spec-featured doc-featured reveal">
        <div class="spec-featured-visual">
          <div class="spec-featured-glow" aria-hidden="true"></div>
          <div class="spec-featured-portrait ${doc.portrait} spec-portrait--featured">
            <span class="spec-initials spec-initials--lg" aria-hidden="true">${doc.initials}</span>
          </div>
          <article class="spec-badge spec-badge--1">${doc.years} Experience</article>
          <article class="spec-badge spec-badge--2">Trusted Specialist</article>
          <article class="spec-badge spec-badge--3">Patient First Care</article>
          <article class="spec-badge spec-badge--4">${doc.department}</article>
        </div>
        <div class="spec-featured-content">
          <p class="spec-featured-label">Featured Doctor</p>
          <h3>${doc.name}</h3>
          <p class="spec-featured-role">${doc.role}</p>
          <p class="spec-featured-exp"><strong>Experience:</strong> ${doc.experience}</p>
          <p class="spec-featured-qual"><strong>Qualifications:</strong> ${doc.qualifications}</p>
          <div class="spec-expertise">
            <p class="spec-expertise-title">Areas of Expertise</p>
            <ul>
              ${doc.expertise.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
          <p class="spec-featured-bio">${doc.bio}</p>
          <div class="spec-card-actions spec-card-actions--featured">
            <a class="btn-primary" href="doctor.html?doctor=${doc.slug}">
              View Profile
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
            <a class="spec-book-btn" href="doctor.html?doctor=${doc.slug}#doc-appointment">Book Appointment</a>
          </div>
        </div>
      </div>`;
  }

  function filterDoctors(query, department) {
    const q = query.trim().toLowerCase();
    return window.PADIYATH_DOCTORS.filter((doc) => {
      const matchDept = department === "All Departments" || doc.department === department;
      const matchQuery =
        !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.department.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q);
      return matchDept && matchQuery;
    });
  }

  function initDoctorsListing() {
    const page = document.getElementById("doctors-page");
    if (!page || !window.PADIYATH_DOCTORS) return;

    const grid = page.querySelector("[data-doc-grid]");
    const featuredWrap = page.querySelector("[data-doc-featured]");
    const searchInput = page.querySelector("#doc-search");
    const deptFilter = page.querySelector("#doc-dept-filter");
    const emptyState = page.querySelector("[data-doc-empty]");
    const countEl = page.querySelector("[data-doc-count]");

    if (deptFilter) {
      deptFilter.innerHTML = departments
        .map((d) => `<option value="${d}">${d}</option>`)
        .join("");
    }

    function render() {
      const query = searchInput?.value || "";
      const dept = deptFilter?.value || "All Departments";
      const results = filterDoctors(query, dept);
      const featured = window.getFeaturedDoctor();
      const showFeatured =
        featured &&
        (dept === "All Departments" || featured.department === dept) &&
        (!query.trim() ||
          featured.name.toLowerCase().includes(query.toLowerCase()) ||
          featured.specialty.toLowerCase().includes(query.toLowerCase()));

      if (featuredWrap) {
        featuredWrap.innerHTML = showFeatured ? featuredDoctorHtml(featured) : "";
        featuredWrap.hidden = !showFeatured;
      }

      if (grid) {
        const gridDoctors = showFeatured
          ? results.filter((d) => d.slug !== featured.slug)
          : results;
        grid.innerHTML = gridDoctors.map((doc) => doctorCardHtml(doc)).join("");
        initDocCardTilt(page);
      }

      if (countEl) {
        countEl.textContent = `${results.length} specialist${results.length === 1 ? "" : "s"} found`;
      }

      if (emptyState) {
        emptyState.hidden = results.length > 0;
      }
    }

    searchInput?.addEventListener("input", render);
    deptFilter?.addEventListener("change", render);
    render();
  }

  function renderDoctorProfile() {
    const root = document.getElementById("doctor-profile");
    if (!root || !window.getDoctorBySlug) return;

    const slug = new URLSearchParams(window.location.search).get("doctor");
    const doc = window.getDoctorBySlug(slug);

    if (!doc) {
      root.innerHTML = `
        <section class="doc-detail-empty">
          <h1>Doctor Not Found</h1>
          <p>The specialist you are looking for does not exist.</p>
          <a class="btn-primary" href="doctors.html">View All Doctors</a>
        </section>`;
      document.title = "Doctor Not Found | Padiyath Hospital";
      return;
    }

    document.title = `${doc.name} | Padiyath Hospital`;

    const breadcrumb = root.querySelector("[data-doc-breadcrumb]");
    if (breadcrumb) breadcrumb.textContent = doc.name;

    const nameEl = root.querySelector("[data-doc-name]");
    const roleEl = root.querySelector("[data-doc-role]");
    const deptEl = root.querySelector("[data-doc-department]");
    const portraitEl = root.querySelector("[data-doc-portrait]");
    const bioEl = root.querySelector("[data-doc-bio]");
    const expEl = root.querySelector("[data-doc-experience]");
    const qualEl = root.querySelector("[data-doc-qualifications]");
    const expertiseEl = root.querySelector("[data-doc-expertise]");
    const doctorSelect = root.querySelector('[name="doctor"]');
    const deptSelect = root.querySelector('[name="department"]');

    if (nameEl) nameEl.textContent = doc.name;
    if (roleEl) roleEl.textContent = doc.role;
    if (deptEl) deptEl.textContent = doc.department;
    if (bioEl) bioEl.textContent = doc.bio;
    if (expEl) expEl.textContent = doc.experience;
    if (qualEl) qualEl.textContent = doc.qualifications;

    if (portraitEl) {
      portraitEl.className = `doc-profile-portrait ${doc.portrait}`;
      portraitEl.innerHTML = `<span class="spec-initials spec-initials--lg" aria-hidden="true">${doc.initials}</span>`;
    }

    if (expertiseEl) {
      expertiseEl.innerHTML = doc.expertise.map((item) => `<li>${item}</li>`).join("");
    }

    if (doctorSelect) {
      doctorSelect.innerHTML = window.PADIYATH_DOCTORS.map(
        (d) => `<option value="${d.name}"${d.slug === doc.slug ? " selected" : ""}>${d.name}</option>`
      ).join("");
      doctorSelect.dataset.selected = doc.name;
    }

    if (deptSelect) {
      const depts = [...new Set(window.PADIYATH_DOCTORS.map((d) => d.department))];
      deptSelect.innerHTML = depts
        .map((d) => `<option value="${d}"${d === doc.department ? " selected" : ""}>${d}</option>`)
        .join("");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderDoctorProfile();
    initDoctorsListing();
    initReveal();
    initDocForm();

    const listing = document.querySelector(".doctors-page-section");
    if (listing) initSpecCursorGlow(listing);

    initFooter();
    initBackToTop();
  });
})();
