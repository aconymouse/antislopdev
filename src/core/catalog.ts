import type { RuleMeta } from './types.js'

export const catalog: readonly RuleMeta[] = [
  {
    "id": "UI-01",
    "title": "Eyebrow label above every heading",
    "detail": "A small uppercase, wide-tracked line sitting on top of a section heading (\"FEATURES\", \"HOW IT WORKS\", \"WHY US\") repeated section after section. One deliberate kicker is fine; a pattern of them is slop.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "UI-02",
    "title": "Pill badge above the hero headline",
    "detail": "\"✨ New: AI-powered\", \"Introducing v2\", \"Now in beta\" in a rounded capsule with a border or glow, placed only to fill space above the headline.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "UI-03",
    "title": "Stock icon as decoration",
    "detail": "Library icons (sparkles, wand, zap, rocket, brain, bot, shield-check, check-circle, star, gem, layers) placed beside headings or in feature cards where they carry no meaning the text does not already say.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "UI-04",
    "title": "AI sparkle for anything \"smart\"",
    "detail": "The four-point sparkle or magic wand used to mean \"AI\" on buttons, badges and menu items.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "UI-05",
    "title": "Emoji used as icons",
    "detail": "Emoji in headings, buttons, nav items, list bullets or feature cards in place of designed icons or plain text.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "UI-06",
    "title": "Hero plus three cards",
    "detail": "The template page: centred hero, two buttons, then a row of three (or six) equal feature cards with icon, title and two lines of text.",
    "level": "justify",
    "check": "heuristic"
  },
  {
    "id": "UI-07",
    "title": "Identical card grid",
    "detail": "Every item rendered as the same box with the same weight, whatever its importance. Not all content needs a card.",
    "level": "warn",
    "check": "heuristic"
  },
  {
    "id": "UI-08",
    "title": "Default bento",
    "detail": "A bento grid used because it looks modern, with tiles that hold no real content or screenshots.",
    "level": "justify",
    "check": "review"
  },
  {
    "id": "UI-09",
    "title": "Numbered steps that are not steps",
    "detail": "\"01 / 02 / 03\" sections for things that have no order.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "UI-10",
    "title": "Blue to purple gradient",
    "detail": "The default indigo-violet-fuchsia gradient on backgrounds, buttons or text.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "UI-11",
    "title": "Gradient text on headings",
    "detail": "`background-clip: text` gradients on headlines as the main visual idea.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "UI-12",
    "title": "Blurred glow blobs",
    "detail": "Large blurred coloured circles behind the hero or cards to add \"depth\".",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "UI-13",
    "title": "Decorative grid or dot background",
    "detail": "Graph paper, dot matrix or blueprint lines behind sections with no connection to the product.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "UI-14",
    "title": "Glass everywhere",
    "detail": "Backdrop blur on more than two surfaces on one screen.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "UI-15",
    "title": "One radius, one shadow, on everything",
    "detail": "The same large radius and soft drop shadow applied to every card, input, button and image, so nothing reads as more important than anything else.",
    "level": "warn",
    "check": "heuristic"
  },
  {
    "id": "UI-16",
    "title": "Arrow on every button",
    "detail": "\"→\" or a chevron icon added to all buttons and links instead of only where it signals movement.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "UI-17",
    "title": "Hover lift on static cards",
    "detail": "`hover:scale` or `hover:-translate-y` with a bigger shadow on cards that are not clickable.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "UI-18",
    "title": "Centred everything",
    "detail": "Every section centred with a max-width paragraph under a centred heading, page after page.",
    "level": "warn",
    "check": "heuristic"
  },
  {
    "id": "UI-19",
    "title": "Uniform section rhythm",
    "detail": "Every section the same padding, same heading size, same layout, so the page has no beginning, middle or end.",
    "level": "warn",
    "check": "review"
  },
  {
    "id": "UI-20",
    "title": "Logo wall of companies that are not customers",
    "detail": "\"Trusted by\" or \"Used by teams at\" rows of famous logos without permission or a real relationship.",
    "level": "block",
    "check": "review"
  },
  {
    "id": "UI-21",
    "title": "Avatar stack of invented people",
    "detail": "Overlapping avatar circles with \"Join 10,000+ developers\" when the number or people are not real.",
    "level": "block",
    "check": "review"
  },
  {
    "id": "UI-22",
    "title": "Typing or gradient-cycling headline",
    "detail": "Typewriter effect or rotating words in the hero used as the only idea.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "UI-23",
    "title": "Infinite marquee",
    "detail": "Auto-scrolling logo or testimonial strip with no pause control.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "UI-24",
    "title": "Fake shortcut hint",
    "detail": "\"⌘K\" or keyboard hints shown in the UI where no shortcut exists.",
    "level": "block",
    "check": "review"
  },
  {
    "id": "UI-25",
    "title": "Dead controls",
    "detail": "Buttons, toggles, tabs or nav links that do nothing, link to `#`, or open an empty page.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "UI-26",
    "title": "Theme toggle that half works",
    "detail": "A dark mode switch where some components keep light colours, or a theme that was never checked.",
    "level": "block",
    "check": "review"
  },
  {
    "id": "UI-27",
    "title": "Mock dashboard as hero art",
    "detail": "A fake app screenshot built from random charts and lorem rows, presented as the product.",
    "level": "justify",
    "check": "review"
  },
  {
    "id": "UI-28",
    "title": "Placeholder imagery shipped",
    "detail": "Random stock photos (picsum, unsplash/random, placeholder services) or generic 3D blobs left in the final page.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "UI-29",
    "title": "Copied house style",
    "detail": "A page that reproduces a famous product's look (layout, palette and type together) without being asked.",
    "level": "justify",
    "check": "review"
  },
  {
    "id": "UI-30",
    "title": "No empty, loading or error state",
    "detail": "Data-driven views that only handle the happy path.",
    "level": "block",
    "check": "review"
  },
  {
    "id": "UI-31",
    "title": "Cards inside cards",
    "detail": "A bordered or shadowed box nested in another one, so the page reads as boxes all the way down.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "UI-32",
    "title": "Icon tile on every card",
    "detail": "A large icon in a rounded, tinted square sitting above each card title, repeated across the grid.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "UI-33",
    "title": "Grey text on a coloured surface",
    "detail": "Neutral grey body text on a tinted or brand-coloured background, where it looks washed out. Use a darker shade of the surface hue.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "UI-34",
    "title": "Neon on dark",
    "detail": "Cyan, electric green or hot pink glow accents on a near-black page as the whole visual identity.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "UI-35",
    "title": "Monospace to look technical",
    "detail": "Headings or body copy set in a monospace face only to signal \"developer\", not because the text is code.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "UI-36",
    "title": "Bounce and elastic easing",
    "detail": "Spring, bounce or overshoot curves on ordinary UI transitions.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "UI-37",
    "title": "Breaks at phone width",
    "detail": "Horizontal scroll, clipped text or overlapping elements at 360 px wide.",
    "level": "block",
    "check": "review"
  },
  {
    "id": "TX-01",
    "title": "Em dash habit",
    "detail": "More than one em dash per 150 words in UI copy, docs or messages. Use a comma, colon, full stop or parentheses.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "TX-02",
    "title": "\"Not just X, but Y\"",
    "detail": "The contrast construction (\"It's not just a tool, it's a movement\") used to sound profound.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "TX-03",
    "title": "Rule of three on repeat",
    "detail": "Lists of exactly three adjectives or clauses in sentence after sentence (\"fast, simple, and powerful\").",
    "level": "warn",
    "check": "heuristic"
  },
  {
    "id": "TX-04",
    "title": "Hype vocabulary",
    "detail": "seamless, effortless, revolutionary, game-changing, cutting-edge, next-level, supercharge, unleash, elevate, empower, transform, robust, leverage, harness, delve, tapestry, realm, testament, beacon.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "TX-05",
    "title": "Throat-clearing openers",
    "detail": "\"In today's fast-paced world\", \"In the ever-evolving landscape of\", \"Have you ever wondered\", \"Let's dive in\", \"In this article, we will\".",
    "level": "block",
    "check": "static"
  },
  {
    "id": "TX-06",
    "title": "Summary that repeats the article",
    "detail": "\"In conclusion\", \"To sum up\", \"In summary\" followed by the points already made.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "TX-07",
    "title": "Cheerful sign-off",
    "detail": "\"Happy coding!\", \"Hope this helps!\", \"Feel free to reach out!\", \"Let me know if you have any questions!\" in docs, UI or commit text.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "TX-08",
    "title": "Generic CTA",
    "detail": "\"Get started\", \"Learn more\", \"Click here\", \"Read more\", \"Discover more\" where the button could say what happens.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "TX-09",
    "title": "Headline formula",
    "detail": "\"Unlock the power of X\", \"X made simple\", \"The future of X is here\", \"Supercharge your X\".",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "TX-10",
    "title": "Exclamation inflation",
    "detail": "More than one exclamation mark per screen or per 300 words.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "TX-11",
    "title": "Title Case Every Heading",
    "detail": "Applied by default rather than by the product's style guide.",
    "level": "warn",
    "check": "heuristic"
  },
  {
    "id": "TX-12",
    "title": "Hedge stack",
    "detail": "\"might potentially\", \"could possibly\", \"it's worth noting that\", \"it's important to note that\".",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "TX-13",
    "title": "Whether you're X or Y",
    "detail": "\"Whether you're a beginner or a pro\", used as an audience opener.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "TX-14",
    "title": "Bold sprinkled through paragraphs",
    "detail": "Bold on phrases in most paragraphs, so nothing stands out.",
    "level": "warn",
    "check": "heuristic"
  },
  {
    "id": "TX-15",
    "title": "Bullets for prose",
    "detail": "Ideas that need a sentence chopped into one-line bullets with a bold lead-in each.",
    "level": "warn",
    "check": "heuristic"
  },
  {
    "id": "TX-16",
    "title": "Trailing significance clause",
    "detail": "A sentence that ends in \"-ing\" commentary: \", highlighting its importance\", \", underscoring the need for\", \", reflecting a broader shift\".",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "TX-17",
    "title": "Inflated importance",
    "detail": "\"stands as a testament to\", \"plays a pivotal role\", \"marks a significant milestone\", \"leaves a lasting legacy\" for ordinary things.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "TX-18",
    "title": "Nameless authority",
    "detail": "\"Experts say\", \"Many believe\", \"Studies show\", \"Industry leaders agree\" with no named source.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "TX-19",
    "title": "False range",
    "detail": "\"From startups to enterprises\", \"from design to deployment\" where the two ends share no real scale.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "TX-20",
    "title": "Staccato negatives",
    "detail": "\"No fluff. No jargon. Just results.\" Fragments that define a thing by what it lacks.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "TX-21",
    "title": "Rhetorical setup",
    "detail": "\"The result?\", \"Here's the thing:\", \"The catch?\", \"Spoiler:\" used to fake suspense before an ordinary point.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "TX-22",
    "title": "Synonym cycling",
    "detail": "The same subject renamed every sentence (\"the tool\", \"the platform\", \"the solution\", \"this powerhouse\") to avoid repeating a word.",
    "level": "warn",
    "check": "heuristic"
  },
  {
    "id": "TX-23",
    "title": "Assistant residue",
    "detail": "\"Certainly! Here's\", \"Great question\", \"As an AI language model\", \"I hope this helps\", knowledge-cutoff disclaimers, left in shipped text.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "TX-24",
    "title": "Template slots left open",
    "detail": "\"[Your Name]\", \"[Insert link]\", \"{company}\", \"2025-xx-xx\" in published copy.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "TX-25",
    "title": "Boilerplate outlook section",
    "detail": "A \"Challenges and future prospects\" or \"Looking ahead\" section that ends on vague optimism.",
    "level": "warn",
    "check": "heuristic"
  },
  {
    "id": "ID-01",
    "title": "Pembuka basa-basi",
    "detail": "\"Di era digital saat ini\", \"Di zaman yang serba cepat\", \"Seiring perkembangan teknologi\", \"Pernahkah kamu bertanya-tanya\", \"Mari kita selami\", \"Pada artikel kali ini kita akan membahas\".",
    "level": "block",
    "check": "static"
  },
  {
    "id": "ID-02",
    "title": "\"Tidak hanya X, tetapi juga Y\" berulang",
    "detail": "Konstruksi kontras yang dipakai biar terdengar dalam.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "ID-03",
    "title": "Kosakata promosi kosong",
    "detail": "solusi terbaik, revolusioner, inovatif, terdepan, memberdayakan, mengoptimalkan secara maksimal, tingkatkan pengalaman, transformasi digital, ekosistem (tanpa makna).",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "ID-04",
    "title": "Penutup klise",
    "detail": "\"Semoga bermanfaat\", \"Kesimpulannya\", \"Dengan demikian\", \"Demikianlah artikel ini\", \"Jangan lupa share\".",
    "level": "block",
    "check": "static"
  },
  {
    "id": "ID-05",
    "title": "Terjemahan mentah",
    "detail": "Struktur kalimat bahasa Inggris yang diterjemahkan kata per kata: \"Ini adalah penting untuk\", \"di mana\" sebagai penghubung umum, \"Anda dapat\" berulang di setiap kalimat.",
    "level": "warn",
    "check": "heuristic"
  },
  {
    "id": "ID-06",
    "title": "Sapaan pemasaran",
    "detail": "\"Halo, Sobat!\", \"Yuk, simak!\", \"Kuy\", dipakai di dokumentasi atau UI produk.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "ID-07",
    "title": "Campuran register",
    "detail": "Formal dan santai berganti di paragraf yang sama (\"Anda\" lalu \"kamu\", \"tidak\" lalu \"gak\") tanpa alasan.",
    "level": "warn",
    "check": "heuristic"
  },
  {
    "id": "ID-08",
    "title": "CTA umum",
    "detail": "\"Mulai Sekarang\", \"Selengkapnya\", \"Klik di sini\", \"Pelajari Lebih Lanjut\" di tempat yang bisa menjelaskan aksinya.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "ID-09",
    "title": "Tanda seru berlebihan",
    "detail": "Lebih dari satu tanda seru per layar atau per 300 kata.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "ID-10",
    "title": "Klausa makna di ujung kalimat",
    "detail": "\", yang menunjukkan pentingnya\", \", menegaskan komitmen\", \", mencerminkan perubahan besar\" sebagai tempelan.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "ID-11",
    "title": "Pengagungan berlebihan",
    "detail": "\"menjadi bukti nyata\", \"memainkan peran penting\", \"tonggak sejarah\", \"warisan abadi\" untuk hal biasa.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "ID-12",
    "title": "Otoritas tanpa nama",
    "detail": "\"Para ahli mengatakan\", \"Banyak yang percaya\", \"Studi menunjukkan\" tanpa sumber yang disebut.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "ID-13",
    "title": "Sisa obrolan chatbot",
    "detail": "\"Tentu! Berikut\", \"Pertanyaan bagus\", \"Sebagai model bahasa AI\", \"Semoga membantu\" yang ikut terbit.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "ID-14",
    "title": "Rentang palsu",
    "detail": "\"Mulai dari UMKM hingga korporasi\", \"dari hulu ke hilir\" padahal ujungnya gak satu skala.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "CD-01",
    "title": "Comment that narrates the code",
    "detail": "`// increment counter` above `count++`, `// return the result` above `return result`.",
    "level": "block",
    "check": "heuristic"
  },
  {
    "id": "CD-02",
    "title": "Section banners",
    "detail": "`// ===== HELPERS =====`, `/* ---- State ---- */` in short files.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "CD-03",
    "title": "Emoji in code, logs or CLI output",
    "detail": "`console.log('🚀 Server started')`, `✅ Done!` in logs.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "CD-04",
    "title": "Debug leftovers",
    "detail": "`console.log`, `print`, `debugger`, commented-out blocks shipped.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "CD-05",
    "title": "Placeholder implementation",
    "detail": "`// TODO: implement`, `throw new Error('Not implemented')`, `pass  # implement later`, functions returning mock data in shipped paths.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "CD-06",
    "title": "Swallowed errors",
    "detail": "Empty `catch {}`, `catch (e) { console.error(e) }` that continues as if nothing happened.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "CD-07",
    "title": "Escape-hatch types",
    "detail": "`any`, `as unknown as`, `@ts-ignore`, `# type: ignore` added to make errors go away.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "CD-08",
    "title": "Docstring that repeats the signature",
    "detail": "\"Gets the user. Args: user_id: the user id. Returns: the user.\"",
    "level": "block",
    "check": "heuristic"
  },
  {
    "id": "CD-09",
    "title": "Defensive noise",
    "detail": "Null checks for values the type system already guarantees, `try` around code that cannot throw.",
    "level": "warn",
    "check": "review"
  },
  {
    "id": "CD-10",
    "title": "One-use abstraction",
    "detail": "A factory, wrapper, hook or helper file called exactly once, added \"for flexibility\".",
    "level": "warn",
    "check": "heuristic"
  },
  {
    "id": "CD-11",
    "title": "Generic names",
    "detail": "`data`, `result`, `item`, `temp`, `handleClick2`, `utils2.ts`, `helpers/index.ts` as a dumping ground.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "CD-12",
    "title": "Deprecated API by habit",
    "detail": "Old patterns from training data used where the project's version has a replacement (for example legacy lifecycle APIs, renamed utility classes, removed flags).",
    "level": "block",
    "check": "review"
  },
  {
    "id": "CD-13",
    "title": "New dependency for a one-liner",
    "detail": "A package added for something the platform or standard library already does.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "CD-14",
    "title": "Patch scripts instead of source changes",
    "detail": "Scripts that rewrite built files or source text by string replacement at runtime.",
    "level": "block",
    "check": "review"
  },
  {
    "id": "CD-15",
    "title": "Curly quotes in code",
    "detail": "“ ” ‘ ’ inside code blocks, config, commands or string literals where straight quotes are required.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "DOC-01",
    "title": "Emoji headings",
    "detail": "\"## ✨ Features\", \"## 🚀 Getting Started\", \"## 🤝 Contributing\".",
    "level": "block",
    "check": "static"
  },
  {
    "id": "DOC-02",
    "title": "Badge wall",
    "detail": "More than four shields at the top of a README.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "DOC-03",
    "title": "Feature list of adjectives",
    "detail": "\"⚡ Blazing fast\", \"🔒 Secure by default\", \"🎨 Beautiful UI\" with no detail behind them.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "DOC-04",
    "title": "Table of contents for a short page",
    "detail": "A TOC on a README under 400 words.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "DOC-05",
    "title": "Boilerplate sections",
    "detail": "Empty \"Roadmap\", \"Acknowledgements\", \"Star history\", \"Built with ❤️\" added because templates have them.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "DOC-06",
    "title": "Install steps that were never run",
    "detail": "Commands copied from another project, wrong package names, missing env setup.",
    "level": "block",
    "check": "review"
  },
  {
    "id": "GIT-01",
    "title": "Emoji or hype in commit messages",
    "detail": "\"✨ feat: add amazing new feature\", \"🚀 Massive improvements\".",
    "level": "block",
    "check": "static"
  },
  {
    "id": "GIT-02",
    "title": "Commit body that narrates the diff",
    "detail": "\"This commit updates the file X to change Y\" restating what the diff already shows.",
    "level": "warn",
    "check": "heuristic"
  },
  {
    "id": "GIT-03",
    "title": "PR description template filled with nothing",
    "detail": "\"This PR introduces comprehensive improvements to enhance…\" with no what, why or how-tested.",
    "level": "block",
    "check": "heuristic"
  },
  {
    "id": "GIT-04",
    "title": "Unrelated changes bundled",
    "detail": "Formatting churn, renames and the actual fix in one commit.",
    "level": "warn",
    "check": "review"
  },
  {
    "id": "TR-01",
    "title": "Invented numbers",
    "detail": "\"10,000+ users\", \"99.9% uptime\", \"3x faster\" without a source the team can show. The `antislopdev-allow` reason must name the source.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "TR-02",
    "title": "Invented testimonials",
    "detail": "Quotes, names, job titles or avatars that belong to no real person.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "TR-03",
    "title": "Placeholder people and companies shipped",
    "detail": "John Doe, Jane Smith, Acme Inc., lorem ipsum, example@example.com in production copy.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "TR-04",
    "title": "Compliance and security claims",
    "detail": "\"SOC 2 compliant\", \"bank-grade encryption\", \"GDPR ready\" without evidence. The `antislopdev-allow` reason must point to it.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "TR-05",
    "title": "Performance claims nobody measured",
    "detail": "\"Lightning fast\", \"loads instantly\", benchmark charts without a method.",
    "level": "justify",
    "check": "heuristic"
  },
  {
    "id": "TR-06",
    "title": "Fake activity",
    "detail": "\"Sarah from Berlin just signed up\" toasts, fake counters, fake scarcity timers.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "TR-07",
    "title": "Links nobody opened",
    "detail": "URLs that return errors, point to the wrong page, or were invented. The checker can test them with `--links`.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "TR-08",
    "title": "Chat interface residue",
    "detail": "`oaicite`, `contentReference`, `turn0search`, `utm_source=chatgpt.com` and similar markers copied out of a chat window.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "AX-01",
    "title": "Div as button",
    "detail": "Clickable `div` or `span` without a native element, role and keyboard support.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "AX-02",
    "title": "Focus removed",
    "detail": "`outline: none` or `focus:outline-none` without a visible replacement.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "AX-03",
    "title": "Low contrast text",
    "detail": "Body text below 4.5:1, large text below 3:1, including placeholder and disabled text that carries meaning.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "AX-04",
    "title": "Missing names",
    "detail": "Icon-only buttons without an accessible name, images without `alt`, inputs without labels.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "AX-05",
    "title": "Motion without a way out",
    "detail": "Animation that ignores `prefers-reduced-motion`.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "AX-06",
    "title": "Heading soup",
    "detail": "Skipped heading levels or headings chosen for size.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "AX-07",
    "title": "Tiny tap targets",
    "detail": "Interactive elements smaller than 24 by 24 CSS pixels with no spacing to compensate.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "PF-01",
    "title": "Media without dimensions",
    "detail": "Images, video and iframes without width and height or an aspect ratio.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "PF-02",
    "title": "Lazy hero",
    "detail": "The largest above-the-fold image loaded lazily or without priority.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "PF-03",
    "title": "Render-blocking scripts in head",
    "detail": "Third-party scripts without `async` or `defer`.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "PF-04",
    "title": "Animation library for one fade",
    "detail": "A large motion library imported for effects CSS can do.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "PF-05",
    "title": "Autoplay video above the fold",
    "detail": "Heavy video in the hero without a poster and a reason.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "PF-06",
    "title": "Animating layout",
    "detail": "Transitions on `width`, `height`, `top`, `left`, `margin` or `padding` where `transform` and `opacity` would do.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "SEO-01",
    "title": "Page without a title or description",
    "detail": "A document head with no `<title>` or no `<meta name=\"description\">`. In a framework, a route that ships without metadata.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "SEO-02",
    "title": "Title or description that gets cut",
    "detail": "A `<title>` over 60 characters or a meta description over 160, so the search result ends in an ellipsis.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "SEO-03",
    "title": "No canonical URL",
    "detail": "A page head without `<link rel=\"canonical\">`, so copies with tracking parameters or trailing slashes split the ranking.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "SEO-04",
    "title": "More than one h1",
    "detail": "Several `h1` elements on one page, or none at all, so neither readers nor crawlers know what the page is about.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "SEO-05",
    "title": "Document without a language",
    "detail": "`<html>` with no `lang`, which hurts search, translation, hyphenation and screen readers.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "SEO-06",
    "title": "Link preview left to chance",
    "detail": "No `og:title`, `og:description`, `og:image` or `twitter:card`, so a shared link shows a bare URL or a random image.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "SEO-07",
    "title": "Relative og:image",
    "detail": "`og:image` or `twitter:image` pointing at a relative path. Crawlers need an absolute URL, ideally 1200 px wide.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "SEO-08",
    "title": "Broken structured data",
    "detail": "A JSON-LD block that is not valid JSON, has no `@context`, or has items without `@type`. Rich results silently disappear.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "SEO-09",
    "title": "Structured data for things that are not on the page",
    "detail": "FAQ, Review, Rating, Product or Event markup describing questions, stars, prices or dates the visitor cannot see. Search engines treat it as spam.",
    "level": "block",
    "check": "review"
  },
  {
    "id": "SEO-10",
    "title": "Noindex left in",
    "detail": "`<meta name=\"robots\" content=\"noindex\">`, `robots: { index: false }` or an `X-Robots-Tag: noindex` on a page that is supposed to rank.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "SEO-11",
    "title": "Photos as PNG or JPEG",
    "detail": "Photographs and realistic renders served as `.png` or `.jpg` when WebP or AVIF would be a fraction of the size. Screenshots of an interface may stay PNG.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "SEO-12",
    "title": "Vector art as a bitmap",
    "detail": "Logos, icons, wordmarks and diagrams shipped as PNG, JPEG or WebP instead of SVG, so they blur on sharp screens and weigh more.",
    "level": "warn",
    "check": "heuristic"
  },
  {
    "id": "SEO-13",
    "title": "No ICO favicon",
    "detail": "Only PNG or SVG favicons, with no `.ico` for crawlers, search results and older clients that still ask for `/favicon.ico`.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "SEO-14",
    "title": "Links crawlers cannot follow",
    "detail": "`<a>` without an `href`, `href=\"#\"` or `javascript:` links, and navigation done only with a click handler.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "SEO-15",
    "title": "Answer buried under the question",
    "detail": "A heading phrased as a question whose first sentence does not answer it. Answer engines and featured snippets quote the first sentence.",
    "level": "warn",
    "check": "review"
  },
  {
    "id": "SEO-16",
    "title": "Facts without a date or a source",
    "detail": "Prices, versions, rankings and statistics with no \"as of\" date and no link to where they came from. Generative engines cite content they can attribute.",
    "level": "justify",
    "check": "review"
  },
  {
    "id": "SEO-17",
    "title": "Content that only exists after JavaScript",
    "detail": "Main text, links or metadata injected on the client, so crawlers and AI bots that do not run scripts see an empty page.",
    "level": "justify",
    "check": "review"
  },
  {
    "id": "SEO-18",
    "title": "Translations that do not point at each other",
    "detail": "Language versions without `hreflang` links to every version and an `x-default`.",
    "level": "justify",
    "check": "review"
  },
  {
    "id": "SEO-19",
    "title": "Camera file names and alt that repeats them",
    "detail": "`IMG_2041.jpg`, `image-1.png`, `Screenshot.png`, or alt text that is just the file name.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "SEO-20",
    "title": "Small previews only",
    "detail": "A robots meta without `max-image-preview:large`, so Discover and rich results can only show a thumbnail.",
    "level": "warn",
    "check": "static"
  },
  {
    "id": "SEC-01",
    "title": "Secret in the source",
    "detail": "API keys, tokens, private keys or passwords written into code, config or docs (`sk-…`, `ghp_…`, `AKIA…`, `-----BEGIN PRIVATE KEY-----`). Rotate the key, then move it to the environment.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "SEC-02",
    "title": "Env file in the tree",
    "detail": "A `.env` or `.env.local` that is not ignored by git. Only `.env.example` with empty values belongs in the repo.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "SEC-03",
    "title": "Server secret exposed to the browser",
    "detail": "A secret, private key, password or database URL behind a public prefix (`NEXT_PUBLIC_`, `VITE_`, `PUBLIC_`, `EXPO_PUBLIC_`, `REACT_APP_`), which bundles it into client code.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "SEC-04",
    "title": "eval and friends",
    "detail": "`eval`, `new Function`, or `setTimeout` and `setInterval` given a string.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "SEC-05",
    "title": "Raw HTML from a variable",
    "detail": "`dangerouslySetInnerHTML`, `v-html`, `{@html}`, `innerHTML` or `insertAdjacentHTML` fed with anything that was not sanitised.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "SEC-06",
    "title": "SQL built from strings",
    "detail": "Queries assembled with `${}` or `+` around values instead of parameters or a tagged `sql` template.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "SEC-07",
    "title": "Shell command built from input",
    "detail": "`exec` or `execSync` with an interpolated or concatenated string. Use `execFile` or `spawn` with an argument array.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "SEC-08",
    "title": "TLS checks turned off",
    "detail": "`rejectUnauthorized: false`, `NODE_TLS_REJECT_UNAUTHORIZED=0`, `verify=False`, `InsecureSkipVerify: true`.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "SEC-09",
    "title": "Plain http for resources",
    "detail": "Scripts, styles, images, iframes or API calls over `http://`, outside local hosts.",
    "level": "block",
    "check": "static"
  },
  {
    "id": "SEC-10",
    "title": "CORS open to everyone",
    "detail": "`Access-Control-Allow-Origin: *`, `origin: '*'` or a bare `cors()` on an API that reads cookies or tokens.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "SEC-11",
    "title": "Weak hash for secrets",
    "detail": "MD5 or SHA-1 used for passwords, tokens or signatures. Passwords need argon2, scrypt or bcrypt.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "SEC-12",
    "title": "Math.random for anything secret",
    "detail": "Tokens, session IDs, OTPs, reset codes or salts from `Math.random()` instead of `crypto.getRandomValues` or `crypto.randomUUID`.",
    "level": "block",
    "check": "heuristic"
  },
  {
    "id": "SEC-13",
    "title": "Secrets in logs",
    "detail": "Logging passwords, tokens, cookies, authorization headers or whole request bodies.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "SEC-14",
    "title": "Open redirect",
    "detail": "Redirecting to a URL taken straight from the query string or body without checking that it stays on your own host.",
    "level": "block",
    "check": "heuristic"
  },
  {
    "id": "SEC-15",
    "title": "Floating dependency versions",
    "detail": "`\"*\"`, `\"latest\"` or a git branch as a version in `package.json`, so a compromised release lands on the next install.",
    "level": "justify",
    "check": "static"
  },
  {
    "id": "SEC-16",
    "title": "Authorisation only in the browser",
    "detail": "Hiding a button or a route on the client while the API route or server action behind it does not check the session and the role.",
    "level": "block",
    "check": "review"
  },
  {
    "id": "SEC-17",
    "title": "Input trusted without validation",
    "detail": "API routes, server actions and webhooks that use the body without a schema, or accept webhooks without verifying the signature.",
    "level": "block",
    "check": "review"
  },
  {
    "id": "SEC-18",
    "title": "No rate limit on sensitive routes",
    "detail": "Login, sign-up, password reset, OTP and paid API proxies with no limit per IP or per account.",
    "level": "justify",
    "check": "review"
  },
  {
    "id": "SEC-19",
    "title": "Missing security headers",
    "detail": "No Content-Security-Policy, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy` or `frame-ancestors`.",
    "level": "justify",
    "check": "review"
  },
  {
    "id": "SEC-20",
    "title": "Auth cookie without flags",
    "detail": "Session, token or JWT cookies set without `httpOnly` (and `secure`, `sameSite`), or written from client code with `document.cookie`.",
    "level": "block",
    "check": "heuristic"
  },
  {
    "id": "SEC-21",
    "title": "Stack traces sent to users",
    "detail": "Error stacks or internal details returned in API responses or rendered on error pages.",
    "level": "justify",
    "check": "static"
  }
]
