(function () {
  "use strict";

  var config = Object.assign({
    siteId: "journey-in-bytes",
    siteName: "Journey in Bytes",
    contactEmail: "tajamul.ashraf@ntu.edu.sg",
    supabaseUrl: "",
    supabaseAnonKey: "",
    enableGeoLookup: true,
    geoApiUrl: "https://ipapi.co/json/",
    analyticsDays: 365,
    commentStatus: "pending",
    maxCommentLength: 1600
  }, window.BLOG_CONFIG || {});

  var posts = Array.isArray(window.BLOG_POSTS) ? window.BLOG_POSTS.slice() : [];
  var supabaseClient = null;
  var mapInstance = null;
  var commentChannel = null;

  document.title = config.siteName;

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatNumber(value) {
    var number = Number(value || 0);
    return number.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }

  function formatDate(value) {
    if (!value) return "";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function relativeTime(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return "recently";
    var diff = Date.now() - date.getTime();
    var minute = 60 * 1000;
    var hour = 60 * minute;
    var day = 24 * hour;
    if (diff < minute) return "just now";
    if (diff < hour) return Math.floor(diff / minute) + " min ago";
    if (diff < day) return Math.floor(diff / hour) + " hr ago";
    if (diff < 30 * day) return Math.floor(diff / day) + " days ago";
    return formatDate(value);
  }

  function postUrl(slug) {
    return "blog-post.html?post=" + encodeURIComponent(slug || "");
  }

  function getCurrentSlug() {
    var params = new URLSearchParams(window.location.search);
    return params.get("post") || "";
  }

  function getLatestPost() {
    return posts[0] || null;
  }

  function getPostBySlug(slug) {
    if (!posts.length || !slug) return null;
    return posts.find(function (post) { return post.slug === slug; }) || null;
  }

  function storageGet(key, fallback) {
    try {
      var value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function storageSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Private browsing or storage limits should not break the site.
    }
  }

  function getVisitorId() {
    var key = "jb.visitorId." + config.siteId;
    var visitorId = null;
    try { visitorId = localStorage.getItem(key); } catch (error) {}
    if (!visitorId) {
      visitorId = window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : "visitor-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      try { localStorage.setItem(key, visitorId); } catch (error) {}
    }
    return visitorId;
  }

  function isSupabaseConfigured() {
    return Boolean(
      config.supabaseUrl &&
      config.supabaseAnonKey &&
      !/YOUR_|PASTE_|example/i.test(config.supabaseUrl + config.supabaseAnonKey) &&
      window.supabase &&
      typeof window.supabase.createClient === "function"
    );
  }

  function getSupabaseClient() {
    if (supabaseClient) return supabaseClient;
    if (!isSupabaseConfigured()) return null;
    try {
      supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
      return supabaseClient;
    } catch (error) {
      console.warn("Supabase could not be initialized", error);
      return null;
    }
  }

  function updateSyncStatus() {
    var connected = Boolean(getSupabaseClient());
    $all("[data-sync-status]").forEach(function (badge) {
      badge.className = "sync-status " + (connected ? "synced" : "local");
      badge.textContent = connected ? "Synced live" : "Local preview";
      badge.setAttribute("title", connected ? "Supabase is connected." : "Showing this browser first. Connect Supabase to sync every reader.");
    });
  }

  function setupContactLinks() {
    $all("[data-contact-link]").forEach(function (link) {
      var email = String(config.contactEmail || "tajamul.ashraf@ntu.edu.sg").replace(/\s+/g, "");
      link.setAttribute("href", "mailto:" + email);
    });
  }

  function tagMarkup(tags) {
    return (tags || []).map(function (tag) {
      return '<span class="badge badge-light">' + escapeHtml(tag) + '</span>';
    }).join("");
  }

  function postMetaMarkup(post) {
    return '' +
      '<div class="d-flex flex-wrap align-items-center mb-2" style="gap:.5rem">' +
        '<span class="badge badge-primary">' + escapeHtml(post.category || "Post") + '</span>' +
        '<span class="small-muted">' + formatDate(post.date) + '</span>' +
      '</div>';
  }

  function renderFeaturedPost() {
    var container = $("[data-featured-post]");
    if (!container) return;
    var post = posts[0];
    if (!post) {
      container.innerHTML = '<div class="featured-post-card p-4">No posts yet.</div>';
      return;
    }
    var image = post.thumb || post.image || "assets/images/covers/cover-research.svg";
    container.innerHTML = '' +
      '<article class="featured-post-card">' +
        '<a href="' + postUrl(post.slug) + '" aria-label="Read ' + escapeHtml(post.title) + '">' +
          '<img class="featured-post-image" src="' + escapeHtml(image) + '" alt="" loading="lazy" decoding="async">' +
        '</a>' +
        '<div class="featured-post-body">' +
          '<span class="eyebrow">Latest note</span>' +
          '<h3><a href="' + postUrl(post.slug) + '">' + escapeHtml(post.title) + '</a></h3>' +
          '<p>' + escapeHtml(post.excerpt || "") + '</p>' +
          '<div class="post-tags mb-3">' + tagMarkup(post.tags) + '</div>' +
          '<div class="meta mb-3"><span class="time">' + escapeHtml(post.readTime || "") + '</span><span class="comment"><a href="' + postUrl(post.slug) + '#comments"><span data-comment-count="' + escapeHtml(post.slug) + '">0</span> comments</a></span></div>' +
          '<a class="more-link" href="' + postUrl(post.slug) + '">Read latest &rarr;</a>' +
        '</div>' +
      '</article>';
  }

  function renderPostCard(post, layout) {
    var image = post.thumb || post.image || "assets/images/covers/cover-research.svg";
    var searchText = [
      post.title,
      post.category,
      post.excerpt,
      post.readTime,
      (post.tags || []).join(" ")
    ].join(" ").toLowerCase();
    var commonAttrs = ' data-post-search-text="' + escapeHtml(searchText) + '"';

    if (layout === "story") {
      return '' +
        '<article class="story-card post-card"' + commonAttrs + '>' +
          '<a class="story-media" href="' + postUrl(post.slug) + '" aria-label="Read ' + escapeHtml(post.title) + '">' +
            '<img src="' + escapeHtml(image) + '" alt="" loading="lazy" decoding="async">' +
          '</a>' +
          '<div class="story-body">' +
            postMetaMarkup(post) +
            '<h3><a href="' + postUrl(post.slug) + '">' + escapeHtml(post.title) + '</a></h3>' +
            '<p>' + escapeHtml(post.excerpt || "") + '</p>' +
            '<div class="post-tags mb-3">' + tagMarkup(post.tags) + '</div>' +
            '<div class="meta mb-3"><span class="time">' + escapeHtml(post.readTime || "") + '</span><span class="comment"><a href="' + postUrl(post.slug) + '#comments"><span data-comment-count="' + escapeHtml(post.slug) + '">0</span> comments</a></span></div>' +
            '<a class="more-link" href="' + postUrl(post.slug) + '">Read note &rarr;</a>' +
          '</div>' +
        '</article>';
    }

    if (layout === "timeline") {
      var date = new Date(post.date);
      var month = Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString(undefined, { month: "short" });
      var day = Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString(undefined, { day: "2-digit" });
      var year = Number.isNaN(date.getTime()) ? "" : date.getFullYear();
      return '' +
        '<article class="timeline-card post-card"' + commonAttrs + '>' +
        '<div class="timeline-date"><div><span>' + escapeHtml(day || "-") + '</span><small>' + escapeHtml(month + (year ? " " + year : "")) + '</small></div></div>' +
          '<a class="timeline-media" href="' + postUrl(post.slug) + '" aria-label="Read ' + escapeHtml(post.title) + '">' +
            '<img src="' + escapeHtml(image) + '" alt="" loading="lazy" decoding="async">' +
          '</a>' +
          '<div class="timeline-body">' +
            postMetaMarkup(post) +
            '<h3><a href="' + postUrl(post.slug) + '">' + escapeHtml(post.title) + '</a></h3>' +
            '<p>' + escapeHtml(post.excerpt || "") + '</p>' +
            '<div class="post-tags mb-3">' + tagMarkup(post.tags) + '</div>' +
            '<div class="meta mb-3"><span class="time">' + escapeHtml(post.readTime || "") + '</span><span class="comment"><a href="' + postUrl(post.slug) + '#comments"><span data-comment-count="' + escapeHtml(post.slug) + '">0</span> comments</a></span></div>' +
            '<a class="more-link" href="' + postUrl(post.slug) + '">Read more &rarr;</a>' +
          '</div>' +
        '</article>';
    }

    if (layout === "grid") {
      return '' +
        '<article class="post-card post-card-grid"' + commonAttrs + '>' +
          '<a class="post-card-image-link" href="' + postUrl(post.slug) + '" aria-label="Read ' + escapeHtml(post.title) + '">' +
            '<img class="post-card-image" src="' + escapeHtml(image) + '" alt="" loading="lazy" decoding="async">' +
          '</a>' +
          '<div class="post-card-content">' +
            postMetaMarkup(post) +
            '<h3 class="title mb-2"><a href="' + postUrl(post.slug) + '">' + escapeHtml(post.title) + '</a></h3>' +
            '<p class="intro mb-3">' + escapeHtml(post.excerpt || "") + '</p>' +
            '<div class="post-tags mb-3">' + tagMarkup(post.tags) + '</div>' +
            '<div class="meta mb-3"><span class="time">' + escapeHtml(post.readTime || "") + '</span><span class="comment"><a href="' + postUrl(post.slug) + '#comments"><span data-comment-count="' + escapeHtml(post.slug) + '">0</span> comments</a></span></div>' +
            '<a class="more-link" href="' + postUrl(post.slug) + '">Read more &rarr;</a>' +
          '</div>' +
        '</article>';
    }

    return '' +
      '<article class="timeline-card post-card"' + commonAttrs + '>' +
        '<div class="timeline-date"><div><span>•</span><small>' + escapeHtml(formatDate(post.date)) + '</small></div></div>' +
        '<a class="timeline-media" href="' + postUrl(post.slug) + '" aria-label="Read ' + escapeHtml(post.title) + '">' +
          '<img src="' + escapeHtml(image) + '" alt="" loading="lazy" decoding="async">' +
        '</a>' +
        '<div class="timeline-body">' +
          postMetaMarkup(post) +
          '<h3><a href="' + postUrl(post.slug) + '">' + escapeHtml(post.title) + '</a></h3>' +
          '<p>' + escapeHtml(post.excerpt || "") + '</p>' +
          '<a class="more-link" href="' + postUrl(post.slug) + '">Read more &rarr;</a>' +
        '</div>' +
      '</article>';
  }

  function renderPostLists() {
    $all("[data-post-list]").forEach(function (container) {
      var limit = Number(container.getAttribute("data-limit") || 0);
      var layout = container.getAttribute("data-layout") || "list";
      var subset = limit ? posts.slice(0, limit) : posts;
      container.classList.remove("post-grid", "story-grid", "timeline-list");
      if (layout === "grid") container.classList.add("post-grid");
      if (layout === "story") container.classList.add("story-grid");
      if (layout === "timeline") container.classList.add("timeline-list");
      container.innerHTML = subset.length
        ? subset.map(function (post) { return renderPostCard(post, layout); }).join("")
        : '<p class="text-muted">No posts yet.</p>';
    });
    setupPostSearch();
    loadCommentCounts();
  }

  function setupPostSearch() {
    var search = $("[data-post-search]");
    if (!search || search._jbBound) return;
    search._jbBound = true;
    search.addEventListener("input", function () {
      var query = search.value.trim().toLowerCase();
      var visibleCount = 0;
      $all("[data-post-list] .post-card").forEach(function (card) {
        var haystack = card.getAttribute("data-post-search-text") || "";
        var visible = !query || haystack.indexOf(query) !== -1;
        card.style.display = visible ? "" : "none";
        if (visible) visibleCount += 1;
      });
      var empty = $("[data-search-empty]");
      if (empty) empty.classList.toggle("d-none", visibleCount !== 0);
    });
  }

  async function loadCommentCounts() {
    if (!posts.length) return;
    var counts = {};
    var client = getSupabaseClient();
    if (client) {
      try {
        var response = await client.rpc("get_blog_comment_counts", { p_site_id: config.siteId });
        if (!response.error && Array.isArray(response.data)) {
          response.data.forEach(function (row) {
            counts[row.post_slug] = Number(row.approved_comments || 0);
          });
        }
      } catch (error) {
        console.warn("Could not load synced comment counts", error);
      }
    } else {
      posts.forEach(function (post) {
        counts[post.slug] = storageGet("jb.comments." + config.siteId + "." + post.slug, []).length;
      });
    }

    $all("[data-comment-count]").forEach(function (node) {
      var slug = node.getAttribute("data-comment-count");
      node.textContent = formatNumber(counts[slug] || 0);
    });
  }

  function renderArticle() {
    var article = $("[data-post-article]");
    if (!article) return;

    var requestedSlug = getCurrentSlug();
    var post = requestedSlug ? getPostBySlug(requestedSlug) : getLatestPost();
    var commentsSection = $("[data-comments-section]");
    if (!posts.length) {
      if (commentsSection) commentsSection.classList.add("d-none");
      article.innerHTML = '<div class="alert alert-warning">No blog posts were found. Add posts in <code>assets/data/posts.js</code>.</div>';
      return;
    }
    if (!post) {
      if (commentsSection) commentsSection.classList.add("d-none");
      document.title = config.siteName;
      article.innerHTML = '' +
        '<div class="alert alert-warning">' +
          '<strong>Post not found.</strong> The requested note is not available.' +
          '<div class="mt-3"><a class="btn btn-primary btn-sm" href="blog-list.html">Browse all posts</a></div>' +
        '</div>';
      trackVisit("post:not-found");
      return;
    }
    if (commentsSection) commentsSection.classList.remove("d-none");

    document.title = config.siteName;
    var description = $("meta[name='description']");
    if (description) description.setAttribute("content", post.excerpt || config.siteName);

    var currentIndex = posts.findIndex(function (item) { return item.slug === post.slug; });
    var previousPost = posts[currentIndex + 1];
    var nextPost = posts[currentIndex - 1];

    article.innerHTML = '' +
      '<header class="blog-post-header clean-post-header">' +
        postMetaMarkup(post) +
        '<h1 class="title mb-3">' + escapeHtml(post.title) + '</h1>' +
        '<p class="post-lede">' + escapeHtml(post.excerpt || "") + '</p>' +
        '<div class="meta mb-4"><span class="time">' + escapeHtml(post.readTime || "") + '</span><span class="comment"><a href="#comments"><span data-comment-count="' + escapeHtml(post.slug) + '">0</span> comments</a></span></div>' +
      '</header>' +
      '<div class="blog-post-body clean-post-body">' +
        (post.content || '<p>' + escapeHtml(post.excerpt || "") + '</p>') +
      '</div>' +
      '<nav class="blog-nav nav nav-justified my-5">' +
        (previousPost ? '<a class="nav-link-prev nav-item nav-link rounded-left" href="' + postUrl(previousPost.slug) + '">Previous<i class="arrow-prev fas fa-long-arrow-alt-left"></i></a>' : '<a class="nav-link-prev nav-item nav-link rounded-left disabled" href="blog-list.html">All posts</a>') +
        (nextPost ? '<a class="nav-link-next nav-item nav-link rounded-right" href="' + postUrl(nextPost.slug) + '">Next<i class="arrow-next fas fa-long-arrow-alt-right"></i></a>' : '<a class="nav-link-next nav-item nav-link rounded-right" href="blog-list.html">All posts<i class="arrow-next fas fa-long-arrow-alt-right"></i></a>') +
      '</nav>';

    loadCommentCounts();
    initializeCodeHighlighting();
    initializeComments(post.slug);
    trackVisit("post:" + post.slug);
  }

  function initializeCodeHighlighting() {
    if (!window.hljs) return;
    $all("pre code").forEach(function (block) {
      try {
        if (window.hljs.highlightElement) window.hljs.highlightElement(block);
        else if (window.hljs.highlightBlock) window.hljs.highlightBlock(block);
      } catch (error) {}
    });
  }

  async function lookupGeo() {
    if (!config.enableGeoLookup || !config.geoApiUrl) return {};
    var cacheKey = "jb.geo." + config.siteId;
    var cached = storageGet(cacheKey, null);
    var oneDay = 24 * 60 * 60 * 1000;
    if (cached && cached.savedAt && Date.now() - cached.savedAt < oneDay) return cached.data || {};

    try {
      var response = await fetch(config.geoApiUrl, { cache: "no-store" });
      if (!response.ok) throw new Error("Geo API failed");
      var data = await response.json();
      var normalized = {
        country: data.country_name || data.country || null,
        country_code: data.country_code || data.countryCode || null,
        city: data.city || null,
        latitude: Number(data.latitude || data.lat) || null,
        longitude: Number(data.longitude || data.lon) || null
      };
      storageSet(cacheKey, { savedAt: Date.now(), data: normalized });
      return normalized;
    } catch (error) {
      console.warn("Visitor location lookup failed", error);
      return {};
    }
  }

  async function trackVisit(pageSlug) {
    pageSlug = pageSlug || document.body.getAttribute("data-page") || "home";
    var sessionKey = "jb.visitRecorded." + config.siteId + "." + pageSlug;
    try {
      if (sessionStorage.getItem(sessionKey)) return;
      sessionStorage.setItem(sessionKey, "1");
    } catch (error) {}

    var visitorId = getVisitorId();
    var client = getSupabaseClient();
    var geo = await lookupGeo();

    if (!client) {
      var local = storageGet("jb.localStats." + config.siteId, { total_views: 0, recent_views_24h: 0, pages: {}, visits: [], visitors: [], locations: [] });
      var now = Date.now();
      local.visits = (local.visits || []).filter(function (timestamp) { return now - timestamp < 24 * 60 * 60 * 1000; });
      local.visits.push(now);
      local.total_views = (local.total_views || 0) + 1;
      local.recent_views_24h = local.visits.length;
      local.pages = local.pages || {};
      local.pages[pageSlug] = (local.pages[pageSlug] || 0) + 1;
      local.visitors = Array.isArray(local.visitors) ? local.visitors : [];
      if (local.visitors.indexOf(visitorId) === -1) local.visitors.push(visitorId);
      rememberLocalLocation(local, geo);
      storageSet("jb.localStats." + config.siteId, local);
      renderAnalytics();
      return;
    }

    try {
      var response = await client.rpc("record_blog_visit", {
        p_site_id: config.siteId,
        p_page_slug: pageSlug,
        p_path: window.location.pathname + window.location.search,
        p_referrer: document.referrer ? document.referrer.slice(0, 500) : null,
        p_visitor_id: visitorId,
        p_country: geo.country || null,
        p_country_code: geo.country_code || null,
        p_city: geo.city || null,
        p_latitude: geo.latitude || null,
        p_longitude: geo.longitude || null
      });
      if (response.error) throw response.error;
    } catch (error) {
      console.warn("Could not save visit", error);
    }
    renderAnalytics();
  }

  async function renderAnalytics() {
    if (!$('[data-analytics-dashboard]')) return;

    var summary = { total_views: 0, unique_visitors: 0, countries: 0, recent_views_24h: 0 };
    var locations = [];
    var client = getSupabaseClient();

    if (client) {
      try {
        var summaryResponse = await client.rpc("get_blog_visit_summary", { p_site_id: config.siteId });
        if (!summaryResponse.error && summaryResponse.data && summaryResponse.data[0]) {
          summary = summaryResponse.data[0];
        }
        var locationResponse = await client.rpc("get_blog_visit_locations", {
          p_site_id: config.siteId,
          p_days: Number(config.analyticsDays || 365)
        });
        if (!locationResponse.error && Array.isArray(locationResponse.data)) {
          locations = locationResponse.data;
        }
      } catch (error) {
        console.warn("Could not load visit analytics", error);
      }
    } else {
      var local = storageGet("jb.localStats." + config.siteId, { total_views: 0, recent_views_24h: 0, visits: [], visitors: [], locations: [] });
      var now = Date.now();
      local.visits = (local.visits || []).filter(function (timestamp) { return now - timestamp < 24 * 60 * 60 * 1000; });
      local.recent_views_24h = local.visits.length || local.recent_views_24h || 0;
      local.visitors = Array.isArray(local.visitors) ? local.visitors : [];
      local.locations = Array.isArray(local.locations) ? local.locations : [];
      storageSet("jb.localStats." + config.siteId, local);
      var countryCodes = {};
      local.locations.forEach(function (location) {
        if (location.country_code) countryCodes[location.country_code] = true;
      });
      locations = local.locations;
      summary = {
        total_views: local.total_views || 0,
        unique_visitors: local.visitors.length || (local.total_views ? 1 : 0),
        countries: Object.keys(countryCodes).length,
        recent_views_24h: local.recent_views_24h || 0
      };
    }

    setTextAll("[data-stat='total_views']", formatNumber(summary.total_views));
    setTextAll("[data-stat='unique_visitors']", formatNumber(summary.unique_visitors));
    setTextAll("[data-stat='countries']", formatNumber(summary.countries));
    setTextAll("[data-stat='recent_views_24h']", formatNumber(summary.recent_views_24h));
    renderMap(locations, Boolean(client));
  }

  function setTextAll(selector, value) {
    $all(selector).forEach(function (node) {
      node.textContent = value;
    });
  }

  function normalizeLocalLocation(geo) {
    geo = geo || {};
    var lat = Number(geo.latitude);
    var lng = Number(geo.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    var label = [geo.city, geo.country].filter(Boolean).join(", ") || geo.country || "Current reader";
    return {
      key: [geo.city || "", geo.country_code || geo.country || "", lat.toFixed(2), lng.toFixed(2)].join("|"),
      label: label,
      country: geo.country || null,
      country_code: geo.country_code || null,
      latitude: lat,
      longitude: lng,
      views: 1,
      last_seen: new Date().toISOString()
    };
  }

  function rememberLocalLocation(local, geo) {
    var record = normalizeLocalLocation(geo);
    if (!record) return;
    local.locations = Array.isArray(local.locations) ? local.locations : [];
    var existing = local.locations.find(function (item) { return item.key === record.key; });
    if (existing) {
      existing.views = Number(existing.views || 0) + 1;
      existing.last_seen = record.last_seen;
    } else {
      local.locations.push(record);
    }
    local.locations.sort(function (a, b) { return Number(b.views || 0) - Number(a.views || 0); });
    local.locations = local.locations.slice(0, 100);
  }

  function mapTileUrl() {
    return config.mapTileUrl || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  }

  function mapTileAttribution() {
    return config.mapTileAttribution || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  }

  function ensureVisitorMap(mapNode, compact) {
    if (!window.L) return null;
    if (mapInstance && mapInstance._container !== mapNode) {
      try { mapInstance.remove(); } catch (error) {}
      mapInstance = null;
    }
    if (!mapInstance) {
      mapNode.innerHTML = "";
      var center = Array.isArray(config.mapDefaultCenter) ? config.mapDefaultCenter : [20, 0];
      var zoom = Number(config.mapDefaultZoom || (compact ? 1 : 2));
      mapInstance = window.L.map(mapNode, {
        scrollWheelZoom: false,
        zoomControl: !compact,
        attributionControl: true
      }).setView(center, zoom);
      window.L.tileLayer(mapTileUrl(), {
        attribution: mapTileAttribution(),
        maxZoom: 18,
        subdomains: "abc"
      }).addTo(mapInstance);
    }
    return mapInstance;
  }

  function setMapNotice(mapNode, message) {
    $all(".map-overlay", mapNode).forEach(function (node) { node.remove(); });
    if (!message) return;
    var notice = document.createElement("div");
    notice.className = "map-overlay";
    notice.textContent = message;
    mapNode.appendChild(notice);
  }

  function renderMap(locations, connected) {
    var mapNode = $("[data-visitor-map]");
    if (!mapNode) return;
    var compact = mapNode.classList.contains("analytics-map-compact") || mapNode.classList.contains("sidebar-map");
    locations = Array.isArray(locations) ? locations : [];
    var validLocations = locations.filter(function (location) {
      var lat = Number(location.latitude);
      var lng = Number(location.longitude);
      return Number.isFinite(lat) && Number.isFinite(lng);
    });

    if (!window.L) {
      mapNode.innerHTML = '<div class="map-empty-state">Map library could not load. Check your internet connection.</div>';
      return;
    }

    var map = ensureVisitorMap(mapNode, compact);
    if (!map) return;
    mapNode.classList.toggle("has-reader-points", validLocations.length > 0);

    if (map._jbLayer) {
      map.removeLayer(map._jbLayer);
    }

    var group = window.L.layerGroup().addTo(map);
    var bounds = [];
    validLocations.forEach(function (location) {
      var lat = Number(location.latitude);
      var lng = Number(location.longitude);
      var label = location.label || location.country || "Reader location";
      var views = Math.max(1, Number(location.views || 1));
      var radius = Math.min(6, 3 + Math.log(views + 1) * 0.9);
      var marker = window.L.circleMarker([lat, lng], {
        radius: radius,
        color: "#203f35",
        weight: 1,
        fillColor: connected ? "#bb7355" : "#d9ab48",
        fillOpacity: 0.82
      }).bindPopup(
        '<strong>' + escapeHtml(label) + '</strong><br>' + formatNumber(views) + ' visit' + (views === 1 ? '' : 's') + (connected ? '' : '<br><small>Local preview only</small>')
      );
      marker.addTo(group);
      bounds.push([lat, lng]);
    });

    map._jbLayer = group;
    if (bounds.length > 1) map.fitBounds(bounds, { padding: compact ? [12, 12] : [36, 36], maxZoom: 7 });
    else if (bounds.length === 1) map.setView(bounds[0], compact ? 4 : 5);
    else map.setView(Array.isArray(config.mapDefaultCenter) ? config.mapDefaultCenter : [20, 0], Number(config.mapDefaultZoom || 2));

    var message = "";
    if (!validLocations.length) {
      message = connected
        ? (mapNode.getAttribute("data-map-waiting") || "Waiting for the first reader location.")
        : (mapNode.getAttribute("data-map-empty") || "Looking up your coarse location. Connect Supabase to sync every reader.");
    } else if (!connected) {
      message = "Local preview: this dot is saved only in this browser. Add Supabase keys to show dots from every visitor.";
    }
    setMapNotice(mapNode, message);
    setTimeout(function () {
      try { map.invalidateSize(); } catch (error) {}
    }, 250);
  }

  function initializeComments(slug) {
    var section = $("[data-comments-section]");
    if (!section || !slug) return;
    section.setAttribute("data-post-slug", slug);

    var maxNode = section.querySelector("[data-max-comment-length]");
    if (maxNode) maxNode.textContent = String(config.maxCommentLength || 1600);

    var anonymousToggle = section.querySelector("[name='anonymous']");
    var nameInput = section.querySelector("[name='display_name']");
    if (anonymousToggle && nameInput && !anonymousToggle._jbBound) {
      anonymousToggle._jbBound = true;
      anonymousToggle.addEventListener("change", function () {
        nameInput.disabled = anonymousToggle.checked;
        nameInput.placeholder = anonymousToggle.checked ? "Posting as Anonymous" : "Your name (optional)";
      });
    }

    var commentInput = section.querySelector("[name='comment_text']");
    if (commentInput) commentInput.setAttribute("maxlength", String(config.maxCommentLength || 1600));

    var form = section.querySelector("[data-comment-form]");
    if (form && !form._jbBound) {
      form._jbBound = true;
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        submitComment(form, section.getAttribute("data-post-slug"));
      });
    }

    loadComments(slug);
    watchComments(slug);
  }

  async function loadComments(slug) {
    var list = $("[data-comment-list]");
    if (!list) return;
    list.innerHTML = '<div class="text-muted">Loading comments...</div>';
    var comments = [];
    var client = getSupabaseClient();

    if (client) {
      try {
        var response = await client
          .from("blog_comments")
          .select("id, display_name, comment_text, website, is_anonymous, created_at")
          .eq("site_id", config.siteId)
          .eq("post_slug", slug)
          .eq("status", "approved")
          .order("created_at", { ascending: false });
        if (!response.error && Array.isArray(response.data)) comments = response.data;
      } catch (error) {
        console.warn("Could not load synced comments", error);
      }
    } else {
      comments = storageGet("jb.comments." + config.siteId + "." + slug, []);
      comments.sort(function (a, b) { return new Date(b.created_at) - new Date(a.created_at); });
    }

    renderComments(comments);
    loadCommentCounts();
  }

  function renderComments(comments) {
    var list = $("[data-comment-list]");
    var empty = $("[data-comments-empty]");
    if (!list) return;
    if (!comments.length) {
      list.innerHTML = "";
      if (empty) empty.classList.remove("d-none");
      return;
    }

    if (empty) empty.classList.add("d-none");
    list.innerHTML = comments.map(function (comment) {
      var name = comment.is_anonymous ? "Anonymous" : (comment.display_name || "Anonymous");
      var safeWebsite = normalizeUrl(comment.website);
      var author = safeWebsite
        ? '<a href="' + escapeHtml(safeWebsite) + '" target="_blank" rel="nofollow noopener">' + escapeHtml(name) + '</a>'
        : escapeHtml(name);
      return '' +
        '<article class="comment-card">' +
          '<div class="comment-meta"><span class="comment-author">' + author + '</span><span class="comment-date">' + relativeTime(comment.created_at) + '</span></div>' +
          '<p class="comment-body">' + escapeHtml(comment.comment_text || "") + '</p>' +
        '</article>';
    }).join("");
  }

  function normalizeUrl(url) {
    if (!url) return null;
    try {
      var parsed = new URL(url, window.location.origin);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
      return parsed.href;
    } catch (error) {
      return null;
    }
  }

  async function submitComment(form, slug) {
    var honeypot = form.querySelector("[name='website_url']");
    if (honeypot && honeypot.value) return;

    var commentInput = form.querySelector("[name='comment_text']");
    var nameInput = form.querySelector("[name='display_name']");
    var websiteInput = form.querySelector("[name='website']");
    var anonymousInput = form.querySelector("[name='anonymous']");

    var commentText = (commentInput && commentInput.value || "").trim();
    var isAnonymous = Boolean(anonymousInput && anonymousInput.checked);
    var displayName = isAnonymous ? "Anonymous" : ((nameInput && nameInput.value || "").trim() || "Anonymous");
    var website = normalizeUrl((websiteInput && websiteInput.value || "").trim());

    if (!commentText || commentText.length < 2) {
      showCommentMessage("Please write a comment before posting.", "warning");
      return;
    }
    if (commentText.length > Number(config.maxCommentLength || 1600)) {
      showCommentMessage("Your comment is too long. Please shorten it.", "warning");
      return;
    }

    var payload = {
      site_id: config.siteId,
      post_slug: slug,
      display_name: displayName.slice(0, 80),
      comment_text: commentText,
      website: website,
      is_anonymous: isAnonymous,
      status: config.commentStatus === "pending" ? "pending" : "approved"
    };

    var client = getSupabaseClient();
    if (client) {
      try {
        var response;
        if (payload.status === "pending") {
          response = await client.from("blog_comments").insert(payload);
        } else {
          response = await client.from("blog_comments").insert(payload).select("id, display_name, comment_text, website, is_anonymous, created_at, status").single();
        }
        if (response.error) throw response.error;
        form.reset();
        if (anonymousInput && nameInput) nameInput.disabled = false;
        if (payload.status === "pending") {
          showCommentMessage("Comment received. It will appear after approval.", "success");
        } else {
          showCommentMessage("Comment posted. Thank you!", "success");
          loadComments(slug);
        }
      } catch (error) {
        console.warn("Could not save synced comment", error);
        showCommentMessage("Comment could not be posted. Check your Supabase setup.", "danger");
      }
    } else {
      var key = "jb.comments." + config.siteId + "." + slug;
      var comments = storageGet(key, []);
      comments.push(Object.assign({}, payload, {
        id: "local-" + Date.now(),
        created_at: new Date().toISOString(),
        status: "approved"
      }));
      storageSet(key, comments);
      form.reset();
      if (anonymousInput && nameInput) nameInput.disabled = false;
      showCommentMessage("Comment saved in local demo mode. Connect Supabase to sync it for everyone.", "success");
      loadComments(slug);
    }
  }

  function showCommentMessage(text, type) {
    var message = $("[data-comment-message]");
    if (!message) return;
    message.className = "alert alert-" + (type || "info");
    message.textContent = text;
    message.classList.remove("d-none");
  }

  function watchComments(slug) {
    var client = getSupabaseClient();
    if (!client || typeof client.channel !== "function") return;
    if (commentChannel) {
      try { client.removeChannel(commentChannel); } catch (error) {}
    }
    try {
      commentChannel = client
        .channel("blog-comments-" + config.siteId + "-" + slug)
        .on("postgres_changes", {
          event: "INSERT",
          schema: "public",
          table: "blog_comments",
          filter: "post_slug=eq." + slug
        }, function () {
          loadComments(slug);
        })
        .subscribe();
    } catch (error) {
      console.warn("Realtime comments are not available", error);
    }
  }

  function setupMobileNav() {
    var toggle = $("[data-nav-toggle]");
    var menu = $("[data-nav-menu]");
    if (!toggle || !menu || toggle._jbBound) return;
    toggle._jbBound = true;
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      refreshMapSize();
    });
    $all("a", menu).forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function markActiveNav() {
    var page = document.body.getAttribute("data-page") || "home";
    $all("[data-nav]").forEach(function (item) {
      item.classList.toggle("active", item.getAttribute("data-nav") === page);
    });
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") return;
    navigator.serviceWorker.register("sw.js?v=13").catch(function () {
      // A failed service worker should never block the blog.
    });
  }

  function refreshMapSize() {
    if (mapInstance && typeof mapInstance.invalidateSize === "function") {
      setTimeout(function () { mapInstance.invalidateSize(); }, 250);
    }
  }

  function setupResponsiveMap() {
    var toggler = $(".navbar-toggler");
    var navigation = $("#navigation");
    if (toggler) toggler.addEventListener("click", refreshMapSize);
    if (navigation) navigation.addEventListener("shown.bs.collapse", refreshMapSize);
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupMobileNav();
    markActiveNav();
    updateSyncStatus();
    setupContactLinks();
    renderFeaturedPost();
    renderPostLists();
    renderArticle();
    if (!$('[data-post-article]')) trackVisit(document.body.getAttribute("data-page") || "home");
    renderAnalytics();
    setupResponsiveMap();
    registerServiceWorker();
  });
})();
