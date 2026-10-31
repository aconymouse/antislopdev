# Contributing

antiSlopdev is a list of named habits plus a checker that finds them. Most useful contributions touch one of the two: a habit that has no rule yet, or a check that misses something or flags something it should not.

## Before you open anything

- A rule flagged your code and you think it was wrong: open a [false positive](https://github.com/aconymouse/antislopdev/issues/new?template=false-positive.yml) with the smallest snippet that triggers it.
- You keep seeing a habit no rule covers: start in [Rule proposals](https://github.com/aconymouse/antislopdev/discussions/categories/rule-proposals). A rule needs a name, a level and at least one real example before it becomes an issue.
- Something is broken (the CLI crashes, the skill does not load, the site misbehaves): open a [bug](https://github.com/aconymouse/antislopdev/issues/new?template=bug.yml).

For anything bigger than a small fix, agree on the shape in an issue or discussion first, so nobody spends an evening on a pull request that goes nowhere.

## Setting up

Node.js 20 or newer.

```bash
git clone https://github.com/aconymouse/antislopdev
cd antislopdev
npm ci
npm test
npm run site
```

`npm test` builds the engine and runs the test suite. `npm run site` builds the landing page into `site/dist`.

## How a rule is made

1. Add a row to `RULES.md` in the right group: ID, a short bold title ending in a full stop, one or two sentences of detail, a level (`block`, `justify` or `warn`) and a check (`static`, `heuristic` or `review`). IDs are never reused. A retired rule keeps its number and says so.
2. Run `npm run catalog`. It regenerates `src/core/catalog.ts` and splits `RULES.md` into one file per group under `skills/antislopdev/rules/`, which is what the skill reads.
3. If the check is `static` or `heuristic`, add it to the matching file in `src/core/rules/`. A check returns hits with an index into the source and a short note that quotes what matched.
4. Prove it both ways in `test/engine.test.mjs`: one input the rule must catch, and one close lookalike it must leave alone. False positives cost more trust than misses.
5. Run `npm test`, then `node dist/cli/index.js check .` on the repository itself.

Pick the level by asking what a careful reviewer would do. `block` is for things that are never acceptable in shipped work. `justify` is for defaults that are sometimes right and need a written reason. `warn` is a smell.

## Changing the site

The site lives in `site/` and is checked by its own rules. After changing anything a visitor can read, run `npm run site` and commit `site/lastmod.json` along with your change, so the sitemap's dates stay honest.

## Pull requests

- Keep each pull request about one thing.
- Commit messages are short, lower case and in plain English, like `stop flagging md5 in etag helpers`.
- CI runs the type check, the tests, the site build and the checker on the repository. All four have to pass.

By contributing you agree that your work is released under the [MIT licence](LICENSE).
