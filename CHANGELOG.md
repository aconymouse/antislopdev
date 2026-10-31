# Changelog

Each release lists what changed for someone using the rules or the checker. Versions follow semver: a new rule or check is a minor release, a changed level or a check that flags more is called out under Changed.

## 0.2.0 · 31 October 2026

### Rules

- Four security rules taken from what CodeQL found in this repository: SEC-22 regex that can hang, SEC-23 HTML cleaned with a regex, SEC-24 escaping by hand and SEC-25 third-party script without integrity. That makes 167 rules, 141 of them checked by the CLI.

### Checker

- A crafted file can no longer stall a run. The parsers for markup, Markdown code fences, CSS, JSX text, comments, `<script>` and `<style>` blocks, allow comments and links were rewritten so the time grows in line with the file size. A 60 KB file of `[` took 8.9 seconds and now takes under 50 ms; 60 KB of CSS without a brace went from 13 seconds to 14 ms. A test keeps it that way.
- `</script >`, `</SCRIPT>` and HTML comments that end in `--!>` are recognised.
- Long lines with many findings no longer slow the report down.
- `--json` output is no longer cut off when it is piped into another program.
- Findings on every other rule are unchanged, checked against six real projects before release.

### Releases

- Published from GitHub Actions through npm trusted publishing, with provenance. Each version is staged first and goes live only after a maintainer approves it with two-factor authentication.

## 0.1.0 · 31 October 2026

First public release.

### Rules

- 163 rules in eleven groups: UI, English copy (TX), Indonesian copy (ID), code (CD), docs (DOC), commits (GIT), truth (TR), accessibility (AX), performance (PF), SEO and security (SEC).
- 137 of them checked by the CLI, the rest marked `review` for a person or an agent to check by eye.
- Three levels: `block` fails the run, `justify` passes only with a written reason, `warn` is reported and turns into `justify` after three hits of the same rule in one file.

### Checker

- `npx antislopdev check [paths]` with `--json`, `--links`, `--commit`, `--only`, `--disable` and `--quiet`.
- `antislopdev rules` and `antislopdev explain <ID>`.
- Reads TSX, JSX, HTML, Vue, Svelte, Astro, CSS, JavaScript, TypeScript, Python and other code, Markdown, `package.json`, translation files, `.env` files and commit messages.
- Keep a deliberate choice with `antislopdev-allow <ID>: reason` on the line above, or `antislopdev-allow-file` for a whole file.
- No runtime dependencies. The engine runs in Node and in the browser.

### Agent skill

- Installable with `npx skills add aconymouse/antislopdev` or as a Claude Code plugin.
- Asks the agent to run the checker before saying it is done and to end with a delivery note.
