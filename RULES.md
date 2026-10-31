# antiSlopdev rules

Slop is what an AI ships when nobody asked it to decide anything: the safe default, repeated until every product looks, reads and compiles the same. These rules name those defaults so an agent can catch them before a human has to.

Every rule has a stable ID. An ID never changes meaning; a retired rule keeps its number and is marked retired.

**Levels**

- `block` is never acceptable in shipped work. The checker fails the run.
- `justify` is allowed only with a one-line reason in the code, the PR or the design doc (`antislopdev-allow UI-04: brand mark is a spark`). Without the reason it fails.
- `warn` is a smell. It is reported, never fails a run on its own, and three or more warns of the same rule in one file are promoted to `justify`.

**Checks**

- `static`: the checker finds it deterministically (regex, AST, CSS or HTML parse).
- `heuristic`: the checker scores it and reports a confidence.
- `review`: the agent must look at the rendered result and report it in the delivery note.

These rules describe defaults to avoid, not a style to adopt. Rounded corners, gradients, dark themes, monospace, motion and illustration are all fine when someone chose them on purpose. The rules only ask that the choice was made.

---

## UI: interface

| ID | Rule | Level | Check |
|---|---|---|---|
| UI-01 | **Eyebrow label above every heading.** A small uppercase, wide-tracked line sitting on top of a section heading ("FEATURES", "HOW IT WORKS", "WHY US") repeated section after section. One deliberate kicker is fine; a pattern of them is slop. | warn | static |
| UI-02 | **Pill badge above the hero headline.** "✨ New: AI-powered", "Introducing v2", "Now in beta" in a rounded capsule with a border or glow, placed only to fill space above the headline. | justify | static |
| UI-03 | **Stock icon as decoration.** Library icons (sparkles, wand, zap, rocket, brain, bot, shield-check, check-circle, star, gem, layers) placed beside headings or in feature cards where they carry no meaning the text does not already say. | justify | static |
| UI-04 | **AI sparkle for anything "smart".** The four-point sparkle or magic wand used to mean "AI" on buttons, badges and menu items. | justify | static |
| UI-05 | **Emoji used as icons.** Emoji in headings, buttons, nav items, list bullets or feature cards in place of designed icons or plain text. | block | static |
| UI-06 | **Hero plus three cards.** The template page: centred hero, two buttons, then a row of three (or six) equal feature cards with icon, title and two lines of text. | justify | heuristic |
| UI-07 | **Identical card grid.** Every item rendered as the same box with the same weight, whatever its importance. Not all content needs a card. | warn | heuristic |
| UI-08 | **Default bento.** A bento grid used because it looks modern, with tiles that hold no real content or screenshots. | justify | review |
| UI-09 | **Numbered steps that are not steps.** "01 / 02 / 03" sections for things that have no order. | warn | static |
| UI-10 | **Blue to purple gradient.** The default indigo-violet-fuchsia gradient on backgrounds, buttons or text. | justify | static |
| UI-11 | **Gradient text on headings.** `background-clip: text` gradients on headlines as the main visual idea. | justify | static |
| UI-12 | **Blurred glow blobs.** Large blurred coloured circles behind the hero or cards to add "depth". | justify | static |
| UI-13 | **Decorative grid or dot background.** Graph paper, dot matrix or blueprint lines behind sections with no connection to the product. | justify | static |
| UI-14 | **Glass everywhere.** Backdrop blur on more than two surfaces on one screen. | warn | static |
| UI-15 | **One radius, one shadow, on everything.** The same large radius and soft drop shadow applied to every card, input, button and image, so nothing reads as more important than anything else. | warn | heuristic |
| UI-16 | **Arrow on every button.** "→" or a chevron icon added to all buttons and links instead of only where it signals movement. | warn | static |
| UI-17 | **Hover lift on static cards.** `hover:scale` or `hover:-translate-y` with a bigger shadow on cards that are not clickable. | block | static |
| UI-18 | **Centred everything.** Every section centred with a max-width paragraph under a centred heading, page after page. | warn | heuristic |
| UI-19 | **Uniform section rhythm.** Every section the same padding, same heading size, same layout, so the page has no beginning, middle or end. | warn | review |
| UI-20 | **Logo wall of companies that are not customers.** "Trusted by" or "Used by teams at" rows of famous logos without permission or a real relationship. | block | review |
| UI-21 | **Avatar stack of invented people.** Overlapping avatar circles with "Join 10,000+ developers" when the number or people are not real. | block | review |
| UI-22 | **Typing or gradient-cycling headline.** Typewriter effect or rotating words in the hero used as the only idea. | justify | static |
| UI-23 | **Infinite marquee.** Auto-scrolling logo or testimonial strip with no pause control. | justify | static |
| UI-24 | **Fake shortcut hint.** "⌘K" or keyboard hints shown in the UI where no shortcut exists. | block | review |
| UI-25 | **Dead controls.** Buttons, toggles, tabs or nav links that do nothing, link to `#`, or open an empty page. | block | static |
| UI-26 | **Theme toggle that half works.** A dark mode switch where some components keep light colours, or a theme that was never checked. | block | review |
| UI-27 | **Mock dashboard as hero art.** A fake app screenshot built from random charts and lorem rows, presented as the product. | justify | review |
| UI-28 | **Placeholder imagery shipped.** Random stock photos (picsum, unsplash/random, placeholder services) or generic 3D blobs left in the final page. | block | static |
| UI-29 | **Copied house style.** A page that reproduces a famous product's look (layout, palette and type together) without being asked. | justify | review |
| UI-30 | **No empty, loading or error state.** Data-driven views that only handle the happy path. | block | review |
| UI-31 | **Cards inside cards.** A bordered or shadowed box nested in another one, so the page reads as boxes all the way down. | warn | static |
| UI-32 | **Icon tile on every card.** A large icon in a rounded, tinted square sitting above each card title, repeated across the grid. | justify | static |
| UI-33 | **Grey text on a coloured surface.** Neutral grey body text on a tinted or brand-coloured background, where it looks washed out. Use a darker shade of the surface hue. | warn | static |
| UI-34 | **Neon on dark.** Cyan, electric green or hot pink glow accents on a near-black page as the whole visual identity. | justify | static |
| UI-35 | **Monospace to look technical.** Headings or body copy set in a monospace face only to signal "developer", not because the text is code. | justify | static |
| UI-36 | **Bounce and elastic easing.** Spring, bounce or overshoot curves on ordinary UI transitions. | warn | static |
| UI-37 | **Breaks at phone width.** Horizontal scroll, clipped text or overlapping elements at 360 px wide. | block | review |

## TX: writing (English)

| ID | Rule | Level | Check |
|---|---|---|---|
| TX-01 | **Em dash habit.** More than one em dash per 150 words in UI copy, docs or messages. Use a comma, colon, full stop or parentheses. | warn | static |
| TX-02 | **"Not just X, but Y".** The contrast construction ("It's not just a tool, it's a movement") used to sound profound. | warn | static |
| TX-03 | **Rule of three on repeat.** Lists of exactly three adjectives or clauses in sentence after sentence ("fast, simple, and powerful"). | warn | heuristic |
| TX-04 | **Hype vocabulary.** seamless, effortless, revolutionary, game-changing, cutting-edge, next-level, supercharge, unleash, elevate, empower, transform, robust, leverage, harness, delve, tapestry, realm, testament, beacon. | warn | static |
| TX-05 | **Throat-clearing openers.** "In today's fast-paced world", "In the ever-evolving landscape of", "Have you ever wondered", "Let's dive in", "In this article, we will". | block | static |
| TX-06 | **Summary that repeats the article.** "In conclusion", "To sum up", "In summary" followed by the points already made. | warn | static |
| TX-07 | **Cheerful sign-off.** "Happy coding!", "Hope this helps!", "Feel free to reach out!", "Let me know if you have any questions!" in docs, UI or commit text. | block | static |
| TX-08 | **Generic CTA.** "Get started", "Learn more", "Click here", "Read more", "Discover more" where the button could say what happens. | warn | static |
| TX-09 | **Headline formula.** "Unlock the power of X", "X made simple", "The future of X is here", "Supercharge your X". | warn | static |
| TX-10 | **Exclamation inflation.** More than one exclamation mark per screen or per 300 words. | warn | static |
| TX-11 | **Title Case Every Heading.** Applied by default rather than by the product's style guide. | warn | heuristic |
| TX-12 | **Hedge stack.** "might potentially", "could possibly", "it's worth noting that", "it's important to note that". | warn | static |
| TX-13 | **Whether you're X or Y.** "Whether you're a beginner or a pro", used as an audience opener. | warn | static |
| TX-14 | **Bold sprinkled through paragraphs.** Bold on phrases in most paragraphs, so nothing stands out. | warn | heuristic |
| TX-15 | **Bullets for prose.** Ideas that need a sentence chopped into one-line bullets with a bold lead-in each. | warn | heuristic |
| TX-16 | **Trailing significance clause.** A sentence that ends in "-ing" commentary: ", highlighting its importance", ", underscoring the need for", ", reflecting a broader shift". | warn | static |
| TX-17 | **Inflated importance.** "stands as a testament to", "plays a pivotal role", "marks a significant milestone", "leaves a lasting legacy" for ordinary things. | warn | static |
| TX-18 | **Nameless authority.** "Experts say", "Many believe", "Studies show", "Industry leaders agree" with no named source. | block | static |
| TX-19 | **False range.** "From startups to enterprises", "from design to deployment" where the two ends share no real scale. | warn | static |
| TX-20 | **Staccato negatives.** "No fluff. No jargon. Just results." Fragments that define a thing by what it lacks. | warn | static |
| TX-21 | **Rhetorical setup.** "The result?", "Here's the thing:", "The catch?", "Spoiler:" used to fake suspense before an ordinary point. | warn | static |
| TX-22 | **Synonym cycling.** The same subject renamed every sentence ("the tool", "the platform", "the solution", "this powerhouse") to avoid repeating a word. | warn | heuristic |
| TX-23 | **Assistant residue.** "Certainly! Here's", "Great question", "As an AI language model", "I hope this helps", knowledge-cutoff disclaimers, left in shipped text. | block | static |
| TX-24 | **Template slots left open.** "[Your Name]", "[Insert link]", "{company}", "2025-xx-xx" in published copy. | block | static |
| TX-25 | **Boilerplate outlook section.** A "Challenges and future prospects" or "Looking ahead" section that ends on vague optimism. | warn | heuristic |

## ID: tulisan bahasa Indonesia

| ID | Rule | Level | Check |
|---|---|---|---|
| ID-01 | **Pembuka basa-basi.** "Di era digital saat ini", "Di zaman yang serba cepat", "Seiring perkembangan teknologi", "Pernahkah kamu bertanya-tanya", "Mari kita selami", "Pada artikel kali ini kita akan membahas". | block | static |
| ID-02 | **"Tidak hanya X, tetapi juga Y" berulang.** Konstruksi kontras yang dipakai biar terdengar dalam. | warn | static |
| ID-03 | **Kosakata promosi kosong.** solusi terbaik, revolusioner, inovatif, terdepan, memberdayakan, mengoptimalkan secara maksimal, tingkatkan pengalaman, transformasi digital, ekosistem (tanpa makna). | warn | static |
| ID-04 | **Penutup klise.** "Semoga bermanfaat", "Kesimpulannya", "Dengan demikian", "Demikianlah artikel ini", "Jangan lupa share". | block | static |
| ID-05 | **Terjemahan mentah.** Struktur kalimat bahasa Inggris yang diterjemahkan kata per kata: "Ini adalah penting untuk", "di mana" sebagai penghubung umum, "Anda dapat" berulang di setiap kalimat. | warn | heuristic |
| ID-06 | **Sapaan pemasaran.** "Halo, Sobat!", "Yuk, simak!", "Kuy", dipakai di dokumentasi atau UI produk. | warn | static |
| ID-07 | **Campuran register.** Formal dan santai berganti di paragraf yang sama ("Anda" lalu "kamu", "tidak" lalu "gak") tanpa alasan. | warn | heuristic |
| ID-08 | **CTA umum.** "Mulai Sekarang", "Selengkapnya", "Klik di sini", "Pelajari Lebih Lanjut" di tempat yang bisa menjelaskan aksinya. | warn | static |
| ID-09 | **Tanda seru berlebihan.** Lebih dari satu tanda seru per layar atau per 300 kata. | warn | static |
| ID-10 | **Klausa makna di ujung kalimat.** ", yang menunjukkan pentingnya", ", menegaskan komitmen", ", mencerminkan perubahan besar" sebagai tempelan. | warn | static |
| ID-11 | **Pengagungan berlebihan.** "menjadi bukti nyata", "memainkan peran penting", "tonggak sejarah", "warisan abadi" untuk hal biasa. | warn | static |
| ID-12 | **Otoritas tanpa nama.** "Para ahli mengatakan", "Banyak yang percaya", "Studi menunjukkan" tanpa sumber yang disebut. | block | static |
| ID-13 | **Sisa obrolan chatbot.** "Tentu! Berikut", "Pertanyaan bagus", "Sebagai model bahasa AI", "Semoga membantu" yang ikut terbit. | block | static |
| ID-14 | **Rentang palsu.** "Mulai dari UMKM hingga korporasi", "dari hulu ke hilir" padahal ujungnya gak satu skala. | warn | static |

## CD: code

| ID | Rule | Level | Check |
|---|---|---|---|
| CD-01 | **Comment that narrates the code.** `// increment counter` above `count++`, `// return the result` above `return result`. | block | heuristic |
| CD-02 | **Section banners.** `// ===== HELPERS =====`, `/* ---- State ---- */` in short files. | warn | static |
| CD-03 | **Emoji in code, logs or CLI output.** `console.log('🚀 Server started')`, `✅ Done!` in logs. | block | static |
| CD-04 | **Debug leftovers.** `console.log`, `print`, `debugger`, commented-out blocks shipped. | block | static |
| CD-05 | **Placeholder implementation.** `// TODO: implement`, `throw new Error('Not implemented')`, `pass  # implement later`, functions returning mock data in shipped paths. | block | static |
| CD-06 | **Swallowed errors.** Empty `catch {}`, `catch (e) { console.error(e) }` that continues as if nothing happened. | justify | static |
| CD-07 | **Escape-hatch types.** `any`, `as unknown as`, `@ts-ignore`, `# type: ignore` added to make errors go away. | justify | static |
| CD-08 | **Docstring that repeats the signature.** "Gets the user. Args: user_id: the user id. Returns: the user." | block | heuristic |
| CD-09 | **Defensive noise.** Null checks for values the type system already guarantees, `try` around code that cannot throw. | warn | review |
| CD-10 | **One-use abstraction.** A factory, wrapper, hook or helper file called exactly once, added "for flexibility". | warn | heuristic |
| CD-11 | **Generic names.** `data`, `result`, `item`, `temp`, `handleClick2`, `utils2.ts`, `helpers/index.ts` as a dumping ground. | warn | static |
| CD-12 | **Deprecated API by habit.** Old patterns from training data used where the project's version has a replacement (for example legacy lifecycle APIs, renamed utility classes, removed flags). | block | review |
| CD-13 | **New dependency for a one-liner.** A package added for something the platform or standard library already does. | justify | static |
| CD-14 | **Patch scripts instead of source changes.** Scripts that rewrite built files or source text by string replacement at runtime. | block | review |
| CD-15 | **Curly quotes in code.** “ ” ‘ ’ inside code blocks, config, commands or string literals where straight quotes are required. | block | static |

## DOC: README and docs

| ID | Rule | Level | Check |
|---|---|---|---|
| DOC-01 | **Emoji headings.** "## ✨ Features", "## 🚀 Getting Started", "## 🤝 Contributing". | block | static |
| DOC-02 | **Badge wall.** More than four shields at the top of a README. | warn | static |
| DOC-03 | **Feature list of adjectives.** "⚡ Blazing fast", "🔒 Secure by default", "🎨 Beautiful UI" with no detail behind them. | block | static |
| DOC-04 | **Table of contents for a short page.** A TOC on a README under 400 words. | warn | static |
| DOC-05 | **Boilerplate sections.** Empty "Roadmap", "Acknowledgements", "Star history", "Built with ❤️" added because templates have them. | warn | static |
| DOC-06 | **Install steps that were never run.** Commands copied from another project, wrong package names, missing env setup. | block | review |

## GIT: commits and pull requests

| ID | Rule | Level | Check |
|---|---|---|---|
| GIT-01 | **Emoji or hype in commit messages.** "✨ feat: add amazing new feature", "🚀 Massive improvements". | block | static |
| GIT-02 | **Commit body that narrates the diff.** "This commit updates the file X to change Y" restating what the diff already shows. | warn | heuristic |
| GIT-03 | **PR description template filled with nothing.** "This PR introduces comprehensive improvements to enhance…" with no what, why or how-tested. | block | heuristic |
| GIT-04 | **Unrelated changes bundled.** Formatting churn, renames and the actual fix in one commit. | warn | review |

## TR: truth

| ID | Rule | Level | Check |
|---|---|---|---|
| TR-01 | **Invented numbers.** "10,000+ users", "99.9% uptime", "3x faster" without a source the team can show. The `antislopdev-allow` reason must name the source. | justify | static |
| TR-02 | **Invented testimonials.** Quotes, names, job titles or avatars that belong to no real person. | block | static |
| TR-03 | **Placeholder people and companies shipped.** John Doe, Jane Smith, Acme Inc., lorem ipsum, example@example.com in production copy. | block | static |
| TR-04 | **Compliance and security claims.** "SOC 2 compliant", "bank-grade encryption", "GDPR ready" without evidence. The `antislopdev-allow` reason must point to it. | justify | static |
| TR-05 | **Performance claims nobody measured.** "Lightning fast", "loads instantly", benchmark charts without a method. | justify | heuristic |
| TR-06 | **Fake activity.** "Sarah from Berlin just signed up" toasts, fake counters, fake scarcity timers. | block | static |
| TR-07 | **Links nobody opened.** URLs that return errors, point to the wrong page, or were invented. The checker can test them with `--links`. | block | static |
| TR-08 | **Chat interface residue.** `oaicite`, `contentReference`, `turn0search`, `utm_source=chatgpt.com` and similar markers copied out of a chat window. | block | static |

## AX: accessibility

| ID | Rule | Level | Check |
|---|---|---|---|
| AX-01 | **Div as button.** Clickable `div` or `span` without a native element, role and keyboard support. | block | static |
| AX-02 | **Focus removed.** `outline: none` or `focus:outline-none` without a visible replacement. | block | static |
| AX-03 | **Low contrast text.** Body text below 4.5:1, large text below 3:1, including placeholder and disabled text that carries meaning. | block | static |
| AX-04 | **Missing names.** Icon-only buttons without an accessible name, images without `alt`, inputs without labels. | block | static |
| AX-05 | **Motion without a way out.** Animation that ignores `prefers-reduced-motion`. | block | static |
| AX-06 | **Heading soup.** Skipped heading levels or headings chosen for size. | warn | static |
| AX-07 | **Tiny tap targets.** Interactive elements smaller than 24 by 24 CSS pixels with no spacing to compensate. | block | static |

## PF: performance

| ID | Rule | Level | Check |
|---|---|---|---|
| PF-01 | **Media without dimensions.** Images, video and iframes without width and height or an aspect ratio. | block | static |
| PF-02 | **Lazy hero.** The largest above-the-fold image loaded lazily or without priority. | block | static |
| PF-03 | **Render-blocking scripts in head.** Third-party scripts without `async` or `defer`. | block | static |
| PF-04 | **Animation library for one fade.** A large motion library imported for effects CSS can do. | warn | static |
| PF-05 | **Autoplay video above the fold.** Heavy video in the hero without a poster and a reason. | justify | static |
| PF-06 | **Animating layout.** Transitions on `width`, `height`, `top`, `left`, `margin` or `padding` where `transform` and `opacity` would do. | warn | static |

## SEO: search, answer engines and sharing

Rules for pages that should be found, quoted by AI answer engines (GEO, AEO) and shared with a proper preview. To audit a live URL against the same list, run it through [sarangSEO](https://aconymous.com/tools/sarangseo).

| ID | Rule | Level | Check |
|---|---|---|---|
| SEO-01 | **Page without a title or description.** A document head with no `<title>` or no `<meta name="description">`. In a framework, a route that ships without metadata. | block | static |
| SEO-02 | **Title or description that gets cut.** A `<title>` over 60 characters or a meta description over 160, so the search result ends in an ellipsis. | warn | static |
| SEO-03 | **No canonical URL.** A page head without `<link rel="canonical">`, so copies with tracking parameters or trailing slashes split the ranking. | justify | static |
| SEO-04 | **More than one h1.** Several `h1` elements on one page, or none at all, so neither readers nor crawlers know what the page is about. | warn | static |
| SEO-05 | **Document without a language.** `<html>` with no `lang`, which hurts search, translation, hyphenation and screen readers. | block | static |
| SEO-06 | **Link preview left to chance.** No `og:title`, `og:description`, `og:image` or `twitter:card`, so a shared link shows a bare URL or a random image. | justify | static |
| SEO-07 | **Relative og:image.** `og:image` or `twitter:image` pointing at a relative path. Crawlers need an absolute URL, ideally 1200 px wide. | block | static |
| SEO-08 | **Broken structured data.** A JSON-LD block that is not valid JSON, has no `@context`, or has items without `@type`. Rich results silently disappear. | block | static |
| SEO-09 | **Structured data for things that are not on the page.** FAQ, Review, Rating, Product or Event markup describing questions, stars, prices or dates the visitor cannot see. Search engines treat it as spam. | block | review |
| SEO-10 | **Noindex left in.** `<meta name="robots" content="noindex">`, `robots: { index: false }` or an `X-Robots-Tag: noindex` on a page that is supposed to rank. | justify | static |
| SEO-11 | **Photos as PNG or JPEG.** Photographs and realistic renders served as `.png` or `.jpg` when WebP or AVIF would be a fraction of the size. Screenshots of an interface may stay PNG. | warn | static |
| SEO-12 | **Vector art as a bitmap.** Logos, icons, wordmarks and diagrams shipped as PNG, JPEG or WebP instead of SVG, so they blur on sharp screens and weigh more. | warn | heuristic |
| SEO-13 | **No ICO favicon.** Only PNG or SVG favicons, with no `.ico` for crawlers, search results and older clients that still ask for `/favicon.ico`. | warn | static |
| SEO-14 | **Links crawlers cannot follow.** `<a>` without an `href`, `href="#"` or `javascript:` links, and navigation done only with a click handler. | warn | static |
| SEO-15 | **Answer buried under the question.** A heading phrased as a question whose first sentence does not answer it. Answer engines and featured snippets quote the first sentence. | warn | review |
| SEO-16 | **Facts without a date or a source.** Prices, versions, rankings and statistics with no "as of" date and no link to where they came from. Generative engines cite content they can attribute. | justify | review |
| SEO-17 | **Content that only exists after JavaScript.** Main text, links or metadata injected on the client, so crawlers and AI bots that do not run scripts see an empty page. | justify | review |
| SEO-18 | **Translations that do not point at each other.** Language versions without `hreflang` links to every version and an `x-default`. | justify | review |
| SEO-19 | **Camera file names and alt that repeats them.** `IMG_2041.jpg`, `image-1.png`, `Screenshot.png`, or alt text that is just the file name. | warn | static |
| SEO-20 | **Small previews only.** A robots meta without `max-image-preview:large`, so Discover and rich results can only show a thumbnail. | warn | static |

## SEC: security

Defaults an agent ships when it is in a hurry, drawn from the OWASP Top 10 and from what code scanners such as CodeQL keep finding in generated code. The list grows as new patterns show up. A rule keeps its ID when its wording changes. To check a deployed site's TLS, headers, DNS and exposed services, run a passive scan of a domain you own with [wowHacker](https://aconymous.com/tools/wowhacker).

| ID | Rule | Level | Check |
|---|---|---|---|
| SEC-01 | **Secret in the source.** API keys, tokens, private keys or passwords written into code, config or docs (`sk-…`, `ghp_…`, `AKIA…`, `-----BEGIN PRIVATE KEY-----`). Rotate the key, then move it to the environment. | block | static |
| SEC-02 | **Env file in the tree.** A `.env` or `.env.local` that is not ignored by git. Only `.env.example` with empty values belongs in the repo. | block | static |
| SEC-03 | **Server secret exposed to the browser.** A secret, private key, password or database URL behind a public prefix (`NEXT_PUBLIC_`, `VITE_`, `PUBLIC_`, `EXPO_PUBLIC_`, `REACT_APP_`), which bundles it into client code. | block | static |
| SEC-04 | **eval and friends.** `eval`, `new Function`, or `setTimeout` and `setInterval` given a string. | block | static |
| SEC-05 | **Raw HTML from a variable.** `dangerouslySetInnerHTML`, `v-html`, `{@html}`, `innerHTML` or `insertAdjacentHTML` fed with anything that was not sanitised. | justify | static |
| SEC-06 | **SQL built from strings.** Queries assembled with `${}` or `+` around values instead of parameters or a tagged `sql` template. | block | static |
| SEC-07 | **Shell command built from input.** `exec` or `execSync` with an interpolated or concatenated string. Use `execFile` or `spawn` with an argument array. | block | static |
| SEC-08 | **TLS checks turned off.** `rejectUnauthorized: false`, `NODE_TLS_REJECT_UNAUTHORIZED=0`, `verify=False`, `InsecureSkipVerify: true`. | block | static |
| SEC-09 | **Plain http for resources.** Scripts, styles, images, iframes or API calls over `http://`, outside local hosts. | block | static |
| SEC-10 | **CORS open to everyone.** `Access-Control-Allow-Origin: *`, `origin: '*'` or a bare `cors()` on an API that reads cookies or tokens. | justify | static |
| SEC-11 | **Weak hash for secrets.** MD5 or SHA-1 used for passwords, tokens or signatures. Passwords need argon2, scrypt or bcrypt. | justify | static |
| SEC-12 | **Math.random for anything secret.** Tokens, session IDs, OTPs, reset codes or salts from `Math.random()` instead of `crypto.getRandomValues` or `crypto.randomUUID`. | block | heuristic |
| SEC-13 | **Secrets in logs.** Logging passwords, tokens, cookies, authorization headers or whole request bodies. | justify | static |
| SEC-14 | **Open redirect.** Redirecting to a URL taken straight from the query string or body without checking that it stays on your own host. | block | heuristic |
| SEC-15 | **Floating dependency versions.** `"*"`, `"latest"` or a git branch as a version in `package.json`, so a compromised release lands on the next install. | justify | static |
| SEC-16 | **Authorisation only in the browser.** Hiding a button or a route on the client while the API route or server action behind it does not check the session and the role. | block | review |
| SEC-17 | **Input trusted without validation.** API routes, server actions and webhooks that use the body without a schema, or accept webhooks without verifying the signature. | block | review |
| SEC-18 | **No rate limit on sensitive routes.** Login, sign-up, password reset, OTP and paid API proxies with no limit per IP or per account. | justify | review |
| SEC-19 | **Missing security headers.** No Content-Security-Policy, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy` or `frame-ancestors`. | justify | review |
| SEC-20 | **Auth cookie without flags.** Session, token or JWT cookies set without `httpOnly` (and `secure`, `sameSite`), or written from client code with `document.cookie`. | block | heuristic |
| SEC-21 | **Stack traces sent to users.** Error stacks or internal details returned in API responses or rendered on error pages. | justify | static |
| SEC-22 | **Regex that can hang.** A group with a quantifier inside that is itself repeated, like `(a+)+`, `(\w+\s?)*` or `(.*)*`, in a pattern that reads user input, uploaded files or request data. One crafted string can keep a single match busy for minutes. Write the pattern so each character can be matched only one way, cap the input length, or use a linear engine such as RE2. | justify | heuristic |
| SEC-23 | **HTML cleaned with a regex.** Stripping tags with `.replace(/<[^>]*>/g, '')` or `/<script.*?<\/script>/` before the result is shown or stored. Regexes miss `</script >`, tags split across lines, broken markup and comments that end in `--!>`. Use DOMPurify or sanitize-html for HTML you render, and `textContent` or a real parser when you only need the text. | justify | static |
| SEC-24 | **Escaping by hand.** `new RegExp()` built from a variable that was never escaped, or a quote, backslash or `<` escaped with `.replace('"', …)`, which only changes the first one. Use `RegExp.escape()` (Node 24 and current browsers) or a full escape helper, `replaceAll`, and the encoder that belongs to the output: `encodeURIComponent`, `JSON.stringify` or your template engine. | justify | heuristic |
| SEC-25 | **Third-party script without integrity.** A `<script>` or stylesheet from another host loaded without `integrity`, so whoever controls that CDN controls your page. Pin the version and add the hash with `crossorigin`, or serve the file yourself. Tags that change by design and publish no hash (Google tag, Stripe.js, Turnstile, Cloudflare Web Analytics) are skipped. | justify | static |
| SEC-26 | **Page text used as HTML or a link.** Text read back from the page (`textContent`, `innerText`, `dataset`, `getAttribute`, `location.hash`, `location.search`, `document.referrer`) written into `innerHTML`, `dangerouslySetInnerHTML`, `document.write`, an `href`, a `src` or `location` without a check, directly or through a variable. Whatever ends up in that text, a `javascript:` URL included, runs on your page. Pass data as a script value or a fetched response, check URLs against your own paths or allowed protocols, and write text with `textContent`. | justify | heuristic |

---

## Delivery note

Before an agent says the work is done it writes a short note:

1. What it ran: build, tests, the checker (`npx antislopdev check`), and what it looked at in a browser.
2. Every `justify` it used, with the reason.
3. Every `review` rule it checked by eye, one line each.

No note, not done.
