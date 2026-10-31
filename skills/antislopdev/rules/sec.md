# SEC: security

Levels: `block` is never acceptable in shipped work, `justify` passes only with a one-line reason next to it (`antislopdev-allow <ID>: reason`), `warn` is a smell and three in one file count as `justify`. Check `static` and `heuristic` rules are found by `npx antislopdev check`; `review` rules need a look at the rendered result.

These rules name defaults to avoid, not a style to adopt. Anything here is fine when someone chose it on purpose.

Defaults an agent ships when it is in a hurry, drawn from the OWASP Top 10 and from what code scanners such as CodeQL keep finding in generated code. The list grows as new patterns show up. A rule keeps its ID when its wording changes. To check a deployed site's TLS, headers, DNS and exposed services, run a passive scan of a domain you own with [wowHacker](https://aconymous.com/tools/wowhacker).

| ID | Rule | Level | Check |
|---|---|---|---|
| SEC-01 | **Secret in the source.** API keys, tokens, private keys or passwords written into code, config or docs (`sk-…`, `ghp_…`, `AKIA…`, `-----BEGIN PRIVATE KEY-----`). Rotate the key, then move it to the environment. | block | static |
| SEC-02 | **Env file in the tree.** A `.env` or `.env.local` that is not ignored by git. Only `.env.example` with empty values belongs in the repo. | block | static |
| SEC-03 | **Server secret exposed to the browser.** A secret, private key, password or database URL behind a public prefix (`NEXT_PUBLIC_`, `VITE_`, `PUBLIC_`, `EXPO_PUBLIC_`, `REACT_APP_`), which bundles it into client code. | block | static |
| SEC-04 | **eval and friends.** `eval`, `new Function`, or `setTimeout` and `setInterval` given a string. | block | static |
| SEC-05 | **Raw HTML from a variable.** `dangerouslySetInnerHTML`, `v-html`, `{@html}`, `innerHTML` or `insertAdjacentHTML` fed with anything that was not sanitised. | justify | static |
| SEC-06 | **SQL built from strings.** Queries assembled with `${}` or `+` around values instead of parameters or a tagged `sql` template. | block | static |
| SEC-07 | **Shell command built from input.** `exec` or `execSync` with an interpolated or concatenated string. Use `execFile` or `spawn` with an argument array. | block | static |
| SEC-08 | **TLS checks turned off.** `rejectUnauthorized: false`, `NODE_TLS_REJECT_UNAUTHORIZED=0`, `verify=False`, `InsecureSkipVerify: true`. | block | static |
| SEC-09 | **Plain http for resources.** Scripts, styles, images, iframes or API calls over `http://`, outside local hosts. | block | static |
| SEC-10 | **CORS open to everyone.** `Access-Control-Allow-Origin: *`, `origin: '*'` or a bare `cors()` on an API that reads cookies or tokens. | justify | static |
| SEC-11 | **Weak hash for secrets.** MD5 or SHA-1 used for passwords, tokens or signatures. Passwords need argon2, scrypt or bcrypt. | justify | static |
| SEC-12 | **Math.random for anything secret.** Tokens, session IDs, OTPs, reset codes or salts from `Math.random()` instead of `crypto.getRandomValues` or `crypto.randomUUID`. | block | heuristic |
| SEC-13 | **Secrets in logs.** Logging passwords, tokens, cookies, authorization headers or whole request bodies. | justify | static |
| SEC-14 | **Open redirect.** Redirecting to a URL taken straight from the query string or body without checking that it stays on your own host. | block | heuristic |
| SEC-15 | **Floating dependency versions.** `"*"`, `"latest"` or a git branch as a version in `package.json`, so a compromised release lands on the next install. | justify | static |
| SEC-16 | **Authorisation only in the browser.** Hiding a button or a route on the client while the API route or server action behind it does not check the session and the role. | block | review |
| SEC-17 | **Input trusted without validation.** API routes, server actions and webhooks that use the body without a schema, or accept webhooks without verifying the signature. | block | review |
| SEC-18 | **No rate limit on sensitive routes.** Login, sign-up, password reset, OTP and paid API proxies with no limit per IP or per account. | justify | review |
| SEC-19 | **Missing security headers.** No Content-Security-Policy, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy` or `frame-ancestors`. | justify | review |
| SEC-20 | **Auth cookie without flags.** Session, token or JWT cookies set without `httpOnly` (and `secure`, `sameSite`), or written from client code with `document.cookie`. | block | heuristic |
| SEC-21 | **Stack traces sent to users.** Error stacks or internal details returned in API responses or rendered on error pages. | justify | static |
| SEC-22 | **Regex that can hang.** A group with a quantifier inside that is itself repeated, like `(a+)+`, `(\w+\s?)*` or `(.*)*`, in a pattern that reads user input, uploaded files or request data. One crafted string can keep a single match busy for minutes. Write the pattern so each character can be matched only one way, cap the input length, or use a linear engine such as RE2. | justify | heuristic |
| SEC-23 | **HTML cleaned with a regex.** Stripping tags with `.replace(/<[^>]*>/g, '')` or `/<script.*?<\/script>/` before the result is shown or stored. Regexes miss `</script >`, tags split across lines, broken markup and comments that end in `--!>`. Use DOMPurify or sanitize-html for HTML you render, and `textContent` or a real parser when you only need the text. | justify | static |
| SEC-24 | **Escaping by hand.** `new RegExp()` built from a variable that was never escaped, or a quote, backslash or `<` escaped with `.replace('"', …)`, which only changes the first one. Use `RegExp.escape()` (Node 24 and current browsers) or a full escape helper, `replaceAll`, and the encoder that belongs to the output: `encodeURIComponent`, `JSON.stringify` or your template engine. | justify | heuristic |
| SEC-25 | **Third-party script without integrity.** A `<script>` or stylesheet from another host loaded without `integrity`, so whoever controls that CDN controls your page. Pin the version and add the hash with `crossorigin`, or serve the file yourself. Tags that change by design and publish no hash (Google tag, Stripe.js, Turnstile, Cloudflare Web Analytics) are skipped. | justify | static |
