# TR: truth

Levels: `block` is never acceptable in shipped work, `justify` passes only with a one-line reason next to it (`antislopdev-allow <ID>: reason`), `warn` is a smell and three in one file count as `justify`. Check `static` and `heuristic` rules are found by `npx antislopdev check`; `review` rules need a look at the rendered result.

These rules name defaults to avoid, not a style to adopt. Anything here is fine when someone chose it on purpose.

| ID | Rule | Level | Check |
|---|---|---|---|
| TR-01 | **Invented numbers.** "10,000+ users", "99.9% uptime", "3x faster" without a source the team can show. The `antislopdev-allow` reason must name the source. | justify | static |
| TR-02 | **Invented testimonials.** Quotes, names, job titles or avatars that belong to no real person. | block | static |
| TR-03 | **Placeholder people and companies shipped.** John Doe, Jane Smith, Acme Inc., lorem ipsum, example@example.com in production copy. | block | static |
| TR-04 | **Compliance and security claims.** "SOC 2 compliant", "bank-grade encryption", "GDPR ready" without evidence. The `antislopdev-allow` reason must point to it. | justify | static |
| TR-05 | **Performance claims nobody measured.** "Lightning fast", "loads instantly", benchmark charts without a method. | justify | heuristic |
| TR-06 | **Fake activity.** "Sarah from Berlin just signed up" toasts, fake counters, fake scarcity timers. | block | static |
| TR-07 | **Links nobody opened.** URLs that return errors, point to the wrong page, or were invented. The checker can test them with `--links`. | block | static |
| TR-08 | **Chat interface residue.** `oaicite`, `contentReference`, `turn0search`, `utm_source=chatgpt.com` and similar markers copied out of a chat window. | block | static |
