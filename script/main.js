window.onload = () => {
  const preloader = document.getElementById("preloader");
  preloader.classList.add("loaded");
  setTimeout(() => preloader.remove(), 600);
};

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("main-header");
  const heroSection = document.getElementById("hero");
  const themeToggle = document.getElementById("theme-toggle");
  const backToTopButton = document.getElementById("back-to-top");
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const modal = document.getElementById("modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalCloseButton = document.getElementById("modal-close-button");
  const kbdHint = document.getElementById("kbd-hint");

  // --- Theme Toggler ---
  const applyTheme = (theme) => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  };
  // Default to dark mode if no theme is saved
  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    applyTheme(isDark ? "light" : "dark");
  });

  // --- Header Visibility on Scroll ---
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        header.classList.toggle("header-hidden", entry.isIntersecting);
      });
    },
    { threshold: 0.1 }
  );
  if (heroSection) {
    heroObserver.observe(heroSection);
  }

  // --- Keyboard Hint Popup ---
  if (kbdHint) {
    setTimeout(() => {
      kbdHint.classList.add("show");
      setTimeout(() => {
        kbdHint.classList.remove("show");
      }, 4000); // Hint visible for 4 seconds
    }, 2000); // Show hint after 2 seconds
  }

  // --- Mobile Menu ---
  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
  });
  mobileMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      mobileMenu.classList.remove("open");
    }
  });

  // --- Back-to-Top Button ---
  window.addEventListener(
    "scroll",
    () => {
      const isScrolled = window.scrollY > window.innerHeight * 0.8;
      backToTopButton.classList.toggle("opacity-0", !isScrolled);
      backToTopButton.classList.toggle("translate-y-4", !isScrolled);
    },
    { passive: true }
  );
  backToTopButton.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  // --- Smooth Scroll for Anchors ---
  const smoothScrollTo = (selector) => {
    const target = document.querySelector(selector);
    if (target) {
      mobileMenu.classList.remove("open");
      target.scrollIntoView({ behavior: "smooth" });
    }
  };
  document
    .querySelectorAll('a[href^="#"]:not(#modal-link)')
    .forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        smoothScrollTo(this.getAttribute("href"));
      });
    });

  // --- Keyboard Shortcuts ---
  const shortcuts = {
    1: "#about",
    2: "#shaders",
    3: "#art",
    4: "#games",
    5: "#contact",
  };
  document.addEventListener("keydown", (e) => {
    if (shortcuts[e.key] && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      smoothScrollTo(shortcuts[e.key]);
    }
  });

  // --- Modal Logic ---
  const panels = document.querySelectorAll(".panel");
  const openModal = (el) => {
    const modalImageContainer = document.getElementById("modal-image");
    const isVideo =
      el.dataset.image.endsWith(".mp4") || el.dataset.image.endsWith(".webm");

    if (isVideo) {
      // Replace the image element with a video element
      const videoElement = document.createElement("video");
      videoElement.src = el.dataset.image;
      videoElement.autoplay = true;
      videoElement.loop = true;
      videoElement.controls = true;
      videoElement.muted = true;
      videoElement.className = modalImageContainer.className;
      modalImageContainer.replaceWith(videoElement);
      videoElement.id = "modal-image";
    } else {
      // Restore the image element if it's not a video
      if (modalImageContainer.tagName !== "IMG") {
        const imgElement = document.createElement("img");
        imgElement.src = el.dataset.image;
        imgElement.alt = "Project Image";
        imgElement.className = modalImageContainer.className;
        modalImageContainer.replaceWith(imgElement);
        imgElement.id = "modal-image";
      } else {
        modalImageContainer.src = el.dataset.image;
      }
    }

    document.getElementById("modal-title").textContent = el.dataset.title;
    document.getElementById("modal-description").textContent =
      el.dataset.description;

    const modalLinkButton = document.getElementById("modal-link");
    const projectLink = el.dataset.link;

    if (projectLink && projectLink !== "#") {
      modalLinkButton.href = projectLink;
      modalLinkButton.classList.remove("hidden");
    } else {
      modalLinkButton.classList.add("hidden");
    }

    modal.classList.remove("hidden");
    modalBackdrop.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      modal
        .querySelectorAll(".modal-content-animate")
        .forEach((item) => item.classList.add("is-active"));
    }, 50);
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    modalBackdrop.classList.add("hidden");
    document.body.style.overflow = "";

    modal
      .querySelectorAll(".modal-content-animate")
      .forEach((item) => item.classList.remove("is-active"));
  };
  panels.forEach((panel) =>
    panel.addEventListener("click", () => openModal(panel))
  );
  modalCloseButton.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });

  // --- Active Nav Link on Scroll ---
  const sections = document.querySelectorAll("section, footer#contact");
  const navLinks = document.querySelectorAll(".nav-link");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`
            );
          });
        }
      });
    },
    { rootMargin: "-50% 0px -50% 0px" }
  );
  sections.forEach((section) => sectionObserver.observe(section));

  // --- General Scroll Animation (Re-triggers on scroll) ---
  const animatedElements = document.querySelectorAll(".scroll-animate");
  const generalObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.1 }
  );
  animatedElements.forEach((el) => generalObserver.observe(el));

  // --- Carousel Logic ---
  document.querySelectorAll(".carousel").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const items = Array.from(track.children);
    const prevBtn = carousel.querySelector(".prev-btn");
    const nextBtn = carousel.querySelector(".next-btn");
    let autoSlideInterval;

    if (items.length === 0) {
      if (carousel) carousel.style.display = "none";
      return;
    }

    let currentIndex = 0;

    const getItemsPerPage = () => {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    };

    const updateCarousel = (disableTransition = false) => {
      const itemsPerPage = getItemsPerPage();
      const totalItems = items.length;

      if (disableTransition) track.style.transition = "none";

      if (totalItems <= itemsPerPage) {
        track.classList.add("justify-center");
        track.style.transform = "translateX(0)";
        if (prevBtn) prevBtn.style.display = "none";
        if (nextBtn) nextBtn.style.display = "none";
      } else {
        track.classList.remove("justify-center");
        if (prevBtn) prevBtn.style.display = "flex";
        if (nextBtn) nextBtn.style.display = "flex";
        const itemWidthPercent = 100 / itemsPerPage;
        track.style.transform = `translateX(-${
          currentIndex * itemWidthPercent
        }%)`;
      }

      if (disableTransition) {
        setTimeout(() => {
          track.style.transition = "transform 0.5s ease-in-out";
        }, 50);
      }
    };

    const slideNext = () => {
      const itemsPerPage = getItemsPerPage();
      const totalItems = items.length;
      if (totalItems <= itemsPerPage) return;

      currentIndex++;
      if (currentIndex > totalItems - itemsPerPage) {
        currentIndex = 0;
      }
      updateCarousel();
    };

    const slidePrev = () => {
      const itemsPerPage = getItemsPerPage();
      const totalItems = items.length;
      if (totalItems <= itemsPerPage) return;

      currentIndex--;
      if (currentIndex < 0) {
        currentIndex = totalItems - itemsPerPage;
      }
      updateCarousel();
    };

    const startAutoSlide = () => {
      if (items.length > 3) {
        stopAutoSlide();
        autoSlideInterval = setInterval(slideNext, 5000);
      }
    };

    const stopAutoSlide = () => {
      clearInterval(autoSlideInterval);
    };

    prevBtn.addEventListener("click", () => {
      slidePrev();
      stopAutoSlide();
      startAutoSlide();
    });

    nextBtn.addEventListener("click", () => {
      slideNext();
      stopAutoSlide();
      startAutoSlide();
    });

    carousel.addEventListener("mouseenter", stopAutoSlide);
    carousel.addEventListener("mouseleave", startAutoSlide);

    window.addEventListener(
      "resize",
      () => {
        updateCarousel(true);
        startAutoSlide();
      },
      { passive: true }
    );

    updateCarousel();
    startAutoSlide();
  });
});
