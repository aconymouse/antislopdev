# AX: accessibility

Levels: `block` is never acceptable in shipped work, `justify` passes only with a one-line reason next to it (`antislopdev-allow <ID>: reason`), `warn` is a smell and three in one file count as `justify`. Check `static` and `heuristic` rules are found by `npx antislopdev check`; `review` rules need a look at the rendered result.

These rules name defaults to avoid, not a style to adopt. Anything here is fine when someone chose it on purpose.

| ID | Rule | Level | Check |
|---|---|---|---|
| AX-01 | **Div as button.** Clickable `div` or `span` without a native element, role and keyboard support. | block | static |
| AX-02 | **Focus removed.** `outline: none` or `focus:outline-none` without a visible replacement. | block | static |
| AX-03 | **Low contrast text.** Body text below 4.5:1, large text below 3:1, including placeholder and disabled text that carries meaning. | block | static |
| AX-04 | **Missing names.** Icon-only buttons without an accessible name, images without `alt`, inputs without labels. | block | static |
| AX-05 | **Motion without a way out.** Animation that ignores `prefers-reduced-motion`. | block | static |
| AX-06 | **Heading soup.** Skipped heading levels or headings chosen for size. | warn | static |
| AX-07 | **Tiny tap targets.** Interactive elements smaller than 24 by 24 CSS pixels with no spacing to compensate. | block | static |
