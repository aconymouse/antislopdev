# DOC: README and docs

Levels: `block` is never acceptable in shipped work, `justify` passes only with a one-line reason next to it (`antislopdev-allow <ID>: reason`), `warn` is a smell and three in one file count as `justify`. Check `static` and `heuristic` rules are found by `npx antislopdev check`; `review` rules need a look at the rendered result.

These rules name defaults to avoid, not a style to adopt. Anything here is fine when someone chose it on purpose.

| ID | Rule | Level | Check |
|---|---|---|---|
| DOC-01 | **Emoji headings.** "## ✨ Features", "## 🚀 Getting Started", "## 🤝 Contributing". | block | static |
| DOC-02 | **Badge wall.** More than four shields at the top of a README. | warn | static |
| DOC-03 | **Feature list of adjectives.** "⚡ Blazing fast", "🔒 Secure by default", "🎨 Beautiful UI" with no detail behind them. | block | static |
| DOC-04 | **Table of contents for a short page.** A TOC on a README under 400 words. | warn | static |
| DOC-05 | **Boilerplate sections.** Empty "Roadmap", "Acknowledgements", "Star history", "Built with ❤️" added because templates have them. | warn | static |
| DOC-06 | **Install steps that were never run.** Commands copied from another project, wrong package names, missing env setup. | block | review |
