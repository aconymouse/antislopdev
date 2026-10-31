# SEO: search, answer engines and sharing

Levels: `block` is never acceptable in shipped work, `justify` passes only with a one-line reason next to it (`antislopdev-allow <ID>: reason`), `warn` is a smell and three in one file count as `justify`. Check `static` and `heuristic` rules are found by `npx antislopdev check`; `review` rules need a look at the rendered result.

These rules name defaults to avoid, not a style to adopt. Anything here is fine when someone chose it on purpose.

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
