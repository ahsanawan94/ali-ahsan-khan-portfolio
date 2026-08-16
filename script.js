(function () {
  "use strict";

  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  var THEME_KEY = "portfolio-theme";

  function getPreferredTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem(THEME_KEY);
    } catch (e) {}
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      themeToggle && themeToggle.setAttribute("aria-pressed", "true");
    } else {
      root.removeAttribute("data-theme");
      themeToggle && themeToggle.setAttribute("aria-pressed", "false");
    }
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var isDark = root.getAttribute("data-theme") === "dark";
      var next = isDark ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {}
    });
  }

  var navbar = document.getElementById("navbar");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  function updateNavOnScroll() {
    if (!navbar) return;
    navbar.classList.toggle("is-scrolled", window.scrollY > 8);

    var scrollPos = window.scrollY + 140;
    var currentId = sections[0] ? sections[0].id : null;
    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop) currentId = section.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + currentId);
    });
  }
  window.addEventListener("scroll", updateNavOnScroll, { passive: true });
  updateNavOnScroll();

  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobileMenu");
  var mobileBackdrop = document.getElementById("mobileBackdrop");

  function closeMobileMenu() {
    hamburger && hamburger.classList.remove("is-open");
    hamburger && hamburger.setAttribute("aria-expanded", "false");
    mobileMenu && mobileMenu.classList.remove("is-open");
    mobileBackdrop && mobileBackdrop.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  function openMobileMenu() {
    hamburger && hamburger.classList.add("is-open");
    hamburger && hamburger.setAttribute("aria-expanded", "true");
    mobileMenu && mobileMenu.classList.add("is-open");
    mobileBackdrop && mobileBackdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.contains("is-open");
      isOpen ? closeMobileMenu() : openMobileMenu();
    });
  }
  mobileBackdrop && mobileBackdrop.addEventListener("click", closeMobileMenu);
  document.querySelectorAll(".mobile-link, .mobile-menu__cta").forEach(function (el) {
    el.addEventListener("click", closeMobileMenu);
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMobileMenu();
  });

  var typedCodeEl = document.getElementById("typedCode");
  var typedCaret = document.getElementById("typedCaret");
  var codeLines = [
    "const developer = {",
    "  name: \"Ali Ahsan\",",
    "  role: \"Frontend Developer\",",
    "  stack: [\"HTML\", \"CSS\", \"JS\", \"React\"],",
    "  focus: \"clean, responsive UI\",",
    "  status: \"available for projects\"",
    "};"
  ];

  function typeHero() {
    if (!typedCodeEl) return;
    var lineIndex = 0;
    var charIndex = 0;
    typedCodeEl.textContent = "";

    function step() {
      if (lineIndex >= codeLines.length) {
        if (typedCaret) typedCaret.style.visibility = "visible";
        return;
      }
      var full = codeLines[lineIndex];
      if (charIndex === 0 && lineIndex > 0) typedCodeEl.appendChild(document.createTextNode("\n"));

      if (charIndex < full.length) {
        typedCodeEl.appendChild(document.createTextNode(full.charAt(charIndex)));
        charIndex++;
        setTimeout(step, 14 + Math.random() * 22);
      } else {
        lineIndex++;
        charIndex = 0;
        setTimeout(step, 90);
      }
    }
    step();
  }

  if (typedCodeEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setTimeout(typeHero, 400);
  } else if (typedCodeEl) {
    typedCodeEl.textContent = codeLines.join("\n");
  }

  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  var filterBtns = document.querySelectorAll(".filter-btn");
  var projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      var filter = btn.getAttribute("data-filter");
      projectCards.forEach(function (card) {
        var match = filter === "all" || card.getAttribute("data-category") === filter;
        card.classList.toggle("is-hidden", !match);
      });
    });
  });

  var modalBackdrop = document.getElementById("modalBackdrop");
  var modalClose = document.getElementById("modalClose");
  var modalTitle = document.getElementById("modalTitle");
  var modalProblem = document.getElementById("modalProblem");
  var modalSolution = document.getElementById("modalSolution");
  var modalFeatures = document.getElementById("modalFeatures");
  var modalChallenges = document.getElementById("modalChallenges");
  var modalDemo = document.getElementById("modalDemo");
  var modalCode = document.getElementById("modalCode");
  var lastFocusedEl = null;

  function openModal(card) {
    lastFocusedEl = document.activeElement;
    modalTitle.textContent = card.dataset.title || "Project";
    modalProblem.textContent = card.dataset.problem || "";
    modalSolution.textContent = card.dataset.solution || "";
    modalChallenges.textContent = card.dataset.challenges || "";
    modalFeatures.innerHTML = "";
    (card.dataset.features || "").split(",").forEach(function (f) {
      if (!f.trim()) return;
      var li = document.createElement("li");
      li.textContent = f.trim();
      modalFeatures.appendChild(li);
    });
    modalDemo.href = card.dataset.demo || "#";
    modalCode.href = card.dataset.code || "#";

    modalBackdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }

  function closeModal() {
    modalBackdrop.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  projectCards.forEach(function (card) {
    card.addEventListener("click", function () { openModal(card); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  modalClose && modalClose.addEventListener("click", closeModal);
  modalBackdrop && modalBackdrop.addEventListener("click", function (e) {
    if (e.target === modalBackdrop) closeModal();
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalBackdrop.classList.contains("is-open")) closeModal();
  });

  var form = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");

  function setError(fieldId, message) {
    var row = document.getElementById(fieldId).closest(".form-row");
    var errorEl = document.getElementById(fieldId + "Error");
    if (message) {
      row.classList.add("has-error");
      errorEl.textContent = message;
    } else {
      row.classList.remove("has-error");
      errorEl.textContent = "";
    }
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("name").value.trim();
      var email = document.getElementById("email").value.trim();
      var projectType = document.getElementById("projectType").value;
      var message = document.getElementById("message").value.trim();
      var valid = true;

      if (name.length < 2) { setError("name", "Please enter your full name."); valid = false; }
      else setError("name", "");

      if (!isValidEmail(email)) { setError("email", "Please enter a valid email address."); valid = false; }
      else setError("email", "");

      if (!projectType) { setError("projectType", "Please select a project type."); valid = false; }
      else setError("projectType", "");

      if (message.length < 20) { setError("message", "Message should be at least 20 characters."); valid = false; }
      else setError("message", "");

      if (!valid) return;

      if (form.action.indexOf("YOUR_FORMSPREE_ID") !== -1) {
        formNote.textContent = "Form endpoint isn't configured yet — replace YOUR_FORMSPREE_ID in index.html with your real Formspree form ID.";
        formNote.style.color = "#E5484D";
        return;
      }

      var submitBtn = form.querySelector(".form-submit");
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
      formNote.style.color = "";
      formNote.textContent = "Sending your message...";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            formNote.textContent = "Thanks, " + name.split(" ")[0] + " — your message has been sent. I'll get back to you soon.";
            formNote.style.color = "var(--accent)";
            form.reset();
          } else {
            return response.json().then(function (data) {
              throw new Error((data && data.errors && data.errors[0] && data.errors[0].message) || "Something went wrong.");
            });
          }
        })
        .catch(function () {
          formNote.textContent = "Something went wrong sending your message. Please email ahsannawan94@gmail.com directly.";
          formNote.style.color = "#E5484D";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Message";
        });
    });
  }

  var backToTop = document.getElementById("backToTop");
  backToTop && backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
