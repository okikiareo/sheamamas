// Hero Slider
class HeroSlider {
  constructor() {
    this.slides = document.querySelectorAll(".hero-slide");
    this.dots = document.querySelectorAll(".dot");
    this.prevBtn = document.querySelector(".slider-arrow.prev");
    this.nextBtn = document.querySelector(".slider-arrow.next");
    this.currentSlide = 0;
    this.isTransitioning = false;
    this.autoplayInterval = null;
    this.transitions = ["grid", "flip", "tile"];

    this.init();
  }

  init() {
    // Event listeners
    this.nextBtn.addEventListener("click", () => this.nextSlide());
    this.prevBtn.addEventListener("click", () => this.prevSlide());

    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToSlide(index));
    });

    // Start autoplay
    this.startAutoplay();

    // Pause on hover
    document
      .querySelector(".hero")
      .addEventListener("mouseenter", () => this.stopAutoplay());
    document
      .querySelector(".hero")
      .addEventListener("mouseleave", () => this.startAutoplay());
  }

  nextSlide() {
    if (this.isTransitioning) return;
    const next = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(next);
  }

  prevSlide() {
    if (this.isTransitioning) return;
    const prev =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prev);
  }

  goToSlide(index) {
    if (this.isTransitioning || index === this.currentSlide) return;

    this.isTransitioning = true;
    const currentSlideEl = this.slides[this.currentSlide];
    const nextSlideEl = this.slides[index];

    // Choose random transition
    const transitionType =
      this.transitions[Math.floor(Math.random() * this.transitions.length)];

    // Apply transition
    this.applyTransition(currentSlideEl, nextSlideEl, transitionType, () => {
      // Update active states
      this.slides[this.currentSlide].classList.remove("active");
      this.dots[this.currentSlide].classList.remove("active");

      this.currentSlide = index;
      this.slides[this.currentSlide].classList.add("active");
      this.dots[this.currentSlide].classList.add("active");

      this.isTransitioning = false;

      // Restart typing animation
      this.restartTypingAnimation(nextSlideEl);
    });
  }

  applyTransition(currentSlide, nextSlide, type, callback) {
    switch (type) {
      case "grid":
        this.gridTransition(currentSlide, nextSlide, callback);
        break;
      case "flip":
        this.flipTransition(currentSlide, nextSlide, callback);
        break;
      case "tile":
        this.tileTransition(currentSlide, nextSlide, callback);
        break;
    }
  }

  gridTransition(currentSlide, nextSlide, callback) {
    const overlay = document.createElement("div");
    overlay.className = "grid-transition";

    // Create grid tiles
    for (let i = 0; i < 24; i++) {
      const tile = document.createElement("div");
      tile.className = "grid-tile";
      overlay.appendChild(tile);
    }

    currentSlide.appendChild(overlay);

    // Animate tiles in random order
    const tiles = overlay.querySelectorAll(".grid-tile");
    const tileArray = Array.from(tiles);
    tileArray.sort(() => Math.random() - 0.5);

    tileArray.forEach((tile, index) => {
      setTimeout(() => {
        tile.style.opacity = "1";
        tile.style.transition = "opacity 0.3s";
      }, index * 30);
    });

    setTimeout(() => {
      callback();
      setTimeout(() => {
        overlay.remove();
      }, 100);
    }, tileArray.length * 30 + 300);
  }

  flipTransition(currentSlide, nextSlide, callback) {
    const currentBg = currentSlide.querySelector(".slide-background");

    currentBg.style.transition =
      "transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)";
    currentBg.style.transformOrigin = "center center";
    currentBg.style.transform = "perspective(1000px) rotateY(90deg)";

    setTimeout(() => {
      callback();
      nextSlide.querySelector(".slide-background").style.transform =
        "perspective(1000px) rotateY(-90deg)";

      setTimeout(() => {
        nextSlide.querySelector(".slide-background").style.transition =
          "transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)";
        nextSlide.querySelector(".slide-background").style.transform =
          "perspective(1000px) rotateY(0deg)";
      }, 50);

      setTimeout(() => {
        currentBg.style.transform = "scale(1)";
        currentBg.style.transition = "";
      }, 800);
    }, 400);
  }

  tileTransition(currentSlide, nextSlide, callback) {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            grid-template-rows: repeat(5, 1fr);
            pointer-events: none;
            z-index: 3;
        `;

    // Create tiles
    for (let i = 0; i < 40; i++) {
      const tile = document.createElement("div");
      tile.style.cssText = `
                background: #000;
                transform: translateY(100%);
                opacity: 0;
            `;
      overlay.appendChild(tile);
    }

    currentSlide.appendChild(overlay);

    // Animate tiles in wave pattern
    const tiles = overlay.children;
    for (let i = 0; i < tiles.length; i++) {
      setTimeout(() => {
        tiles[i].style.transition =
          "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        tiles[i].style.transform = "translateY(0)";
        tiles[i].style.opacity = "1";
      }, i * 20);
    }

    setTimeout(() => {
      callback();

      // Animate tiles out
      for (let i = 0; i < tiles.length; i++) {
        setTimeout(() => {
          tiles[i].style.transform = "translateY(-100%)";
          tiles[i].style.opacity = "0";
        }, i * 15);
      }

      setTimeout(() => {
        overlay.remove();
      }, tiles.length * 15 + 500);
    }, tiles.length * 20 + 200);
  }

  restartTypingAnimation(slide) {
    const typingText = slide.querySelector(".typing-text");
    if (typingText) {
      const text = typingText.getAttribute("data-text");
      typingText.style.animation = "none";
      typingText.offsetHeight; // Trigger reflow
      typingText.style.animation = null;
    }
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }
}

// Initialize slider when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new HeroSlider();

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});

// Counter Animation for Impact Stats
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll(".stat-number");
    this.animated = false;
    this.init();
  }

  init() {
    // Intersection Observer for triggering animation when in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.animated) {
            this.animateCounters();
            this.animated = true;
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    const impactSection = document.querySelector(".impact-section");
    if (impactSection) {
      observer.observe(impactSection);
    }
  }

  animateCounters() {
    this.counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target"));
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60 FPS
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      updateCounter();
    });
  }
}

// Scroll to Top Button
class ScrollToTop {
  constructor() {
    this.btn = document.querySelector(".scroll-top-btn");
    if (!this.btn) return;

    this.init();
  }

  init() {
    // Show/hide button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 500) {
        this.btn.classList.add("visible");
      } else {
        this.btn.classList.remove("visible");
      }
    });

    // Scroll to top on click
    this.btn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new CounterAnimation();
  new ScrollToTop();
});
