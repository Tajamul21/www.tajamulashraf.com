/* Small progressive enhancements for speed, accessibility, and GitHub Pages friendliness. */
(function () {
  "use strict";

  function enhanceImages() {
    var images = document.querySelectorAll("img");
    images.forEach(function (img) {
      if (!img.hasAttribute("loading")) {
        img.setAttribute("loading", "lazy");
      }
      if (!img.hasAttribute("decoding")) {
        img.setAttribute("decoding", "async");
      }
    });
  }

  function protectExternalLinks() {
    var links = document.querySelectorAll('a[target="_blank"]');
    links.forEach(function (link) {
      var rel = (link.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
      ["noopener", "noreferrer"].forEach(function (value) {
        if (rel.indexOf(value) === -1) {
          rel.push(value);
        }
      });
      link.setAttribute("rel", rel.join(" "));
    });
  }

  function init() {
    enhanceImages();
    protectExternalLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
