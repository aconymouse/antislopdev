# CD: code

Levels: `block` is never acceptable in shipped work, `justify` passes only with a one-line reason next to it (`antislopdev-allow <ID>: reason`), `warn` is a smell and three in one file count as `justify`. Check `static` and `heuristic` rules are found by `npx antislopdev check`; `review` rules need a look at the rendered result.

These rules name defaults to avoid, not a style to adopt. Anything here is fine when someone chose it on purpose.

| ID | Rule | Level | Check |
|---|---|---|---|
| CD-01 | **Comment that narrates the code.** `// increment counter` above `count++`, `// return the result` above `return result`. | block | heuristic |
| CD-02 | **Section banners.** `// ===== HELPERS =====`, `/* ---- State ---- */` in short files. | warn | static |
| CD-03 | **Emoji in code, logs or CLI output.** `console.log('🚀 Server started')`, `✅ Done!` in logs. | block | static |
| CD-04 | **Debug leftovers.** `console.log`, `print`, `debugger`, commented-out blocks shipped. | block | static |
| CD-05 | **Placeholder implementation.** `// TODO: implement`, `throw new Error('Not implemented')`, `pass  # implement later`, functions returning mock data in shipped paths. | block | static |
| CD-06 | **Swallowed errors.** Empty `catch {}`, `catch (e) { console.error(e) }` that continues as if nothing happened. | justify | static |
| CD-07 | **Escape-hatch types.** `any`, `as unknown as`, `@ts-ignore`, `# type: ignore` added to make errors go away. | justify | static |
| CD-08 | **Docstring that repeats the signature.** "Gets the user. Args: user_id: the user id. Returns: the user." | block | heuristic |
| CD-09 | **Defensive noise.** Null checks for values the type system already guarantees, `try` around code that cannot throw. | warn | review |
| CD-10 | **One-use abstraction.** A factory, wrapper, hook or helper file called exactly once, added "for flexibility". | warn | heuristic |
| CD-11 | **Generic names.** `data`, `result`, `item`, `temp`, `handleClick2`, `utils2.ts`, `helpers/index.ts` as a dumping ground. | warn | static |
| CD-12 | **Deprecated API by habit.** Old patterns from training data used where the project's version has a replacement (for example legacy lifecycle APIs, renamed utility classes, removed flags). | block | review |
| CD-13 | **New dependency for a one-liner.** A package added for something the platform or standard library already does. | justify | static |
| CD-14 | **Patch scripts instead of source changes.** Scripts that rewrite built files or source text by string replacement at runtime. | block | review |
| CD-15 | **Curly quotes in code.** “ ” ‘ ’ inside code blocks, config, commands or string literals where straight quotes are required. | block | static |
