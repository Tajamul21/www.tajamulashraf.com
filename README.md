<div align="center">

# Tajamul Ashraf — Personal Website

A clean, responsive, and fast-loading academic website for research, publications, timeline, blog, and community work.

Built for GitHub Pages with a modular publication system, lightweight assets, and the original homepage design preserved.

<br>

[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-222?style=for-the-badge&logo=github)](https://pages.github.com/)
[![Static Website](https://img.shields.io/badge/Type-Static%20Website-0A66C2?style=for-the-badge)](#)
[![Responsive](https://img.shields.io/badge/Design-Responsive-16A34A?style=for-the-badge)](#)
[![Fast Images](https://img.shields.io/badge/Images-Optimized-F59E0B?style=for-the-badge)](#)

</div>

---

## Overview

This repository contains the source code for **Tajamul Ashraf’s personal academic website**.

The website preserves the original homepage template while making the publication section modular, responsive, and easy to maintain. It is designed for smooth deployment on GitHub Pages and uses optimized static assets for faster loading.

---

## Highlights

- Original homepage design preserved
- Modular publication system
- Representative and full publication views
- Automatically generated topic filters
- Responsive layout for desktop, tablet, and mobile
- Lightweight publication thumbnails for faster loading
- GitHub Pages ready
- Clean separation between content, styling, and rendering logic

---

## GitHub Pages Deployment

Upload all files in this folder to the root of your GitHub repository.

The `.nojekyll` file is included so GitHub Pages serves static files and assets directly without applying Jekyll processing.

---

## Adding a Publication

Publication entries are managed in:

```text
assets/JS/publications-data.js
```

To add a new publication, append one object inside the `papers` array.

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

---

## Publication Field Guide

| Field | Description |
|---|---|
| `id` | Unique identifier for the publication |
| `selected` | Set to `true` to show the paper in the Representative tab |
| `year` | Publication year |
| `title` | Paper title |
| `authors` | List of authors |
| `venue` | Conference, journal, workshop, or preprint venue |
| `image` | Path to the publication thumbnail |
| `imageAlt` | Short accessible description of the image |
| `links` | Paper, code, PDF, webpage, abstract, or project links |
| `topics` | Research areas used for filtering |
| `abstract` | Short summary of the paper |

---

## Publication Filters

Topic buttons are generated automatically from:

```text
assets/JS/publications-data.js
```

To add a new topic filter:

1. Add the topic name to a paper’s `topics` array.
2. Add the same topic to the top-level `topics` list if you want it to appear as a visible filter button.

---

## Project Structure

```text
.
├── assets/
│   ├── CSS/
│   │   └── responsive.css
│   ├── JS/
│   │   ├── publications-data.js
│   │   ├── publications.js
│   │   └── site-enhancements.js
│   └── Profile Picture/
│       └── papers/
├── index.html
├── .nojekyll
└── README.md
```

---

## Main Files

| File | Purpose |
|---|---|
| `assets/JS/publications-data.js` | Publication content, metadata, topics, links, and abstracts |
| `assets/JS/publications.js` | Publication rendering, tab behavior, and topic filter logic |
| `assets/JS/site-enhancements.js` | Small progressive enhancements for site behavior |
| `assets/CSS/responsive.css` | Responsive layout fixes and publication filter styling |
| `.nojekyll` | GitHub Pages compatibility file |

---

## Notes

- Desktop layout remains controlled by the original template and inline styles.
- Responsive behavior is added through `assets/CSS/responsive.css`.
- Publication thumbnails use lightweight optimized images for faster GitHub Pages loading.
- ArXiv-only publication rows are not included in the modular publication data.
- Content can be updated mainly through `assets/JS/publications-data.js`.

---

## Maintenance Tips

When adding a new paper:

- Keep image files lightweight.
- Use short and descriptive `imageAlt` text.
- Keep abstracts concise.
- Use consistent topic names.
- Use official paper, code, or project links whenever possible.

---

<div align="center">

Designed for clarity, speed, and maintainability.

</div>
