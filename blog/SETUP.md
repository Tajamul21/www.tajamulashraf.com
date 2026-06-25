# Journey in Bytes setup guide

This version is still a fast static blog, but the dynamic parts can sync through free hosted services.

## What was added

- New editorial layout with clean top navigation and a dedicated About-page reader map card.
- Automatic post rendering from `assets/data/posts.js`.
- Markdown-friendly post writing.
- A direct `assets/data/posts.js` editing workflow for adding new posts.
- Synced no-login comments with optional anonymous posting.
- Visitor count, unique reader count, 24-hour visits, country count, and an actual Leaflet/OpenStreetMap visitor map with dots.
- Local demo mode when Supabase is not connected.
- Searchable post archive.
- Service worker caching for faster repeat visits.
- Cleaner production pages with the old demo style switcher removed.

## Run locally

Use a local server so JavaScript, service worker checks, and assets behave like a real website:

```bash
cd blog
python3 -m http.server 8080
```

Open `http://localhost:8080` in your browser.

## Update your contact email

Change the contact button in:

```text
assets/js/site-config.js
```

```js
contactEmail: "your-email@example.com"
```

## Add or edit posts

Copy an existing post object and paste it into the `posts` array in:

```text
assets/data/posts.js
```

You can also edit `assets/data/posts.js` directly. Each post needs a unique `slug`. The home page, archive page, post page, comment counts, and previous/next links update automatically.

A new post can use simple Markdown:

```js
{
  "slug": "my-new-post",
  "title": "My New Post",
  "date": "2026-04-01",
  "readTime": "4 min read",
  "category": "Notes",
  "image": "assets/images/covers/cover-research.svg",
  "thumb": "assets/images/covers/cover-research.svg",
  "excerpt": "One short sentence that explains the post.",
  "tags": ["Research", "Notes"],
  "markdown": `
Write your post here.

## Heading

- Bullet point
- Another point
  `
},
```

## Enable synced comments, visitor count, and visitor map

1. Create a Supabase project.
2. Open Supabase SQL Editor.
3. Paste and run the full SQL from:

```text
supabase/schema.sql
```

4. In Supabase, copy your Project URL and public anon key.
5. Paste them into:

```text
assets/js/site-config.js
```

```js
window.BLOG_CONFIG = {
  supabaseUrl: "https://YOUR-PROJECT.supabase.co",
  supabaseAnonKey: "YOUR-PUBLIC-ANON-KEY"
};
```

Keep the service-role key private. Never put it in frontend code.

## Comment settings

Comments do not require login. The visitor can enter a name, leave the name blank, or tick `Post as Anonymous`.

In `assets/js/site-config.js`:

```js
commentStatus: "approved"
```

Use `approved` for instant comments or `pending` if you want comments to wait for approval inside Supabase.

## Visitor map settings

The site uses `https://ipapi.co/json/` for coarse city/country geolocation and Leaflet/OpenStreetMap for the map. It stores:

- random visitor ID
- page slug
- city
- country
- latitude/longitude
- timestamp

It does not store IP addresses.

Disable geolocation in `assets/js/site-config.js`:

```js
enableGeoLookup: false
```

## Deploy

Good free/static hosting options:

- Netlify
- Cloudflare Pages
- GitHub Pages

Upload the contents of this `blog` folder as the site root.

## Files changed or added

```text
index.html
blog-list.html
blog-post.html
about.html
assets/css/custom.css
assets/data/posts.js
assets/js/site-config.js
assets/js/site.js
supabase/schema.sql
sw.js
netlify.toml
```


## Layout and cover images

The post cards now use clean local abstract SVG covers instead of the stock thumbnails. You can pick any cover from:

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

The visitor map is on the About page. In local map mode it shows a preview dot saved only in your browser. After Supabase is connected, it shows approximate city-level dots from all visitors.
