/* =========================================================
   Personal CV Web Page - script.js
   Smooth scrolling for navigation links + footer year
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Smooth scrolling for in-page links ---------- */
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

  /* ---------- Accessible certificate modal ---------- */
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
        modalTitle.textContent = title;
        modalImage.alt = title + " — certificate";
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
