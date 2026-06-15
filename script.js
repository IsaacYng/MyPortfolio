/* ===================================================================
   ISHAK YONGHANG (ISAAC) — PORTFOLIO
   Vanilla JavaScript: icons, route progress, modals,
   poem mini-app, story slider, scroll reveals.
=================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. RENDER LUCIDE ICONS ---------- */
  if (window.lucide) {
    lucide.createIcons();
  }

  /* ---------- 2. FOOTER YEAR ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 3. ROUTE RAIL — scroll progress along the "road" ---------- */
  const routeFill = document.querySelector(".route-fill");
  const routeMarker = document.getElementById("routeMarker");
  const railLength = 1000; // matches path length in viewBox (M2,0 L2,1000)

  function updateRouteProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    if (routeFill) {
      const offset = railLength - (railLength * progress);
      routeFill.style.strokeDashoffset = offset;
    }
    if (routeMarker) {
      routeMarker.style.top = `${progress * 100}%`;
    }
  }

  updateRouteProgress();
  window.addEventListener("scroll", updateRouteProgress, { passive: true });
  window.addEventListener("resize", updateRouteProgress);

  /* ---------- 4. THEME TOGGLE (alternate accent palette) ---------- */
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      document.documentElement.setAttribute("data-theme", current === "alt" ? "" : "alt");
    });
  }

  /* ---------- 5. SCROLL-REVEAL ANIMATIONS ---------- */
  const revealTargets = document.querySelectorAll(
    ".section-head, .card, .experience-card, .poem-app, .story-slider, .timeline-item"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ---------- 6. CERTIFICATE PREVIEW MODAL ---------- */
  // Map each "data-modal-target" key to a certificate image source.
  // Replace these URLs with your actual scanned certificate images.
  const certificateImages = {
    "cert-plus2": {
      title: "+2 (Higher Secondary) Certificate",
      src: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&h=1000&fit=crop"
    },
    "cert-see": {
      title: "SEE Certificate",
      src: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&h=1000&fit=crop"
    },
    "cert-operator": {
      title: "Computer Operator Course Certificate",
      src: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&h=1000&fit=crop"
    },
    "cert-revision": {
      title: "Basic Revision Course Certificate",
      src: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&h=1000&fit=crop"
    }
  };

  const modalOverlay = document.getElementById("modalOverlay");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalClose = document.getElementById("modalClose");

  function openModal(key) {
    const data = certificateImages[key];
    if (!data) return;
    modalImage.src = data.src;
    modalImage.alt = data.title;
    modalTitle.textContent = data.title;
    modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-modal-target]").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.dataset.modalTarget));
  });

  modalClose.addEventListener("click", closeModal);

  // Close on overlay click (outside the box) or Escape key
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("open")) {
      closeModal();
    }
  });

  /* ---------- 7. POEM MINI-APP (Add / Remove) ---------- */
  const poemForm = document.getElementById("poemForm");
  const poemInput = document.getElementById("poemInput");
  const poemList = document.getElementById("poemList");
  const poemEmpty = document.getElementById("poemEmpty");

  // A starter poem so the section isn't empty on first load
  const initialPoems = [
    "On the road home, the headlights hum a tune\nonly tired riders understand."
  ];

  function refreshEmptyState() {
    poemEmpty.classList.toggle("hidden", poemList.children.length > 0);
  }

  function addPoemToList(text) {
    const li = document.createElement("li");
    li.className = "poem-item";

    const p = document.createElement("p");
    p.className = "poem-text";
    p.textContent = text;

    const removeBtn = document.createElement("button");
    removeBtn.className = "poem-remove";
    removeBtn.setAttribute("aria-label", "Remove this poem");
    removeBtn.innerHTML = '<i data-lucide="trash-2"></i>';

    removeBtn.addEventListener("click", () => {
      li.style.opacity = "0";
      li.style.transform = "translateY(-8px)";
      setTimeout(() => {
        li.remove();
        refreshEmptyState();
      }, 200);
    });

    li.appendChild(p);
    li.appendChild(removeBtn);
    poemList.appendChild(li);

    // Render the newly added trash icon
    if (window.lucide) lucide.createIcons();
    refreshEmptyState();
  }

  initialPoems.forEach(addPoemToList);

  poemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = poemInput.value.trim();
    if (!value) return;
    addPoemToList(value);
    poemInput.value = "";
    poemInput.focus();
  });

  /* ---------- 8. STORY-STYLE PHOTO SLIDER ---------- */
  const storyTrack = document.getElementById("storyTrack");
  const storyPrev = document.getElementById("storyPrev");
  const storyNext = document.getElementById("storyNext");
  const storyProgress = document.getElementById("storyProgress");
  const slides = storyTrack.querySelectorAll(".story-slide");
  let currentSlide = 0;

  // Build progress bar segments
  slides.forEach(() => {
    const span = document.createElement("span");
    storyProgress.appendChild(span);
  });
  const progressSegments = storyProgress.querySelectorAll("span");

  function updateSlider() {
    storyTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    progressSegments.forEach((seg, i) => {
      seg.classList.toggle("filled", i <= currentSlide);
    });
  }

  function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    updateSlider();
  }

  storyPrev.addEventListener("click", () => goToSlide(currentSlide - 1));
  storyNext.addEventListener("click", () => goToSlide(currentSlide + 1));

  // Keyboard navigation when slider is focused/visible
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goToSlide(currentSlide - 1);
    if (e.key === "ArrowRight") goToSlide(currentSlide + 1);
  });

  // Swipe support (touch)
  let touchStartX = 0;
  const SWIPE_THRESHOLD = 40;

  storyTrack.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  storyTrack.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      diff > 0 ? goToSlide(currentSlide + 1) : goToSlide(currentSlide - 1);
    }
  }, { passive: true });

  updateSlider();

  /* ---------- 9. NAVBAR ACTIVE LINK ON SCROLL ---------- */
  const sections = document.querySelectorAll("main section, footer");
  const navLinks = document.querySelectorAll(".nav-icons a");

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.style.color = "";
          link.style.background = "";
        });
        const activeLink = document.querySelector(`.nav-icons a[href="#${id}"]`);
        if (activeLink) {
          activeLink.style.color = "var(--teal)";
          activeLink.style.background = "var(--teal-soft)";
        }
      }
    });
  }, { threshold: 0.4, rootMargin: "-80px 0px -50% 0px" });

  sections.forEach((sec) => {
    if (sec.id) navObserver.observe(sec);
  });

});
