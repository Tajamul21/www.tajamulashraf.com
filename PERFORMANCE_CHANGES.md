# Performance changes

The 10-20 second blank publication boxes were likely caused by two things happening together:

1. The publication images were created by JavaScript near the bottom of the page, so the browser discovered them late.
2. The page was still making slow third-party requests, including a broken LinkedIn widget request to `platform.Linkedln.com`, which can keep the browser spinner active until the request times out.

## Fixes applied in this version

- Added immediate `<link rel="preload">` tags in the HTML `<head>` for the Representative publication thumbnails.
- Added very small 260px WebP thumbnails for every paper image, plus 520px and 760px WebP candidates for sharper screens.
- Updated the publication renderer to use the new fast WebP thumbnails instead of waiting for the larger fallback images.
- Set all Representative images to `loading="eager"`, `fetchpriority="high"`, and `decoding="sync"`.
- Deferred rendering of the hidden “All” publication image list until the page is idle or the All tab is opened.
- Deferred local header scripts that do not need to block initial rendering.
- Deferred Google Analytics loading until after the first paint / browser idle time.
- Made Google Fonts and Font Awesome non-render-blocking.
- Removed the broken `platform.Linkedln.com/widgets.js` request. It was not rendering visible content and could keep the page loading for many seconds.
- Added cache-busting query strings for the changed CSS and publication JavaScript files.

## Expected impact

The first Representative thumbnails now load from files around 3-16 KB at the smallest candidate, instead of waiting for much larger images or late-discovered JavaScript-generated requests. The browser can begin downloading the first paper images while the page head is still loading.
