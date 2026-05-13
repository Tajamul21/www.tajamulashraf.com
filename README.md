# Tajamul Ashraf Website

This version keeps the original homepage template while making the publication section modular, responsive, and easy to maintain for GitHub Pages.

## GitHub Pages

Upload the files in this folder to the repository root. The `.nojekyll` file is included so GitHub Pages serves static assets directly.

## Add a publication

Edit:

```text
assets/JS/publications-data.js
```

Append one object inside the `papers` array and update:

- `id`
- `selected` - set to `true` if it should appear in the Representative tab
- `year`
- `title`
- `authors`
- `venue`
- `image`
- `links`
- `topics`
- `abstract`

Example:

```js
{
  id: "new-paper-id",
  selected: true,
  year: 2026,
  title: "Paper Title",
  authors: ["Tajamul Ashraf", "Coauthor Name"],
  venue: "Conference 2026",
  image: "assets/Profile Picture/papers/example.webp",
  imageAlt: "Short image description",
  links: [
    { label: "paper", url: "https://example.com/paper" },
    { label: "code", url: "https://github.com/example/repo" }
  ],
  topics: ["Computer Vision", "Medical AI"],
  abstract: "One concise paragraph about the paper."
}
```

## Publication filters

Topic buttons are generated automatically from `assets/JS/publications-data.js`. To add a new topic, add the topic name to a paper's `topics` array and include it in the top-level `topics` list if you want it to appear as a filter button.

## Main files

```text
assets/JS/publications-data.js   # publication content and topics
assets/JS/publications.js        # publication renderer and topic filters
assets/JS/site-enhancements.js   # small progressive enhancements
assets/CSS/responsive.css        # responsive fixes and publication filter styling
.nojekyll                        # GitHub Pages compatibility
```

## Notes

- Desktop layout remains controlled by the original template and inline styles.
- Responsive behavior is added through `assets/CSS/responsive.css`.
- Publication thumbnails are lightweight WebP/images for fast GitHub Pages loading.
- ArXiv-only publication rows are not included in the modular publication data.
