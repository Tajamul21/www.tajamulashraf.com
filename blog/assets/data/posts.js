/*
  Easy blog editing
  -----------------
  Add a new post by copying this object and pasting it anywhere inside the
  posts array below. The site sorts posts by date automatically.

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
Write your post in normal text.

## Add headings like this

- Add bullet points
- Add another point

```js
console.log("Code blocks work too");
```
    `
  },

*/
(function () {
  "use strict";

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function slugify(value) {
    return String(value || "post")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "post";
  }

  function inlineMarkdown(text) {
    var safe = escapeHtml(text);
    safe = safe.replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+|assets\/[^\s)]+)\)/g, '<img class="img-fluid my-3" src="$2" alt="$1" loading="lazy" decoding="async">');
    safe = safe.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|[^\s)]+\.html(?:\?[^\s)]*)?)\)/g, function (_, label, href) {
      var external = /^https?:\/\//i.test(href);
      return '<a href="' + href + '"' + (external ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + label + '</a>';
    });
    safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');
    return safe;
  }

  function markdownToHtml(markdown) {
    var lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n");
    var html = [];
    var paragraph = [];
    var list = [];
    var code = [];
    var inCode = false;
    var codeLanguage = "";

    function flushParagraph() {
      if (!paragraph.length) return;
      html.push('<p>' + inlineMarkdown(paragraph.join(' ')) + '</p>');
      paragraph = [];
    }

    function flushList() {
      if (!list.length) return;
      html.push('<ul class="mb-4">' + list.map(function (item) { return '<li>' + inlineMarkdown(item) + '</li>'; }).join('') + '</ul>');
      list = [];
    }

    lines.forEach(function (rawLine) {
      var line = rawLine.replace(/\s+$/g, "");
      var trimmed = line.trim();

      if (/^```/.test(trimmed)) {
        if (inCode) {
          html.push('<pre><code' + (codeLanguage ? ' class="language-' + escapeHtml(codeLanguage) + '"' : '') + '>' + escapeHtml(code.join("\n")) + '</code></pre>');
          code = [];
          inCode = false;
          codeLanguage = "";
        } else {
          flushParagraph();
          flushList();
          inCode = true;
          codeLanguage = trimmed.replace(/^```/, "").trim().replace(/[^a-z0-9_-]/gi, "");
        }
        return;
      }

      if (inCode) {
        code.push(rawLine);
        return;
      }

      if (!trimmed) {
        flushParagraph();
        flushList();
        return;
      }

      var heading = trimmed.match(/^(#{2,4})\s+(.+)$/);
      if (heading) {
        flushParagraph();
        flushList();
        var level = heading[1].length;
        html.push('<h' + level + ' class="mt-5 mb-3">' + inlineMarkdown(heading[2]) + '</h' + level + '>');
        return;
      }

      var bullet = trimmed.match(/^[-*]\s+(.+)$/);
      if (bullet) {
        flushParagraph();
        list.push(bullet[1]);
        return;
      }

      var quote = trimmed.match(/^>\s+(.+)$/);
      if (quote) {
        flushParagraph();
        flushList();
        html.push('<blockquote class="blockquote m-lg-5 py-3 pl-4 px-lg-5"><p class="mb-2">' + inlineMarkdown(quote[1]) + '</p></blockquote>');
        return;
      }

      paragraph.push(trimmed);
    });

    flushParagraph();
    flushList();
    if (inCode) {
      html.push('<pre><code>' + escapeHtml(code.join("\n")) + '</code></pre>');
    }
    return html.join("\n");
  }

  function createBlogPost(post) {
    post = Object.assign({}, post || {});
    post.slug = post.slug || slugify(post.title);
    post.title = post.title || "Untitled post";
    post.date = post.date || new Date().toISOString().slice(0, 10);
    post.readTime = post.readTime || "3 min read";
    post.category = post.category || "Notes";
    post.thumb = post.thumb || post.image || "assets/images/covers/cover-research.svg";
    post.image = post.image || post.thumb;
    post.tags = Array.isArray(post.tags) ? post.tags : [];
    if (!post.content && post.markdown) post.content = markdownToHtml(post.markdown);
    return post;
  }

  var posts = [
    {
      "slug": "iclr-2026-rio-claro",
      "title": "Attending ICLR 2026 in Brazil: Travel Lessons Every Researcher Should Know",
      "date": "2026-05-26",
      "readTime": "7 min read",
      "category": "Travel",
      "image": "assets/images/rio-feature.jpg",
      "thumb": "assets/images/rio-feature.jpg",
      "excerpt": "My journey started with planning for the ICLR 2026, one of the prestigious conference in the world of Artificial Intelligence.",
      "tags": [
        "ICLR",
        "Research",
        "Travel"
      ],
      "content": `
      <p>My journey started with planning for the <a href="https://iclr.cc/" target="_blank" rel="noopener noreferrer">ICLR 2026</a>, one of the prestigious conference in the world of Artificial Intelligence. I was thrilled to know that my paper got accepted and was very fortunate to receive the <a href="https://iclr.cc/Conferences/2026/FinancialAssistance" target="_blank" rel="noopener noreferrer">DEI travel grant</a> to present my work in-person (yay!). I planned my long trip, since ICLR for the first time was going to be held in Latin America. With much excitement I booked my flights and starred at the calendar for next 3 weeks.</p>
      <h4 class="mt-5 mb-3">The First Shock.</h4>
      <p>Like always, just when I thought everything was a straight line, I got my first shock just two days prior to my flight. I received an email that my flights were self check-in and I have to do check in Rome again for which I needed to clear the immigration. <mark>This blew my mind</mark> since I didn't had Schengen visa. With mixed emotions of sadness and anger, I called <a href="https://www.emirates.com/" target="_blank" rel="noopener noreferrer">Emirates</a>, <a href="https://www.ita-airways.com/" target="_blank" rel="noopener noreferrer">ITA Airways</a> to assist. To my surprise, Emirates gave a assurance that they will be able to board me from Singapore however they were not sure whether ITA will allow me to board in Italy, thus I was dilemma to the last minute. On flight day, I went to airport half-heartedly, and Emirates hands me three boarding passes including Rome to Brazil. At first I thought this was a genuine mistake, I inquired with them they have been mistaken and staff told me that they have collaboration with ITA Airways and they can issue boarding pass on their behalf. <em>I was so relieved</em> and next 27 hours were fun. Finally after being in air so long, I touched Rio-de-Janeiro, unaware of how Latin America would treat me. From the airport, I took a BRT, and then a Uber-motorcycle (<strong>courageous</strong>), since I had no luggage. Innocently I talked to strangers at the traffic signals and later came to know it was not safe at all. I even took a morning walk around 7 AM, later I came to know was a shady neighborhood. :)</p>
      <h4 class="mt-5 mb-3">The Conference.</h4>
      <div class="post-split-media">
        <figure class="post-photo"><img src="assets/images/iclr-presentation.jpg" alt="Tajamul Ashraf presenting his paper at ICLR" loading="lazy" decoding="async"><figcaption>Photo credit: Jean</figcaption></figure>
        <div>
          <p>Apart from attending the conference, I was volunteering as well. I got a free registration for this job (Visit: <a href="https://iclr.cc/Conferences/2026/FinancialAssistance" target="_blank" rel="noopener noreferrer">link</a>). I shared my hotel room with another volunteer <strong>Jean Lopez</strong> (a good person and really good friend, more about him later !). First day of volunteering, I registered almost <strong>600 participants</strong> for the conference, although it was only scan/document checking and issuing the badge. The famous word which was buzzing during the registration was my loud <strong>"NEXT"</strong>. For the next few days, I optimized my time to take the best from the conference including the goodies. I charted down the talks and workshops of my interest using the ICLR app, which helps you create groups and plan your day conveniently.</p>
        </div>
      </div>
      <h4 class="mt-5 mb-3">The Food.</h4>
      <p>As a Muslim, I had to keep a check on <strong>Halal food</strong>. One of the downside in Brazil was that I only ate eggs and fish so next five days. I also did side seeing, what amazed me the most was the <a href="https://en.santuariocristoredentor.com.br/" target="_blank" rel="noopener noreferrer">Christ the Redeemer</a>, how they managed to build it on top of mountain, and in one piece. It is exemplary , more about it <a href="https://riotur.rio/en/que_fazer/christtheredeemer/" target="_blank" rel="noopener noreferrer">here</a>. Finally the halal drought ended when Jean and I visit <strong>Taj Mahal restaurant in Rio</strong>, It was a halal certified restaurant (I checked), we tried <em>Rogan josh and chicken tikka yummy</em>. On the final day of my conference I had another volunteer shift, and I had to handle poster assigning and I worked with <strong>Candice</strong> (she worked with poster company), an vibrant personality from Spain. She knew more Arabic than me! that was really awesome. Hopefully I may catch her in another conference. On <strong>28 May</strong> I had flight from Rio to Sau Paulo, then to Ethiopia and then to Singapore, <a href="https://www.latamairlines.com/" target="_blank" rel="noopener noreferrer">LATAM</a> was 5 hours late, gave me 100 BR coupon to eat, which I as a Kashmiri utilized fully.</p>
      <figure class="post-photo"><img src="assets/images/christ-redeemer-view.jpg" alt="View from Corcovado Mountain" loading="lazy" decoding="async"><figcaption>View from Corcovado Mountain.</figcaption></figure>
      <h4 class="mt-5 mb-3">The second shock.</h4>
      <p>After eating too much food, I was home sick suddenly, Finally the flight took off, I had a layover of another 3 hours, after time-dilation, i went to the boarding gate in Sau Palo, and the staff denied me boarding saying that I had to have <strong>yellow fever vaccine</strong> to enter Singapore, and LATAM should not have boarded me in Rio de Jamario,  I was like <em>why is this happening to me, not again</em>. Heartbroken i went to LATAM, doing immigration again in Brazil, and guess what they don't understand English and it is 2 AM in the morning, Bummer! I am supporter of native language promotion, but alteast at international points, i didn't expected this. After two hours of back and forth google translations, I was given a reschedule, hotel and cab. However I had to take the vaccine and then wait for <strong>10 days</strong> before i enter Singapore again. I went to the hotel not knowing what to do. In the morning i remembered my friend Jean, yes he mentioned he is a lecturer in Sau Palo. I called him, and came to know that he lived 4 hours from Sao palo along country side called <strong>Rio Claro</strong>, one of the beautiful and peaceful places i have been so far. After sleeping through the full 4 hour journey, I reached Rio Claro and bunked in Jean's place.</p>
      <h4 class="mt-5 mb-3">Blessing in disguise.</h4>
      <figure class="post-photo"><img src="assets/images/rio-claro-night.jpg" alt="Evening at UNESP Rio Claro" loading="lazy" decoding="async"><figcaption>An evening in UNESP Rio Claro, beautiful campus.</figcaption></figure>
      <p>Next thing, we started to search for a dispensary that can give me vaccine shot, since it was directly proportional to when i can exit Brazil. Finally we found one small dispensary open, and I feel little proud to say that <mark>I was the first foreigner to get a shot there</mark>. Thanks to jean for being my translator. After some hurdles, I got the yellow fever certification. Following few day i accompanied Jean to his university <a href="https://www.rc.unesp.br/" target="_blank" rel="noopener noreferrer">UNESP</a>, and worked his lab, I did my <a href="https://neurips.cc/" target="_blank" rel="noopener noreferrer">NeurIPS</a> submission there. I met lot of fantastic people over there. I remembered going to an Italian festival, and I can say now i am only fan of Italian dessert. We also visited the show by the Queens by the lake. I tried all kind of Brazilian food i could try. The local breads were nice and what Jean prepared, I also tried to prepare a dish, but failed terribly. On the last day, we went to have a heavy breakfast. With my stomach full I left to the airport. I had a transit through Addis Ababa, the local coffee was refreshing. After <strong>25+ hours in the air</strong>, I finally reached Singapore. <em>This journey was full of mistakes, but I will always cherish the people and experiences i got in this unplanned stay in Brazil.</em></p>
    `
    },
    /*
    {
      "slug": "why-every-developer-should-blog",
      "title": "Why Every Developer Should Have a Blog",
      "date": "2026-02-18",
      "readTime": "6 min read",
      "category": "Writing",
      "image": "assets/images/covers/cover-writing.svg",
      "thumb": "assets/images/covers/cover-writing.svg",
      "excerpt": "A blog turns scattered learning into a searchable portfolio, a teaching tool, and a long-term record of growth.",
      "tags": [
        "Writing",
        "Career",
        "Learning"
      ],
      "content": "\n      <p>A developer blog is more than a place to publish tutorials. It is a system for thinking clearly. When you explain a bug, a paper, a framework, or a design choice, you discover what you really understand and what still needs work.</p>\n      <p>The best posts are practical and honest. Share the context, show the trade-offs, include mistakes, and make the solution reproducible. Readers trust useful details more than perfect branding.</p>\n      <h3 class=\"mt-5 mb-3\">A simple writing workflow</h3>\n      <ul class=\"mb-5\"><li class=\"mb-2\">Save rough notes while solving the problem.</li><li class=\"mb-2\">Turn the notes into a short outline.</li><li class=\"mb-2\">Add screenshots, code, and links only where they help.</li><li class=\"mb-2\">Publish, then improve the post as your understanding grows.</li></ul>\n      <p>Over time, the blog becomes a living archive of your learning. That is useful for future you and for everyone who finds the same problem later.</p>\n    "
    },
    {
      "slug": "full-stack-developer-guide",
      "title": "A Practical Guide to Becoming a Full-Stack Developer",
      "date": "2026-01-24",
      "readTime": "7 min read",
      "category": "Development",
      "image": "assets/images/covers/cover-stack.svg",
      "thumb": "assets/images/covers/cover-stack.svg",
      "excerpt": "The full-stack path is easier when you learn in layers: interface, data, backend, deployment, and observability.",
      "tags": [
        "JavaScript",
        "Backend",
        "Career"
      ],
      "content": "\n      <p>Full-stack development can feel overwhelming because every layer has its own tools. The trick is to build a small complete product first, then improve one layer at a time.</p>\n      <p>Start with a plain interface, connect it to a simple API, store data in a database, deploy it, and add logs. Once that loop works, frameworks become easier to evaluate because you understand what problem each one solves.</p>\n      <h3 class=\"mt-5 mb-3\">Skills that compound</h3>\n      <p>HTTP, accessibility, databases, authentication, caching, and deployment fundamentals stay useful even when frameworks change. Learn those deeply and your stack becomes less fragile.</p>\n    "
    },
    {
      "slug": "high-performance-javascript",
      "title": "High Performance JavaScript for Everyday Sites",
      "date": "2025-12-15",
      "readTime": "8 min read",
      "category": "Performance",
      "image": "assets/images/covers/cover-performance.svg",
      "thumb": "assets/images/covers/cover-performance.svg",
      "excerpt": "Small front-end decisions add up: ship less JavaScript, defer what is not critical, and measure before optimizing.",
      "tags": [
        "JavaScript",
        "Performance",
        "Frontend"
      ],
      "content": "\n      <p>Performance is not only about clever algorithms. For most websites, the biggest wins come from sending less code, delaying non-critical work, compressing assets, and avoiding layout shifts.</p>\n      <pre><code>document.addEventListener('DOMContentLoaded', () => {\n  // Keep the first screen fast. Start extras after the page is usable.\n  requestIdleCallback?.(() => initializeNiceToHaveFeatures());\n});</code></pre>\n      <p>Measure first. Improve the slowest real user paths. Then keep the site simple enough that future changes do not undo the gains.</p>\n    "
    },
    {
      "slug": "top-javascript-frameworks",
      "title": "Choosing the Right JavaScript Framework",
      "date": "2025-11-20",
      "readTime": "9 min read",
      "category": "Frontend",
      "image": "assets/images/covers/cover-framework.svg",
      "thumb": "assets/images/covers/cover-framework.svg",
      "excerpt": "The best framework is the one that matches your content model, team habits, hosting plan, and long-term maintenance needs.",
      "tags": [
        "Frontend",
        "Frameworks",
        "Architecture"
      ],
      "content": "\n      <p>Framework discussions often become popularity contests. A better question is: what are you building, who will maintain it, and how much interactivity does it really need?</p>\n      <p>For a content-heavy blog, a simple static setup can be faster and easier than a large application framework. For dashboards, collaboration tools, and authenticated products, a richer framework may be worth the complexity.</p>\n      <p>Choose the smallest tool that leaves room for your next realistic feature.</p>\n    "
    },
    {
      "slug": "learn-react-in-24-hours",
      "title": "How I Would Learn React in 24 Focused Hours",
      "date": "2025-10-10",
      "readTime": "10 min read",
      "category": "Learning",
      "image": "assets/images/covers/cover-react.svg",
      "thumb": "assets/images/covers/cover-react.svg",
      "excerpt": "A compact React study plan built around components, state, effects, forms, routing, and one finished mini-project.",
      "tags": [
        "React",
        "Learning",
        "Frontend"
      ],
      "content": "\n      <p>React makes more sense when you learn it by building. Spend the first hours on components and props, then state, effects, forms, and routing. Keep notes on every bug because the debugging process teaches the mental model.</p>\n      <p>The goal is not to memorize every API in one day. The goal is to finish a small app and understand where data lives, how UI updates, and how components communicate.</p>\n    "
    },
    {
      "slug": "about-remote-working",
      "title": "What Remote Working Taught Me About Focus",
      "date": "2025-09-05",
      "readTime": "4 min read",
      "category": "Productivity",
      "image": "assets/images/covers/cover-focus.svg",
      "thumb": "assets/images/covers/cover-focus.svg",
      "excerpt": "Remote work rewards clear writing, protected attention, and rituals that separate deep work from always-on messaging.",
      "tags": [
        "Remote Work",
        "Focus",
        "Habits"
      ],
      "content": "\n      <p>Remote work is not automatically flexible. It becomes flexible when communication is clear and priorities are visible. Otherwise, the day can turn into a stream of notifications.</p>\n      <p>The most useful habit is writing decisions down. It reduces repeated meetings, helps teammates catch up, and creates a record that future work can build on.</p>\n    "
    },
    {
      "slug": "build-a-fast-static-blog",
      "title": "Building a Fast Static Blog With Dynamic Features",
      "date": "2025-08-18",
      "readTime": "6 min read",
      "category": "Jamstack",
      "image": "assets/images/covers/cover-jamstack.svg",
      "thumb": "assets/images/covers/cover-jamstack.svg",
      "excerpt": "You can keep a static blog fast while adding synced comments, analytics, and visitor maps through small hosted services.",
      "tags": [
        "Static Site",
        "Supabase",
        "Performance"
      ],
      "content": "\n      <p>A static blog loads quickly because the browser receives simple HTML, CSS, and JavaScript. Dynamic features do not have to ruin that. Use a small backend only for the data that must be shared: comments, page views, and visitor locations.</p>\n      <p>This approach keeps hosting simple while still giving readers a modern experience. The key is to lazy-load extras, cache static files well, and avoid blocking the article content.</p>\n    "
    }
    */
  ];

  window.createBlogPost = createBlogPost;
  window.BLOG_POSTS = posts.map(createBlogPost).sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
})();
