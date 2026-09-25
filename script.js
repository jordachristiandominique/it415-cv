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

  /* ---------- Current year in the footer ---------- */
  var year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
});
