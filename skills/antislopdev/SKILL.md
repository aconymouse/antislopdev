---
name: antislopdev
description: Catch generic AI output before it ships. Use when building or reviewing UI, writing product copy (English or Indonesian), docs, READMEs, commit messages or code, and before saying any of that work is done.
---

# antiSlopdev

Slop is what gets shipped when nobody decided anything: the safe default, repeated until every product looks, reads and compiles the same. This skill gives you 167 named defaults to avoid and a checker that finds most of them for you.

The full list with IDs, levels and examples is in `RULES.md` next to this file. Read the group that matches the work before you start: `UI` for interfaces, `TX` for English copy, `ID` for Indonesian copy, `CD` for code, `DOC` for READMEs and docs, `GIT` for commits and pull requests, `TR` for claims and numbers, `AX` for accessibility, `PF` for performance, `SEO` for pages that should be found, quoted by answer engines and shared, `SEC` for anything that touches secrets, input, auth, cookies or the network.

## While you work

- Decide instead of defaulting. Before you add a badge, an icon, a gradient, a card grid or a closing summary, ask what it is for. If the only answer is "pages like this usually have one", leave it out.
- Write the thing itself. A button says what happens ("Download the PDF"), not "Learn more". A heading names the subject, not "Unlock the power of X".
- Never invent proof: no made-up user counts, testimonials, logos, compliance badges or benchmark numbers. Leave a visible gap and tell the person what is missing.
- These rules do not ask for a particular look. Rounded corners, gradients, dark themes, monospace and motion are all fine when someone chose them. The rules only ask that the choice was made.

## Before you say it is done

1. Run the checker on what you changed:

   ```bash
   npx antislopdev check <changed files or folders>
   ```

   For a commit message: `npx antislopdev check --commit .git/COMMIT_EDITMSG`. Add `--links` when the change adds external links.

2. Fix every `block` finding. They are never acceptable in shipped work.
3. For each `justify` finding, either fix it or keep it with a one-line reason right above the line, in that file's comment syntax:

   ```tsx
   {/* antislopdev-allow UI-11: the wordmark gradient is part of the brand */}
   ```

   A reason has to be a real reason. "Looks nice" is not one.
4. `warn` findings are smells. Three of the same rule in one file count as `justify`.
5. Some rules cannot be checked by a script (`antislopdev rules` marks them `review`). Look at the rendered page for those: phone width at 360 px, empty, loading and error states, dark mode, logos and people that are not real.

## Delivery note

End the handoff with a short note:

1. What you ran: build, tests, `antislopdev check`, and what you looked at in a browser.
2. Every `justify` you kept, with its reason.
3. Every `review` rule you checked by eye, one line each.

No note, not done.
