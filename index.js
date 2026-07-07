(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Fade-up reveal ── */
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

  /* ── Count-up statistics ── */
  function animateCount(el, target, suffix, duration) {
    const start = performance.now();
    const isLarge = target >= 1000;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      el.textContent = isLarge
        ? current.toLocaleString("en-IN") + suffix
        : current + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  function initCountUp() {
    const counters = document.querySelectorAll(".count-up, .impact-count");
    if (!counters.length) return;

    if (prefersReducedMotion) {
      counters.forEach((el) => {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || "";
        el.textContent =
          target >= 1000 ? target.toLocaleString("en-IN") + suffix : target + suffix;
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || "";
          animateCount(el, target, suffix, 1800);
          observer.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  /* ── About section parallax ── */
  function initAboutParallax() {
    const visual = document.querySelector("[data-parallax]");
    const imageWrap = visual?.querySelector(".about-image-wrap");
    if (!visual || !imageWrap || prefersReducedMotion) return;

    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;
    let currentX = 0;
    let currentY = 0;
    let currentScroll = 0;

    function updateScroll() {
      const rect = visual.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      scrollY = (center - viewCenter) * 0.04;
    }

    function lerp() {
      currentX += (mouseX - currentX) * 0.07;
      currentY += (mouseY - currentY) * 0.07;
      currentScroll += (scrollY - currentScroll) * 0.07;
      imageWrap.style.transform = `translate(${currentX}px, ${currentY + currentScroll}px)`;
      requestAnimationFrame(lerp);
    }

    visual.addEventListener("mousemove", (e) => {
      const rect = visual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 12;
      mouseY = y * 10;
    });

    visual.addEventListener("mouseleave", () => {
      mouseX = 0;
      mouseY = 0;
    });

    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    requestAnimationFrame(lerp);
  }

  /* ── Departments: cursor glow ── */
  function initDeptCursorGlow(section) {
    const glow = section.querySelector(".dept-cursor-glow");
    if (!glow || prefersReducedMotion) return;

    section.addEventListener("mousemove", (e) => {
      const rect = section.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
    });
  }

  /* ── Departments: 3D card tilt ── */
  function initDeptCardTilt(section) {
    const cards = section.querySelectorAll("[data-tilt]");
    if (!cards.length || prefersReducedMotion) return;

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ── Departments: featured parallax ── */
  function initDeptFeaturedParallax(section) {
    const featured = section.querySelector("[data-dept-parallax]");
    const imageWrap = featured?.querySelector(".dept-featured-image-wrap");
    if (!featured || !imageWrap || prefersReducedMotion) return;

    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;
    let cx = 0;
    let cy = 0;
    let cs = 0;

    function updateScroll() {
      const rect = featured.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      scrollY = (center - window.innerHeight / 2) * 0.035;
    }

    function tick() {
      cx += (mouseX - cx) * 0.06;
      cy += (mouseY - cy) * 0.06;
      cs += (scrollY - cs) * 0.06;
      imageWrap.style.transform = `translate(${cx}px, ${cy + cs}px)`;
      requestAnimationFrame(tick);
    }

    featured.addEventListener("mousemove", (e) => {
      const rect = featured.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    });

    featured.addEventListener("mouseleave", () => {
      mouseX = 0;
      mouseY = 0;
    });

    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    requestAnimationFrame(tick);
  }

  function initDepartments() {
    const section = document.querySelector(".departments-section");
    if (!section) return;

    initDeptCursorGlow(section);
    initDeptCardTilt(section);
    initDeptFeaturedParallax(section);
  }

  /* ── Specialists: cursor glow ── */
  function initSpecCursorGlow(section) {
    const glow = section.querySelector(".spec-cursor-glow");
    if (!glow || prefersReducedMotion) return;

    section.addEventListener("mousemove", (e) => {
      const rect = section.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
    });
  }

  /* ── Specialists: 3D card tilt ── */
  function initSpecCardTilt(section) {
    const cards = section.querySelectorAll("[data-doc-tilt]");
    if (!cards.length || prefersReducedMotion) return;

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ── Specialists: featured parallax ── */
  function initSpecFeaturedParallax(section) {
    const featured = section.querySelector("[data-spec-parallax]");
    const portrait = featured?.querySelector(".spec-featured-portrait");
    if (!featured || !portrait || prefersReducedMotion) return;

    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;
    let cx = 0;
    let cy = 0;
    let cs = 0;

    function updateScroll() {
      const rect = featured.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      scrollY = (center - window.innerHeight / 2) * 0.03;
    }

    function tick() {
      cx += (mouseX - cx) * 0.06;
      cy += (mouseY - cy) * 0.06;
      cs += (scrollY - cs) * 0.06;
      portrait.style.transform = `translate(${cx}px, ${cy + cs}px)`;
      requestAnimationFrame(tick);
    }

    featured.addEventListener("mousemove", (e) => {
      const rect = featured.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    });

    featured.addEventListener("mouseleave", () => {
      mouseX = 0;
      mouseY = 0;
    });

    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    requestAnimationFrame(tick);
  }

  function initSpecialists() {
    const section = document.querySelector(".specialists-section");
    if (!section) return;

    initSpecCursorGlow(section);
    initSpecCardTilt(section);
    initSpecFeaturedParallax(section);
  }

  /* ── Why Choose Us ── */
  function initWhyCursorGlow(section) {
    const glow = section.querySelector(".why-cursor-glow");
    if (!glow || prefersReducedMotion) return;

    section.addEventListener("mousemove", (e) => {
      const rect = section.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
    });
  }

  function initWhyCardTilt(section) {
    const cards = section.querySelectorAll("[data-why-tilt]");
    if (!cards.length || prefersReducedMotion) return;

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const offsetY = card.classList.contains("why-card--offset-2")
          ? 1.5
          : card.classList.contains("why-card--offset-1")
            ? 0.75
            : 0;
        card.style.transform = `translateY(${-6 + offsetY * 16}px) perspective(700px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = offsetForCard(card);
      });
    });

    function offsetForCard(card) {
      if (card.classList.contains("why-card--offset-2")) return "translateY(1.5rem)";
      if (card.classList.contains("why-card--offset-1")) return "translateY(0.75rem)";
      return "";
    }
  }

  function initWhyParallax(section) {
    const visual = section.querySelector("[data-why-parallax]");
    const illustration = visual?.querySelector(".why-illustration");
    if (!visual || !illustration || prefersReducedMotion) return;

    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;
    let cx = 0;
    let cy = 0;
    let cs = 0;

    function updateScroll() {
      const rect = visual.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      scrollY = (center - window.innerHeight / 2) * 0.025;
    }

    function tick() {
      cx += (mouseX - cx) * 0.06;
      cy += (mouseY - cy) * 0.06;
      cs += (scrollY - cs) * 0.06;
      illustration.style.transform = `translate(${cx}px, ${cy + cs}px)`;
      requestAnimationFrame(tick);
    }

    visual.addEventListener("mousemove", (e) => {
      const rect = visual.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    });

    visual.addEventListener("mouseleave", () => {
      mouseX = 0;
      mouseY = 0;
    });

    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    requestAnimationFrame(tick);
  }

  function initWhyChoose() {
    const section = document.querySelector(".why-section");
    if (!section) return;

    initWhyCursorGlow(section);
    initWhyCardTilt(section);
    initWhyParallax(section);
  }

  /* ── Impact section ── */
  function initImpactCursorGlow(section) {
    const glow = section.querySelector(".impact-cursor-glow");
    if (!glow || prefersReducedMotion) return;

    section.addEventListener("mousemove", (e) => {
      const rect = section.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
    });
  }

  function initImpactParallax(section) {
    const wrap = section.querySelector("[data-impact-parallax]");
    const dashboard = wrap?.querySelector(".impact-dashboard");
    if (!wrap || !dashboard || prefersReducedMotion) return;

    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;
    let cx = 0;
    let cy = 0;
    let cs = 0;

    function updateScroll() {
      const rect = wrap.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      scrollY = (center - window.innerHeight / 2) * 0.02;
    }

    function tick() {
      cx += (mouseX - cx) * 0.06;
      cy += (mouseY - cy) * 0.06;
      cs += (scrollY - cs) * 0.06;
      dashboard.style.transform = `translate(${cx}px, ${cy + cs}px)`;
      requestAnimationFrame(tick);
    }

    wrap.addEventListener("mousemove", (e) => {
      const rect = wrap.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
    });

    wrap.addEventListener("mouseleave", () => {
      mouseX = 0;
      mouseY = 0;
    });

    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    requestAnimationFrame(tick);
  }

  function initImpact() {
    const section = document.querySelector(".impact-section");
    if (!section) return;

    initImpactCursorGlow(section);
    initImpactParallax(section);
  }

  /* ── Testimonials ── */
  function initTestiCursorGlow(section) {
    const glow = section.querySelector(".testi-cursor-glow");
    if (!glow || prefersReducedMotion) return;

    section.addEventListener("mousemove", (e) => {
      const rect = section.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
    });
  }

  function initTestimonialCarousel() {
    const carousel = document.querySelector("[data-testi-carousel]");
    const track = carousel?.querySelector(".testi-carousel-track");
    if (!carousel || !track) return;

    const originals = [...track.querySelectorAll("[data-testi-card]")];
    originals.forEach((card) => track.appendChild(card.cloneNode(true)));

    let isPaused = false;
    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;
    let rafId = null;
    const speed = prefersReducedMotion ? 0 : 0.6;

    function loopWidth() {
      return track.scrollWidth / 2;
    }

    function tick() {
      if (!isPaused && !isDragging && speed > 0) {
        carousel.scrollLeft += speed;
        const half = loopWidth();
        if (carousel.scrollLeft >= half) {
          carousel.scrollLeft -= half;
        }
      }
      updateActiveCard();
      rafId = requestAnimationFrame(tick);
    }

    function updateActiveCard() {
      const cards = track.querySelectorAll("[data-testi-card]");
      const center = carousel.scrollLeft + carousel.offsetWidth / 2;
      let closest = null;
      let minDist = Infinity;

      cards.forEach((card) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - cardCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = card;
        }
      });

      cards.forEach((card) => card.classList.remove("is-active"));
      if (closest) closest.classList.add("is-active");
    }

    carousel.addEventListener("mouseenter", () => {
      isPaused = true;
    });
    carousel.addEventListener("mouseleave", () => {
      if (!isDragging) isPaused = false;
    });

    carousel.addEventListener("pointerdown", (e) => {
      isDragging = true;
      isPaused = true;
      startX = e.clientX;
      scrollStart = carousel.scrollLeft;
      carousel.classList.add("is-dragging");
      carousel.setPointerCapture(e.pointerId);
    });

    carousel.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      carousel.scrollLeft = scrollStart - dx;
      const half = loopWidth();
      if (carousel.scrollLeft < 0) carousel.scrollLeft += half;
      if (carousel.scrollLeft >= half) carousel.scrollLeft -= half;
    });

    function endDrag(e) {
      if (!isDragging) return;
      isDragging = false;
      isPaused = false;
      carousel.classList.remove("is-dragging");
      try {
        carousel.releasePointerCapture(e.pointerId);
      } catch (_) {
        /* pointer may already be released */
      }
    }

    carousel.addEventListener("pointerup", endDrag);
    carousel.addEventListener("pointercancel", endDrag);

    carousel.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        carousel.scrollLeft += e.deltaY * 0.5;
        e.preventDefault();
      }
    }, { passive: false });

    updateActiveCard();
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }

  function initTestimonials() {
    const section = document.querySelector(".testi-section");
    if (!section) return;

    initTestiCursorGlow(section);
    initTestimonialCarousel();
  }

  /* ── Book Appointment ── */
  function initBookCursorGlow(section) {
    const glow = section.querySelector(".book-cursor-glow");
    if (!glow || prefersReducedMotion) return;

    section.addEventListener("mousemove", (e) => {
      const rect = section.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
    });
  }

  function initBookParallax(section) {
    const wrap = section.querySelector("[data-book-parallax]");
    const illustration = wrap?.querySelector(".book-illustration");
    if (!wrap || !illustration || prefersReducedMotion) return;

    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;
    let cx = 0;
    let cy = 0;
    let cs = 0;

    function updateScroll() {
      const rect = wrap.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      scrollY = (center - window.innerHeight / 2) * 0.025;
    }

    function tick() {
      cx += (mouseX - cx) * 0.06;
      cy += (mouseY - cy) * 0.06;
      cs += (scrollY - cs) * 0.06;
      illustration.style.transform = `translate(${cx}px, ${cy + cs}px)`;
      requestAnimationFrame(tick);
    }

    wrap.addEventListener("mousemove", (e) => {
      const rect = wrap.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    });

    wrap.addEventListener("mouseleave", () => {
      mouseX = 0;
      mouseY = 0;
    });

    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    requestAnimationFrame(tick);
  }

  function initBookForm() {
    const form = document.querySelector(".book-form");
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
        }, 2500);
      }
    });
  }

  function initBookAppointment() {
    const section = document.querySelector(".book-section");
    if (!section) return;

    initBookCursorGlow(section);
    initBookParallax(section);
    initBookForm();
  }

  /* ── Footer ── */
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

    const showAfter = 420;

    function updateVisibility() {
      const visible = window.scrollY > showAfter;
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

  document.addEventListener("DOMContentLoaded", () => {
    initReveal();
    initCountUp();
    initAboutParallax();
    initDepartments();
    initSpecialists();
    initWhyChoose();
    initImpact();
    initTestimonials();
    initBookAppointment();
    initFooter();
    initBackToTop();
  });
})();
