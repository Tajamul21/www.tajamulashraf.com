/*
 * Records visits to the main personal site in the same visitor-map dataset as
 * the blog. It intentionally has no UI dependencies, so it is safe to load on
 * the main homepage without loading the blog application.
 */
(function (window, document) {
  "use strict";

  var config = Object.assign({
    siteId: "journey-in-bytes",
    supabaseUrl: "",
    supabaseAnonKey: "",
    enableGeoLookup: true,
    geoApiUrl: "https://ipapi.co/json/"
  }, window.BLOG_CONFIG || {});

  function trackingIsOptedOut() {
    try {
      if (window.TA_TRACKING_PREFERENCES && typeof window.TA_TRACKING_PREFERENCES.isOptedOut === "function") {
        return window.TA_TRACKING_PREFERENCES.isOptedOut();
      }
    } catch (error) {}
    return Boolean(window.TA_ANALYTICS_OPTOUT);
  }

  function getVisitorId() {
    var key = "jb.visitorId." + config.siteId;
    var visitorId = null;
    try { visitorId = window.localStorage.getItem(key); } catch (error) {}
    if (!visitorId) {
      visitorId = window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : "visitor-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      try { window.localStorage.setItem(key, visitorId); } catch (error) {}
    }
    return visitorId;
  }

  function getClient() {
    if (!config.supabaseUrl || !config.supabaseAnonKey || !window.supabase ||
      typeof window.supabase.createClient !== "function") return null;
    try {
      return window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    } catch (error) {
      return null;
    }
  }

  async function lookupGeo() {
    if (!config.enableGeoLookup || !config.geoApiUrl) return {};
    var cacheKey = "jb.geo." + config.siteId;
    var cached = null;
    try { cached = JSON.parse(window.localStorage.getItem(cacheKey) || "null"); } catch (error) {}
    var oneDay = 24 * 60 * 60 * 1000;
    if (cached && cached.savedAt && Date.now() - cached.savedAt < oneDay) return cached.data || {};

    try {
      var response = await window.fetch(config.geoApiUrl, { cache: "no-store" });
      if (!response.ok) throw new Error("Geo API failed");
      var data = await response.json();
      var geo = {
        country: data.country_name || data.country || null,
        country_code: data.country_code || data.countryCode || null,
        city: data.city || null,
        latitude: Number(data.latitude || data.lat) || null,
        longitude: Number(data.longitude || data.lon) || null
      };
      try { window.localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data: geo })); } catch (error) {}
      return geo;
    } catch (error) {
      return {};
    }
  }

  async function trackMainHome() {
    // This guard must run before any browser ID, IP lookup, or visit write.
    if (trackingIsOptedOut()) return;

    var sessionKey = "jb.visitRecorded." + config.siteId + ".main-home";
    try {
      if (window.sessionStorage.getItem(sessionKey)) return;
      window.sessionStorage.setItem(sessionKey, "1");
    } catch (error) {}

    var client = getClient();
    if (!client) return;

    var visitorId = getVisitorId();
    var geo = await lookupGeo();
    try {
      var response = await client.rpc("record_blog_visit", {
        p_site_id: config.siteId,
        p_page_slug: "main-home",
        p_path: window.location.pathname + window.location.search,
        p_referrer: document.referrer ? document.referrer.slice(0, 500) : null,
        p_visitor_id: visitorId,
        p_country: geo.country || null,
        p_country_code: geo.country_code || null,
        p_city: geo.city || null,
        p_latitude: geo.latitude || null,
        p_longitude: geo.longitude || null
      });
      if (response && response.error) throw response.error;
    } catch (error) {
      console.warn("Could not save main-site visit", error);
    }
  }

  window.TajamulVisitorMapTracker = { trackMainHome: trackMainHome };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", trackMainHome);
  else trackMainHome();
}(window, document));
