/*
 * Visitor-tracking preference shared by the main site and the blog.
 *
 * Open either site with ?visitor_tracking=off to stop map and analytics
 * tracking in that browser. Use ?visitor_tracking=on to reverse the choice.
 */
(function (window, document) {
  "use strict";

  var STORAGE_KEY = "ta.visitorTrackingOptOut";
  var COOKIE_NAME = "ta_visitor_tracking_opt_out";
  var QUERY_PARAMETER = "visitor_tracking";
  var ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

  function getStoredPreference() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch (error) {
      return false;
    }
  }

  function setStoredPreference(optedOut) {
    try {
      if (optedOut) window.localStorage.setItem(STORAGE_KEY, "1");
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Cookie storage below remains available when local storage is blocked.
    }
  }

  function sharedCookieDomain() {
    return /(^|\.)tajamulashraf\.com$/i.test(window.location.hostname || "")
      ? "; Domain=.tajamulashraf.com"
      : "";
  }

  function writeCookie(value, maxAge) {
    var cookie = COOKIE_NAME + "=" + encodeURIComponent(value) +
      "; Path=/; Max-Age=" + maxAge + "; SameSite=Lax" + sharedCookieDomain();
    if (window.location.protocol === "https:") cookie += "; Secure";
    document.cookie = cookie;
  }

  function getCookiePreference() {
    var prefix = COOKIE_NAME + "=";
    return document.cookie.split(";").some(function (item) {
      return item.trim() === prefix + "1";
    });
  }

  function isOptedOut() {
    return getStoredPreference() || getCookiePreference();
  }

  function setOptOut(optedOut) {
    optedOut = Boolean(optedOut);
    setStoredPreference(optedOut);
    writeCookie(optedOut ? "1" : "", optedOut ? ONE_YEAR_SECONDS : 0);
    window.TA_ANALYTICS_OPTOUT = optedOut;
    return optedOut;
  }

  function applyUrlPreference() {
    var choice;
    try {
      choice = new URLSearchParams(window.location.search).get(QUERY_PARAMETER);
    } catch (error) {
      return;
    }

    choice = String(choice || "").toLowerCase();
    if (choice !== "off" && choice !== "on") return;

    setOptOut(choice === "off");

    try {
      var url = new URL(window.location.href);
      url.searchParams.delete(QUERY_PARAMETER);
      window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
    } catch (error) {
      // The preference is still saved if the browser cannot rewrite the URL.
    }
  }

  applyUrlPreference();
  window.TA_TRACKING_PREFERENCES = {
    isOptedOut: isOptedOut,
    setOptOut: setOptOut
  };
  window.TA_ANALYTICS_OPTOUT = isOptedOut();
}(window, document));

