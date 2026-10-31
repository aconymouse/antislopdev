# GIT: commits and pull requests

Levels: `block` is never acceptable in shipped work, `justify` passes only with a one-line reason next to it (`antislopdev-allow <ID>: reason`), `warn` is a smell and three in one file count as `justify`. Check `static` and `heuristic` rules are found by `npx antislopdev check`; `review` rules need a look at the rendered result.

These rules name defaults to avoid, not a style to adopt. Anything here is fine when someone chose it on purpose.

| ID | Rule | Level | Check |
|---|---|---|---|
| GIT-01 | **Emoji or hype in commit messages.** "✨ feat: add amazing new feature", "🚀 Massive improvements". | block | static |
| GIT-02 | **Commit body that narrates the diff.** "This commit updates the file X to change Y" restating what the diff already shows. | warn | heuristic |
| GIT-03 | **PR description template filled with nothing.** "This PR introduces comprehensive improvements to enhance…" with no what, why or how-tested. | block | heuristic |
| GIT-04 | **Unrelated changes bundled.** Formatting churn, renames and the actual fix in one commit. | warn | review |
