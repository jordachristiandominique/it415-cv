/* =========================================================
   Personal CV Web Page - script.js
   Smooth scrolling for navigation links + footer year
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Smooth scrolling for in-page links ---------- */
  var motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  var prefersReducedMotion = motionPreference.matches;
  var header = document.querySelector(".site-header");
  var links = document.querySelectorAll('a[href^="#"]');

  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      event.preventDefault();

      // Offset by the sticky header height so headings are not hidden
      var offset = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: link.getAttribute("href") === "#top" ? 0 : top,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });

      // Keep the URL hash in sync without jumping
      history.pushState(null, "", link.getAttribute("href"));
    });
  });

  /* ---------- Highlight the navigation group currently being read ---------- */
  var navLinks = document.querySelectorAll(".nav-list a");
  var sections = document.querySelectorAll("main .cv-row[id]");
  var navigationFrame = 0;

  function updateNavigation() {
    navigationFrame = 0;
    var activeSection = "";
    var readingLine = (header ? header.offsetHeight : 0) + 120;
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= readingLine) {
        activeSection = section.id;
      }
    });
    // Skills, education, certifications and contact belong to the CV group.
    var activeHash = activeSection ? "#education" : "";
    if (activeSection === "about") activeHash = "#about";
    if (activeSection === "projects") activeHash = "#projects";
    navLinks.forEach(function (link) {
      if (link.getAttribute("href") === activeHash) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function scheduleNavigation() {
    if (!navigationFrame) navigationFrame = window.requestAnimationFrame(updateNavigation);
  }
  window.addEventListener("scroll", scheduleNavigation, { passive: true });
  window.addEventListener("resize", scheduleNavigation);
  window.addEventListener("load", scheduleNavigation);
  updateNavigation();

  /* ---------- Reveal each section once, leaving content visible by default ---------- */
  var revealObserver;
  var revealAnimations = [];
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        revealObserver.unobserve(entry.target);
        // Animate the content rather than the divider or the entire grid.
        entry.target.querySelectorAll(".cv-label, .cv-content").forEach(function (element) {
          if (typeof element.animate !== "function" || motionPreference.matches) return;
          revealAnimations.push(element.animate([
            { opacity: 0, transform: "translateY(12px)" },
            { opacity: 1, transform: "translateY(0)" }
          ], { duration: 400, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" }));
        });
      });
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
    sections.forEach(function (section) { revealObserver.observe(section); });
  }

  motionPreference.addEventListener("change", function (event) {
    prefersReducedMotion = event.matches;
    if (event.matches) {
      if (revealObserver) revealObserver.disconnect();
      revealAnimations.forEach(function (animation) { animation.cancel(); });
      revealAnimations = [];
    }
  });

  /* ---------- Shared accessible certificate and project image viewer ---------- */
  var modal = document.getElementById("certificate-modal");
  if (modal && typeof modal.showModal === "function") {
    var modalImage = document.getElementById("certificate-modal-image");
    var modalTitle = document.getElementById("certificate-modal-title");
    var modalError = document.getElementById("certificate-modal-error");
    var originalImage = document.getElementById("certificate-original");
    var closeButton = modal.querySelector(".certificate-modal-close");
    var closing = false;
    var opener;

    function closeCertificate() {
      if (!modal.open || closing) return;
      closing = true;
      modal.classList.remove("is-visible");
      window.setTimeout(function () {
        modal.close();
      }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220);
    }

    document.querySelectorAll(".credential-link").forEach(function (link) {
      link.addEventListener("click", function (event) {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (modal.open) return;
        opener = link;
        var title = link.closest(".entry").querySelector(".entry-title").textContent;
        var isProject = link.getAttribute("data-preview") === "project";
        modalTitle.textContent = isProject ? title + " - Coral analysis" : title;
        modalImage.alt = isProject
          ? "CoralSense analysis screenshot showing a coral reef image with purple coral annotations and numbered sampling points"
          : title + " - certificate";
        modalImage.hidden = false;
        modalError.hidden = true;
        originalImage.href = link.href;
        modalImage.src = link.href;
        document.documentElement.classList.add("certificate-open");
        modal.showModal();
        // Commit the initial state before starting the opening transition.
        modal.getBoundingClientRect();
        modal.classList.add("is-visible");
      });
    });

    modalImage.addEventListener("error", function () {
      modalImage.hidden = true;
      modalError.hidden = false;
    });
    closeButton.addEventListener("click", closeCertificate);
    modal.addEventListener("cancel", function (event) {
      event.preventDefault();
      closeCertificate();
    });
    // Require both press and release on the backdrop to avoid closing on a drag.
    var pressedBackdrop = false;
    function outsideModal(event) {
      var bounds = modal.getBoundingClientRect();
      return event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom;
    }
    modal.addEventListener("pointerdown", function (event) {
      pressedBackdrop = outsideModal(event);
    });
    modal.addEventListener("click", function (event) {
      if (pressedBackdrop && outsideModal(event)) closeCertificate();
      pressedBackdrop = false;
    });
    modal.addEventListener("close", function () {
      modal.classList.remove("is-visible");
      document.documentElement.classList.remove("certificate-open");
      closing = false;
      if (opener) opener.focus({ preventScroll: true });
    });
  }

  /* ---------- Current year in the footer ---------- */
  var year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
});
