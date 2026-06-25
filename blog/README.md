# Journey in Bytes Blog

A fast, elegant static blog with synced comments, visitor statistics, and an actual reader map.

## What changed

- The old fixed green sidebar is gone.
- The layout now uses a cleaner editorial top navigation, large calm hero, story-style text cards, and a dedicated live reader map.
- The visitor stats/map now live on the About page as a dedicated reader map card.
- The map is a real Leaflet/OpenStreetMap map with visitor dots.
- Stock-looking post thumbnails were replaced with local abstract SVG covers in `assets/images/covers/`.
- Newsletter/subscribe sections were removed.

## Add a new blog post

Copy one existing post object in `assets/data/posts.js`, change the title, slug, date, excerpt, tags, image, and Markdown. The home page, archive, latest post page, comment counts, and search update automatically.

Use one of the included cover images:

```text
assets/images/covers/cover-research.svg
assets/images/covers/cover-writing.svg
assets/images/covers/cover-stack.svg
assets/images/covers/cover-performance.svg
assets/images/covers/cover-framework.svg
assets/images/covers/cover-react.svg
assets/images/covers/cover-focus.svg
assets/images/covers/cover-jamstack.svg
```

## Make stats and map live

1. Create a free Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Paste your Project URL and public anon key into `assets/js/site-config.js`.
4. Upload the site again.

Without Supabase, the map can show a local preview dot for your own browser when the IP location lookup is available. With Supabase, every visitor creates an approximate city-level dot and the counts sync for everyone.

## Files you edit most

- `assets/data/posts.js` - all posts.
- `assets/js/site-config.js` - site name, email, Supabase keys, comments settings.
- `assets/images/covers/` - elegant SVG cover images.
- `assets/css/custom.css` - colors, spacing, layout.
