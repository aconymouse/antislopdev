# PF: performance

Levels: `block` is never acceptable in shipped work, `justify` passes only with a one-line reason next to it (`antislopdev-allow <ID>: reason`), `warn` is a smell and three in one file count as `justify`. Check `static` and `heuristic` rules are found by `npx antislopdev check`; `review` rules need a look at the rendered result.

These rules name defaults to avoid, not a style to adopt. Anything here is fine when someone chose it on purpose.

| ID | Rule | Level | Check |
|---|---|---|---|
| PF-01 | **Media without dimensions.** Images, video and iframes without width and height or an aspect ratio. | block | static |
| PF-02 | **Lazy hero.** The largest above-the-fold image loaded lazily or without priority. | block | static |
| PF-03 | **Render-blocking scripts in head.** Third-party scripts without `async` or `defer`. | block | static |
| PF-04 | **Animation library for one fade.** A large motion library imported for effects CSS can do. | warn | static |
| PF-05 | **Autoplay video above the fold.** Heavy video in the hero without a poster and a reason. | justify | static |
| PF-06 | **Animating layout.** Transitions on `width`, `height`, `top`, `left`, `margin` or `padding` where `transform` and `opacity` would do. | warn | static |
