/* Render modular publication data into the original tab/table layout. */
(function () {
  "use strict";

  var state = {
    topic: "all"
  };

  function getData() {
    return window.PUBLICATIONS || { papers: [], topics: [] };
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }


  function topicSlug(topic) {
    return String(topic || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function isExternalUrl(url) {
    return /^https?:\/\//i.test(url || "");
  }

  function linkAttributes(url) {
    return isExternalUrl(url) ? ' target="_blank" rel="noopener noreferrer"' : "";
  }

  function anchor(label, url) {
    if (!url) return "";
    return '<a href="' + escapeHtml(url) + '"' + linkAttributes(url) + '>' + escapeHtml(label) + "</a>";
  }

  function formatAuthors(authors) {
    var rendered = (authors || []).map(function (author) {
      var cleanAuthor = escapeHtml(author);
      return cleanAuthor.indexOf("Tajamul Ashraf") !== -1 ? "<b>" + cleanAuthor + "</b>" : cleanAuthor;
    });

    if (rendered.length <= 1) return rendered.join("");
    if (rendered.length === 2) return rendered[0] + " and " + rendered[1];

    return rendered.slice(0, -1).join(", ") + ", and " + rendered[rendered.length - 1];
  }

  function primaryLink(paper) {
    var links = paper.links || [];
    var webpage = links.find(function (item) { return item.label === "webpage"; });
    var paperLink = links.find(function (item) { return item.label === "paper"; });

    return (webpage && webpage.url) || (paperLink && paperLink.url) || (links[0] && links[0].url) || "#";
  }

  function imageMimeType(value) {
    return /\.png$/i.test(value || "") ? "image/png" : "image/webp";
  }

  function publicationImagePaths(paper) {
    var fallback = String((paper && paper.image) || "").trim();
    var variants = paper && paper.imageVariants;

    if (variants) {
      return {
        fallback: fallback,
        src260: variants.src260 || fallback,
        src520: variants.src520 || fallback,
        src760: variants.src760 || fallback,
        type: variants.type || imageMimeType(variants.src260 || fallback)
      };
    }

    var base = fallback.replace(/\.(png|jpe?g)$/i, "");

    return {
      fallback: fallback,
      src260: base + "-fast-260.webp",
      src520: base + "-fast-520.webp",
      src760: base + "-fast-760.webp",
      type: "image/webp"
    };
  }

  function imageUrl(value) {
    return String(value || "").trim().replace(/ /g, "%20");
  }

  function publicationImageSrcset(imagePaths) {
    return [
      imagePaths.src260 ? escapeHtml(imageUrl(imagePaths.src260)) + " 260w" : "",
      imagePaths.src520 ? escapeHtml(imageUrl(imagePaths.src520)) + " 520w" : "",
      imagePaths.src760 ? escapeHtml(imageUrl(imagePaths.src760)) + " 760w" : ""
    ].filter(Boolean).join(", ");
  }

  function preloadRepresentativeImages() {
    var selectedPapers = (getData().papers || []).filter(function (paper) {
      return Boolean(paper.selected);
    }).slice(0, 4);

    selectedPapers.forEach(function (paper) {
      if (document.querySelector('link[data-publication-preload="' + paper.id + '"]')) return;

      var imagePaths = publicationImagePaths(paper);
      if (!imagePaths.src260) return;

      var link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.type = imagePaths.type;
      link.href = imageUrl(imagePaths.src260);
      link.setAttribute("imagesrcset", publicationImageSrcset(imagePaths));
      link.setAttribute("imagesizes", "260px");
      link.setAttribute("fetchpriority", "high");
      link.setAttribute("data-publication-preload", paper.id);
      document.head.appendChild(link);
    });
  }

  function renderPaperLinks(paper, abstractId) {
    var links = (paper.links || []).slice();
    var firstLink = links.find(function (item) { return item.label === "webpage"; }) || links[0];
    var pieces = [];

    if (firstLink) {
      pieces.push(anchor(firstLink.label, firstLink.url));
      links = links.filter(function (item) { return item !== firstLink; });
    }

    if (paper.abstract) {
      pieces.push('<a href="javascript:toggleblock(\'' + escapeHtml(abstractId) + '\')">abstract</a>');
    }

    links.forEach(function (item) {
      pieces.push(anchor(item.label, item.url));
    });

    return pieces.filter(Boolean).join(" | ");
  }

  function renderTopicChips(paper) {
    if (!Array.isArray(paper.topics) || paper.topics.length === 0) return "";

    return '<div class="paper-topic-chips" aria-label="Paper topics">' +
      paper.topics.map(function (topic) {
        var slug = topicSlug(topic);
        return '<span class="paper-topic-chip topic-' + escapeHtml(slug) + '">' + escapeHtml(topic) + "</span>";
      }).join("") +
      "</div>";
  }

  function renderPaperRow(paper, listName, index) {
    var abstractId = "abstract-" + paper.id;
    var url = primaryLink(paper);
    var imageAlt = paper.imageAlt || paper.title;
    var imagePaths = publicationImagePaths(paper);
    var imageSrcset = publicationImageSrcset(imagePaths);
    var imageSource = imageSrcset ? '<source type="' + escapeHtml(imagePaths.type) + '" srcset="' + imageSrcset + '" sizes="260px">' : "";
    var isRepresentativeImage = listName === "selected";
    var imageLoading = isRepresentativeImage ? "eager" : "lazy";
    var imageFetchPriority = isRepresentativeImage ? "high" : "low";
    var imageDecoding = isRepresentativeImage ? "sync" : "async";
    var note = paper.note ? '<br><span class="publication-note">' + escapeHtml(paper.note) + "</span>" : "";
    var abstractBlock = paper.abstract ?
      '<p align="justify"><i style="display: none;" id="' + escapeHtml(abstractId) + '">' + escapeHtml(paper.abstract) + "</i></p>" :
      "";

    return String.raw`
      <tr bgcolor="" class="publication-row" data-year="${escapeHtml(paper.year)}" data-topics="${escapeHtml((paper.topics || []).join("|"))}">
        <td width="34%" valign="middle" align="right" class="profile-image-container">
          <a href="${escapeHtml(url)}"${linkAttributes(url)}>
            <picture>
              ${imageSource}
              <img src="${escapeHtml(imageUrl(imagePaths.fallback))}" alt="${escapeHtml(imageAlt)}" class="profile-image publication-image" loading="${imageLoading}" decoding="${imageDecoding}" fetchpriority="${imageFetchPriority}" width="520" height="293"
              style="display:block; margin:auto; border-radius:15px; border:1px solid rgb(10, 158, 10); width:260px; max-width:85%; height:auto; aspect-ratio:16/9; object-fit:cover;">
            </picture>
          </a>
        </td>

        <td width="66%" valign="top" class="publication-text-cell">
          <p align="justify" style="margin-bottom: 0;">
            <a href="${escapeHtml(url)}" id="publication-link-${escapeHtml(paper.id)}"${linkAttributes(url)}>
              <b>${escapeHtml(paper.title)}</b>
            </a>
            <br>
            ${formatAuthors(paper.authors)}<br>
            <span class="publication-venue">${escapeHtml(paper.venue)}</span>${note}
          </p>

          <div class="paper" id="paper-${escapeHtml(paper.id)}">
            ${renderPaperLinks(paper, abstractId)}
            ${renderTopicChips(paper)}
            ${abstractBlock}
          </div>
        </td>
      </tr>
    `;
  }

  function renderYearRow(year) {
    return String.raw`
      <tr class="publication-year-row">
        <td colspan="2"><h5>${escapeHtml(year)}</h5></td>
      </tr>
    `;
  }

  function getPapersForList(listName) {
    var papers = (getData().papers || []).filter(function (paper) {
      return listName === "selected" ? Boolean(paper.selected) : true;
    });

    if (listName === "all" && state.topic !== "all") {
      papers = papers.filter(function (paper) {
        return (paper.topics || []).indexOf(state.topic) !== -1;
      });
    }

    return papers.slice().sort(function (a, b) {
      return b.year - a.year;
    });
  }

  function renderPublicationList(listName, targetId) {
    var target = document.getElementById(targetId);
    if (!target) return;

    var papers = getPapersForList(listName);

    if (papers.length === 0) {
      target.innerHTML = '<tr><td colspan="2" class="publication-empty">No publications match this topic.</td></tr>';
      return;
    }

    var lastYear = null;
    var html = [];

    papers.forEach(function (paper, index) {
      if (listName === "all" && paper.year !== lastYear) {
        html.push(renderYearRow(paper.year));
        lastYear = paper.year;
      }

      html.push(renderPaperRow(paper, listName, index));
    });

    target.innerHTML = html.join("\n");
  }

  function topicCounts() {
    var counts = {
      all: (getData().papers || []).length
    };

    (getData().papers || []).forEach(function (paper) {
      (paper.topics || []).forEach(function (topic) {
        counts[topic] = (counts[topic] || 0) + 1;
      });
    });

    return counts;
  }

  function ensureFilterContainer() {
    var allPane = document.getElementById("publication-all");
    if (!allPane) return null;

    var existing = document.getElementById("publication-filter-controls");
    var insertionPoint = allPane.querySelector(".pub-scrollbox") || allPane.querySelector("table");

    if (existing) {
      if (!allPane.contains(existing) && insertionPoint) {
        allPane.insertBefore(existing, insertionPoint);
      }
      return existing;
    }

    if (!insertionPoint) return null;

    var container = document.createElement("div");
    container.id = "publication-filter-controls";
    container.className = "publication-filter-controls";
    container.setAttribute("aria-label", "Filter all publications by topic");

    allPane.insertBefore(container, insertionPoint);
    return container;
  }

  function ensureSummaryContainer() {
    var allPane = document.getElementById("publication-all");
    if (!allPane) return null;

    var existing = document.getElementById("publication-filter-summary");
    var insertionPoint = allPane.querySelector(".pub-scrollbox") || allPane.querySelector("table");

    if (existing) {
      if (!allPane.contains(existing) && insertionPoint) {
        allPane.insertBefore(existing, insertionPoint);
      }
      return existing;
    }

    if (!insertionPoint) return null;

    var summary = document.createElement("div");
    summary.id = "publication-filter-summary";
    summary.className = "visually-hidden";
    summary.setAttribute("aria-live", "polite");

    allPane.insertBefore(summary, insertionPoint);
    return summary;
  }

  function renderTopicFilters() {
    var container = ensureFilterContainer();
    if (!container) return;

    var data = getData();
    var counts = topicCounts();
    var topics = ["all"].concat(data.topics || []);

    container.innerHTML = '<span class="publication-filter-label">Filter by topic:</span>' +
      topics.map(function (topic) {
        var isAll = topic === "all";
        var label = isAll ? "All" : topic;
        var count = isAll ? counts.all : counts[topic];

        if (!isAll && !count) return "";

        var activeClass = state.topic === topic ? " active" : "";
        var slugClass = isAll ? " topic-all" : " topic-" + topicSlug(topic);

        return '<button type="button" class="publication-topic-button' + slugClass + activeClass + '" data-topic="' + escapeHtml(topic) + '" aria-pressed="' + (state.topic === topic) + '">' +
          escapeHtml(label) + ' <span class="publication-topic-count">' + escapeHtml(count) + '</span></button>';
      }).join("");

    Array.prototype.forEach.call(container.querySelectorAll("button[data-topic]"), function (button) {
      button.addEventListener("click", function () {
        state.topic = button.getAttribute("data-topic") || "all";
        renderPublicationList("all", "publication-all-body");
        renderTopicFilters();
        renderSummary();
      });
    });
  }

  function renderSummary() {
    var summary = ensureSummaryContainer();
    if (!summary) return;

    summary.textContent = state.topic === "all" ?
      "Showing accepted publications." :
      "Showing publications tagged \u201c" + state.topic + "\u201d.";
  }

  function prioritizeVisiblePublicationImages() {
    var activePane = document.querySelector("#publications .tab-pane.active");
    if (!activePane) return;

    Array.prototype.slice.call(activePane.querySelectorAll("img.publication-image"), 0, 8).forEach(function (img) {
      img.loading = "eager";
      img.setAttribute("fetchpriority", "high");
    });
  }


  var allPublicationsRendered = false;

  function renderAllPublications() {
    if (allPublicationsRendered) return;
    renderPublicationList("all", "publication-all-body");
    renderTopicFilters();
    renderSummary();
    allPublicationsRendered = true;
  }

  function scheduleAllPublicationsRender() {
    if (allPublicationsRendered) return;
    if ("requestIdleCallback" in window) {
      requestIdleCallback(renderAllPublications, { timeout: 2500 });
    } else {
      window.setTimeout(renderAllPublications, 1200);
    }
  }

  function bindPublicationTabPerformance() {
    var publications = document.getElementById("publications");
    if (!publications) return;

    Array.prototype.forEach.call(publications.querySelectorAll(".tab-nav .button"), function (button) {
      button.addEventListener("click", function () {
        if (button.getAttribute("data-ref") === "#publication-all") {
          renderAllPublications();
        }
        window.setTimeout(prioritizeVisiblePublicationImages, 0);
      });
    });
  }

  function renderPublications() {
    preloadRepresentativeImages();
    renderPublicationList("selected", "publication-selected-body");
    renderTopicFilters();
    renderSummary();
    bindPublicationTabPerformance();
    prioritizeVisiblePublicationImages();
    scheduleAllPublicationsRender();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderPublications);
  } else {
    renderPublications();
  }

}());
