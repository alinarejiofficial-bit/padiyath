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

  function slugify(text) {
    return text.replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-]/g, "");
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
      document.title = "Department Not Found | Padiyath Ayurveda";
      return;
    }

    document.title = `${dept.name} | Padiyath Ayurveda`;

    const banner = root.querySelector("[data-dept-banner]");
    const description = root.querySelector("[data-dept-description]");
    const servicesList = root.querySelector("[data-dept-services]");
    const doctorsGrid = root.querySelector("[data-dept-doctors]");
    const deptSelect = root.querySelector('[name="department"]');
    const doctorSelect = root.querySelector('[name="doctor"]');

    const breadcrumb = document.querySelector("[data-dept-breadcrumb]");
    if (breadcrumb) breadcrumb.textContent = dept.name;

    if (banner) {
      banner.querySelector("[data-dept-name]").textContent = dept.subtitle || dept.name;
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

    const aboutHeading = root.querySelector("#dept-about-heading");
    if (aboutHeading) aboutHeading.textContent = dept.subtitle || dept.name;

    if (description) {
      description.textContent = dept.description;
      if (dept.descriptionExtended) {
        const ext = document.createElement("p");
        ext.className = "dept-detail-description";
        ext.textContent = dept.descriptionExtended;
        description.insertAdjacentElement("afterend", ext);
      }
    }

    const extraRoot = root.querySelector("[data-dept-extra]");
    if (extraRoot) {
      let extraHtml = "";

      if (dept.extraSections && dept.extraSections.length) {
        extraHtml += dept.extraSections
          .map(
            (section) => `
          <section class="dept-detail-section dept-detail-section--alt reveal" aria-labelledby="dept-extra-${slugify(section.title)}">
            <div class="dept-detail-section-inner">
              <header class="dept-detail-section-header">
                <h2 id="dept-extra-${slugify(section.title)}">${section.title}</h2>
              </header>
              <p class="dept-detail-description">${section.content}</p>
            </div>
          </section>`
          )
          .join("");
      }

      if (dept.benefitItems && dept.benefitItems.length) {
        extraHtml += `
          <section class="dept-detail-section reveal" aria-labelledby="dept-benefits-heading">
            <div class="dept-detail-section-inner">
              <header class="dept-detail-section-header dept-detail-section-header--center">
                <p class="dept-label">Why Choose Us</p>
                <h2 id="dept-benefits-heading">Benefits of Ayurveda Cosmetology</h2>
              </header>
              <div class="dept-benefit-grid">
                ${dept.benefitItems
                  .map(
                    (item) => `
                  <article class="dept-benefit-card">
                    <h3>${item.title}</h3>
                    <p>${item.content}</p>
                  </article>`
                  )
                  .join("")}
              </div>
            </div>
          </section>`;
      }

      if (dept.serviceDetails && dept.serviceDetails.length) {
        extraHtml += `
          <section class="dept-detail-section dept-detail-section--alt reveal" aria-labelledby="dept-services-detail-heading">
            <div class="dept-detail-section-inner">
              <header class="dept-detail-section-header dept-detail-section-header--center">
                <p class="dept-label">Our Services</p>
                <h2 id="dept-services-detail-heading">Our Services</h2>
              </header>
              <div class="dept-service-detail-grid">
                ${dept.serviceDetails
                  .map(
                    (item) => `
                  <article class="dept-service-detail-card">
                    <h3>${item.title}</h3>
                    <p>${item.content}</p>
                  </article>`
                  )
                  .join("")}
              </div>
            </div>
          </section>`;
      }

      if (dept.listSections && dept.listSections.length) {
        extraHtml += dept.listSections
          .map(
            (section) => `
          <section class="dept-detail-section reveal" aria-labelledby="dept-list-${slugify(section.title)}">
            <div class="dept-detail-section-inner">
              <header class="dept-detail-section-header">
                <h2 id="dept-list-${slugify(section.title)}">${section.title}</h2>
              </header>
              <ul class="dept-detail-list">
                ${section.items.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </div>
          </section>`
          )
          .join("");
      }

      if (dept.departmentColumns && dept.departmentColumns.length) {
        extraHtml += `
          <section class="dept-detail-section dept-detail-section--alt reveal" aria-labelledby="dept-depts-heading">
            <div class="dept-detail-section-inner">
              <header class="dept-detail-section-header dept-detail-section-header--center">
                <p class="dept-label">Specialities</p>
                <h2 id="dept-depts-heading">Our Departments</h2>
              </header>
              <div class="dept-dept-columns">
                ${dept.departmentColumns
                  .map(
                    (col) => `
                  <ul class="dept-dept-column">
                    ${col
                      .map(
                        (item) => `
                      <li>
                        <strong>${item.title}</strong>
                        <span>${item.content}</span>
                      </li>`
                      )
                      .join("")}
                  </ul>`
                  )
                  .join("")}
              </div>
            </div>
          </section>`;
      }

      if (dept.highlights && dept.highlights.length) {
        extraHtml += `
          <section class="dept-detail-section reveal" aria-labelledby="dept-highlights-heading">
            <div class="dept-detail-section-inner">
              <ul class="dept-highlights" aria-labelledby="dept-highlights-heading">
                ${dept.highlights.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </div>
          </section>`;
      }

      if (extraHtml) {
        extraRoot.hidden = false;
        extraRoot.innerHTML = extraHtml;
      } else {
        extraRoot.hidden = true;
        extraRoot.innerHTML = "";
      }
    }

    const servicesSection = servicesList ? servicesList.closest(".dept-detail-section") : null;
    const hasDetailedServices = dept.serviceDetails && dept.serviceDetails.length;

    if (servicesList) {
      if (hasDetailedServices) {
        if (servicesSection) servicesSection.hidden = true;
      } else if (dept.services && dept.services.length) {
        if (servicesSection) servicesSection.hidden = false;
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
      } else if (servicesSection) {
        servicesSection.hidden = true;
      }
    }

    if (doctorsGrid) {
      const doctorsSection = doctorsGrid.closest(".dept-detail-doctors");
      if (!dept.doctors || !dept.doctors.length) {
        if (doctorsSection) doctorsSection.hidden = true;
        doctorsGrid.innerHTML = "";
      } else {
        if (doctorsSection) doctorsSection.hidden = false;
        doctorsGrid.innerHTML = dept.doctors
          .map(
            (doc) => `
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
    }

    if (deptSelect) {
      const hospitalDepts = window.getHospitalDepartments ? window.getHospitalDepartments() : window.PADIYATH_DEPARTMENTS;
      deptSelect.innerHTML = hospitalDepts
        .map(
          (d) => `<option value="${d.name}"${d.slug === dept.slug ? " selected" : ""}>${d.name}</option>`
        )
        .join("");
      deptSelect.dataset.selected = dept.name;
    }

    if (doctorSelect && dept.doctors && dept.doctors.length) {
      doctorSelect.innerHTML =
        `<option value="">Any available doctor</option>` +
        dept.doctors.map((doc) => `<option value="${doc.name}">${doc.name}</option>`).join("");
    }
  }

  function deptCardHtml(dept, i) {
    const imgSrc = dept.logo || dept.image;
    const imgClass = dept.logo ? "dept-logo" : "";
    return `
      <a href="department.html?dept=${dept.slug}" class="dept-card reveal reveal-delay-${Math.min(i + 1, 5)}" data-tilt>
        <div class="dept-card-media ${dept.mediaClass}">
          <img class="${imgClass}" src="${imgSrc}" alt="${dept.name}" loading="lazy" decoding="async" />
          ${dept.logo ? "" : '<div class="dept-card-overlay"></div>'}
        </div>
        <div class="dept-card-body">
          <h3>${dept.name}</h3>
          <p>${dept.shortDescription}</p>
          <span class="dept-card-link">
            View Details
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </a>`;
  }

  function renderPharmaPageContent() {
    const p = window.PADIYATH_PHARMACEUTICALS;
    if (!p) return;

    const descFull = document.querySelector("[data-pharma-desc-full]");
    const descExt = document.querySelector("[data-pharma-desc-ext]");
    const stats = document.querySelector("[data-pharma-stats]");
    const clinics = document.querySelector("[data-pharma-clinics-preview]");

    if (descFull) descFull.textContent = p.description;
    if (descExt) descExt.textContent = p.descriptionExtended;
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
    if (clinics && p.clinics) {
      clinics.innerHTML = p.clinics
        .map(
          (clinic) => `
        <article class="pharma-clinic-card">
          <h3>${clinic.name}</h3>
          <p class="pharma-clinic-address">${clinic.address}</p>
          <p class="pharma-clinic-phone"><a href="tel:${clinic.phone.replace(/\s/g, "")}">${clinic.phone}</a></p>
        </article>`
        )
        .join("");
    }
  }

  function renderHomeDepartments() {
    const homeGrid = document.querySelector("[data-dept-grid-home]");
    if (!homeGrid || !window.getHospitalDepartments) return;

    homeGrid.innerHTML = window
      .getHospitalDepartments()
      .map((dept, i) => deptCardHtml(dept, i))
      .join("");
  }

  function renderDepartmentsListing() {
    const hospitalGrid = document.querySelector("[data-dept-grid-hospital]");
    const pharmaCard = document.querySelector("[data-pharma-card]");
    const depts = window.getHospitalDepartments
      ? window.getHospitalDepartments()
      : window.PADIYATH_DEPARTMENTS;

    if (pharmaCard && window.PADIYATH_PHARMACEUTICALS) {
      const p = window.PADIYATH_PHARMACEUTICALS;
      pharmaCard.href = "pharmaceuticals.html";
      const title = pharmaCard.querySelector("[data-pharma-title]");
      const desc = pharmaCard.querySelector("[data-pharma-desc]");
      const img = pharmaCard.querySelector("img");
      if (title) title.textContent = p.name;
      if (desc) desc.textContent = p.shortDescription;
      if (img) {
        img.src = p.image;
        img.alt = p.name;
      }
    }

    const grid = hospitalGrid || document.querySelector("[data-dept-grid]");
    if (!grid || !depts) return;

    grid.innerHTML = depts.map((dept, i) => deptCardHtml(dept, i)).join("");
  }

  function renderDepartmentsIntroPage() {
    const intro = document.querySelector("[data-pharma-intro]");
    if (!intro || !window.PADIYATH_PHARMACEUTICALS) return;
    intro.textContent = window.PADIYATH_PHARMACEUTICALS.shortDescription;
  }

  function initDynamicDeptSections() {
    renderDepartmentsIntroPage();
    renderPharmaPageContent();
    renderHomeDepartments();

    document.querySelectorAll("[data-dept-grid-home], [data-dept-grid-hospital], .departments-page-section").forEach((section) => {
      initDeptCardTilt(section);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderDepartmentDetail();
    renderDepartmentsListing();
    initDynamicDeptSections();
    initReveal();
    initDeptForm();

    const listing = document.querySelector(".departments-page-section");
    if (listing) {
      initDeptCursorGlow(listing);
    }

    const featured = document.getElementById("featured-departments");
    if (featured) {
      initDeptCursorGlow(featured);
    }

    const pharmaSection = document.querySelector(".dept-division-section");
    if (pharmaSection) {
      initDeptCardTilt(pharmaSection);
    }

    initFooter();
    initBackToTop();
  });
})();
