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

  function setupNewsToggle() {
    var list = document.querySelector(".news-scrollbox");
    if (!list) return;
    if (!window.matchMedia("(max-width: 760px)").matches) return;

    var visibleCount = 7;
    var items = Array.prototype.slice.call(list.children).filter(function (child) {
      return child.tagName && child.tagName.toLowerCase() === "li";
    });
    if (items.length <= visibleCount) return;

    var button = document.createElement("button");
    button.type = "button";
    button.className = "news-toggle-button";

    function setExpanded(expanded) {
      items.forEach(function (item, index) {
        item.hidden = !expanded && index >= visibleCount;
      });
      list.classList.toggle("news-expanded", expanded);
      button.textContent = expanded ? "Show less news" : "More news";
      button.setAttribute("aria-expanded", expanded ? "true" : "false");
    }

    button.addEventListener("click", function () {
      var expanded = button.getAttribute("aria-expanded") === "true";
      setExpanded(!expanded);
    });

    setExpanded(false);
    list.insertAdjacentElement("afterend", button);
  }

  function init() {
    enhanceImages();
    protectExternalLinks();
    setupNewsToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
