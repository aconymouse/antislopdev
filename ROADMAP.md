# Roadmap

Last updated 31 October 2026, at version 0.1.0.

antiSlopdev started as a rule list an agent reads. Where it goes next is enforcement: the same rules running wherever code gets written and reviewed, without anyone having to remember to run them. Plugins for more editors matter too, but they come after the checker can sit in a pipeline and say no.

This page lists intent, not promises. Dates are left out on purpose; an item moves to Now when someone is working on it.

## Now

| Item | Why |
|---|---|
| GitHub Action (`uses: aconymouse/antislopdev@v0`) | One line in a workflow instead of a hand-written `npx` step, with a summary table on the run page. |
| SARIF output (`--format sarif`) | Findings show up in the repository's Security tab and as annotations on the exact lines of a pull request. |
| `antislopdev init` | Writes `antislopdev.json`, a commit-msg hook and the CI step in one go, so setup takes a minute. |

## Next

| Item | Why |
|---|---|
| MCP server | Agents call the checker as a tool mid-task and get findings back as data, instead of only reading the rules up front. |
| Rule files for Cursor, Windsurf and Cline | The rules in each editor's own format, generated from `RULES.md` so they never drift. |
| Codex and Gemini CLI packaging | Same skill, installable the way those tools expect. |
| Presets | `strict`, `copy-only` and `docs-only` starting points instead of a long `disable` list. |
| A page per rule | `antislopdev.aconymous.com/rules/UI-01/` with a failing and a passing example, so a finding can link straight to its explanation. |

## Later

| Item | Why |
|---|---|
| `--fix` for safe rules | Some findings have one correct rewrite (an em dash, a stray `console.log`, a missing `rel`). Those can be fixed by the machine; anything that needs taste stays a finding. |
| Rendered-page checks | A headless pass over a built site for the `review` rules that need a browser: phone width, empty states, dark mode. |
| More copy languages | Rule groups like `ID` for other languages, written by native speakers. |

## Shaping this list

Propose or argue for an item in [Rule proposals](https://github.com/aconymouse/antislopdev/discussions/categories/rule-proposals). Once something is agreed, it gets an issue and a place on this page.
