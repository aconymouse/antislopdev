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

---

## Delivery note

Before an agent says the work is done it writes a short note:

1. What it ran: build, tests, the checker (`npx antislopdev check`), and what it looked at in a browser.
2. Every `justify` it used, with the reason.
3. Every `review` rule it checked by eye, one line each.

No note, not done.
