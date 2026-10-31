# antiSlopdev

[![npm](https://img.shields.io/npm/v/antislopdev)](https://www.npmjs.com/package/antislopdev) [![ci](https://github.com/aconymouse/antislopdev/actions/workflows/ci.yml/badge.svg)](https://github.com/aconymouse/antislopdev/actions/workflows/ci.yml) [![licence](https://img.shields.io/npm/l/antislopdev)](LICENSE)

Rules and a checker that catch generic AI output in UI, copy, docs, commits and code.

Slop is what gets shipped when nobody decided anything: the eyebrow label over every heading, the sparkle icon on every "smart" button, "Unlock the power of", a hero with three cards, a README full of rockets. antiSlopdev names 167 of those defaults, from interface and copy to SEO and security, gives each one a stable ID, and checks 141 of them automatically.

It is not a style guide. Gradients, dark themes, monospace and motion are fine when someone chose them. The rules only ask that the choice was made.

Site: https://antislopdev.aconymous.com

## For your agent

skills.sh (Claude Code, Cursor, Codex and other agents that read Agent Skills):

```bash
npx skills add aconymouse/antislopdev
```

Claude Code plugin:

```
/plugin marketplace add aconymouse/antislopdev
/plugin install antislopdev@antislopdev
```

Anything else: give your agent [`skills/antislopdev/SKILL.md`](skills/antislopdev/SKILL.md) and [`RULES.md`](RULES.md).

## The checker

```bash
npx antislopdev check src
```

```
src/app/page.tsx
  14:9     justify  UI-11  Gradient text on headings · bg-clip-text text-transparent
  26:9     block    UI-05  Emoji used as icons · "🚀 Why choose us"
  43:14    warn     TX-02  "Not just X, but Y" · "It's not just a tool, it's"

✗ 1 block · 1 justify · 1 warn · 1 file
```

Every rule has a level:

- `block` fails the run.
- `justify` fails unless a reason sits on the same line or the line above: `antislopdev-allow UI-11: the wordmark gradient is the brand`. Use `antislopdev-allow-file` for a whole file.
- `warn` is reported but never fails on its own. Three warns of the same rule in one file count as `justify`. A warn can carry the same reason comment when it is deliberate.

Options:

| Flag | |
|---|---|
| `--json` | machine-readable report |
| `--links` | open every external link and report dead ones |
| `--commit <file>` | check a commit or PR message |
| `--only UI,TX-04` | run only these rules or groups |
| `--disable CD-11` | skip rules |
| `--quiet` | hide warns |

`antislopdev rules` lists every rule. `antislopdev explain UI-01` shows one.

Config lives in `antislopdev.json`:

```json
{ "ignore": ["docs/legacy"], "disable": ["CD-11"] }
```

It reads `.tsx`, `.jsx`, `.html`, `.vue`, `.svelte`, `.astro`, `.css`, `.js`, `.ts`, `.py` and friends, Markdown, `package.json`, and translation files under `messages/`, `locales/` or `i18n/`. Copy is checked in English and Indonesian.

### In CI

```yaml
- run: npx antislopdev@latest check .
```

### On every commit message

`.git/hooks/commit-msg`:

```bash
#!/bin/sh
npx antislopdev check --commit "$1"
```

### From code

```js
import { check } from 'antislopdev'

const report = check([{ path: 'hero.tsx', text: source }])
```

The same engine runs in the browser playground on the site.

## What it covers

| Group | Rules | |
|---|---|---|
| UI | 37 | layout, icons, colour, motion, fake controls |
| TX | 25 | English copy |
| ID | 14 | Indonesian copy |
| CD | 15 | code |
| DOC | 6 | READMEs and docs |
| GIT | 4 | commits and pull requests |
| TR | 8 | invented numbers, people and claims |
| AX | 7 | accessibility |
| PF | 6 | performance |
| SEO | 20 | titles, canonical, Open Graph, structured data, image formats, answer-first writing |
| SEC | 25 | secrets, injection, TLS, CORS, cookies, redirects, dependencies, regex backtracking, CDN integrity |

To audit a live page against the SEO group, try [sarangSEO](https://aconymous.com/tools/sarangseo). For a passive security scan of a domain you own, try [wowHacker](https://aconymous.com/tools/wowhacker).

## Contributing

False positives are the most useful report: open one with the smallest snippet that triggers the rule. New rules start in [Rule proposals](https://github.com/aconymouse/antislopdev/discussions/categories/rule-proposals). How a rule goes from idea to check is in [CONTRIBUTING.md](CONTRIBUTING.md), and what is planned next is in [ROADMAP.md](ROADMAP.md). Changes per release are in [CHANGELOG.md](CHANGELOG.md).

## Prior art

Many writing rules build on Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), maintained by WikiProject AI Cleanup. The rules here are written from scratch.

## Licence

MIT
