/* Apply the saved theme before the page paints; follow the OS until overridden. */
(function () {
  var root = document.documentElement;
  var systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  var savedTheme;
  try { savedTheme = window.localStorage.getItem("cv-theme"); } catch (error) { /* Storage may be blocked. */ }
  if (savedTheme !== "light" && savedTheme !== "dark") savedTheme = null;

  function applyTheme(theme) {
    root.dataset.theme = theme;
    var favicon = document.getElementById("theme-favicon");
    if (favicon) favicon.setAttribute("href", "images/cd-logo-" + theme + ".png");
    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      var dark = theme === "dark";
      toggle.setAttribute("aria-pressed", String(dark));
      toggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      toggle.title = dark ? "Switch to light mode" : "Switch to dark mode";
    }
  }

  applyTheme(savedTheme || (systemTheme.matches ? "dark" : "light"));
  systemTheme.addEventListener("change", function (event) {
    if (!savedTheme) applyTheme(event.matches ? "dark" : "light");
  });

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.getElementById("theme-toggle");
    if (!toggle) return;
    applyTheme(root.dataset.theme);
    toggle.hidden = false;
    toggle.addEventListener("click", function () {
      savedTheme = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(savedTheme);
      try { window.localStorage.setItem("cv-theme", savedTheme); } catch (error) { /* The toggle still works without storage. */ }
    });
  });
})();
