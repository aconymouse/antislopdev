# UI: interface

Levels: `block` is never acceptable in shipped work, `justify` passes only with a one-line reason next to it (`antislopdev-allow <ID>: reason`), `warn` is a smell and three in one file count as `justify`. Check `static` and `heuristic` rules are found by `npx antislopdev check`; `review` rules need a look at the rendered result.

These rules name defaults to avoid, not a style to adopt. Anything here is fine when someone chose it on purpose.

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
