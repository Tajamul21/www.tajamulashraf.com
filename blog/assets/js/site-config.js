/*
  Site configuration.

  To turn on synced visitor counts, the location map, and public no-login
  comments, create a free Supabase project, run supabase/schema.sql, then paste
  your Project URL and public anon key below.

  The anon key is safe to expose when Row Level Security is enabled, but never
  paste a Supabase service-role key into this file.
*/
window.BLOG_CONFIG = {
  siteId: "journey-in-bytes",
  siteName: "Journey in Bytes",
  authorName: "Tajamul",
  contactEmail: "tajamul.ashraf@ntu.edu.sg",

  // Supabase project settings. Leave blank for local-only demo mode.
  supabaseUrl: "https://qdrzzsxqawnglqppczzv.supabase.co",
  supabaseAnonKey: "sb_publishable_da4Ebch5g4bdbZWGhk2FDw_of7cbyXY",

  // Visitor map and analytics settings.
  enableGeoLookup: true,
  geoApiUrl: "https://ipapi.co/json/",
  analyticsDays: 365,
  mapTileUrl: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  mapTileAttribution: "&copy; OpenStreetMap contributors &copy; CARTO",
  mapDefaultCenter: [20, 0],
  mapDefaultZoom: 2,

  // Comments are no-login. Use "approved" for instant posting or "pending"
  // if you want to approve comments in Supabase before they show on the site.
  commentStatus: "pending",
  maxCommentLength: 1600,
  showSetupHints: true
};
