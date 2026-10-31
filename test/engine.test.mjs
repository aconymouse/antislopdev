import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { execFileSync, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { check, catalog, implemented } from '../dist/core/index.js'

const here = fileURLToPath(new URL('.', import.meta.url))
const fixtures = (dir) => readdirSync(here + 'fixtures/' + dir).map((name) => ({ path: name, text: readFileSync(`${here}fixtures/${dir}/${name}`, 'utf8') }))
const ids = (report) => new Set(report.findings.map((f) => f.rule))

test('catalog matches RULES.md and every checked rule exists', () => {
  assert.equal(catalog.length, 163)
  const known = new Set(catalog.map((r) => r.id))
  for (const id of implemented) assert.ok(known.has(id), id)
  assert.ok(implemented.length >= 100)
})

test('slop fixtures trip the rules they were written for', () => {
  const found = ids(check(fixtures('slop')))
  const expected = ['UI-01', 'UI-02', 'UI-04', 'UI-05', 'UI-06', 'UI-07', 'UI-10', 'UI-11', 'UI-12', 'UI-16', 'UI-17', 'UI-25', 'UI-28', 'UI-32', 'TX-02', 'TX-04', 'TX-05', 'TX-07', 'TX-08', 'TX-09', 'TX-12', 'TX-13', 'TX-18', 'ID-01', 'ID-02', 'ID-03', 'ID-04', 'ID-08', 'CD-01', 'CD-02', 'CD-03', 'CD-04', 'CD-05', 'CD-06', 'CD-07', 'CD-08', 'CD-11', 'CD-15', 'DOC-01', 'DOC-02', 'DOC-03', 'DOC-04', 'DOC-05', 'GIT-01', 'GIT-02', 'TR-01', 'TR-02', 'TR-03', 'TR-04', 'TR-05', 'AX-01', 'AX-02', 'AX-03', 'AX-04', 'AX-05', 'AX-06', 'AX-07', 'PF-01', 'PF-02', 'PF-03', 'PF-06']
  const missing = expected.filter((id) => !found.has(id))
  assert.deepEqual(missing, [])
})

test('clean fixtures pass with no findings at all', () => {
  const report = check(fixtures('clean'))
  assert.deepEqual(report.findings.map((f) => `${f.path}:${f.line} ${f.rule}`), [])
  assert.equal(report.failed, false)
})

test('a justify finding passes with a reason, a block finding does not', () => {
  const allowed = check([{ path: 'a.tsx', text: '// antislopdev-allow UI-11: brand wordmark uses the gradient\nexport const A = () => <h1 className="bg-clip-text text-transparent">Hi</h1>\n' }])
  assert.equal(allowed.failed, false)
  assert.equal(allowed.allowed, 1)
  const empty = check([{ path: 'a.tsx', text: '// antislopdev-allow UI-11:\nexport const A = () => <h1 className="bg-clip-text text-transparent">Hi</h1>\n' }])
  assert.equal(empty.failed, true)
  const block = check([{ path: 'a.tsx', text: '// antislopdev-allow UI-05: we like it\nexport const A = () => <h2>🚀 Launch</h2>\n' }])
  assert.equal(block.failed, true)
  const file = check([{ path: 'a.md', text: '<!-- antislopdev-allow-file TX-04: glossary of banned words -->\n\nWords like seamless, robust and delve.\n' }])
  assert.equal(file.failed, false)
})

test('three warns of one rule in one file become justify', () => {
  const r = check([{ path: 'a.md', text: 'It is seamless.\n\nIt is robust.\n\nWe delve deeper.\n' }])
  assert.equal(r.findings.filter((f) => f.rule === 'TX-04').length, 3)
  assert.ok(r.findings.every((f) => f.level === 'justify' && f.escalated))
  const two = check([{ path: 'a.md', text: 'It is seamless.\n\nIt is robust.\n' }])
  assert.ok(two.findings.every((f) => f.level === 'warn'))
  assert.equal(two.failed, false)
})

test('seo and security rules catch what they are named for', () => {
  const key = ['gh', 'p_', 'R8x2', 'Lm4q'.repeat(8)].join('')
  const sources = [
    { path: 'auth.ts', text: [
      `const github = '${key}'`,
      'const stripe = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY',
      'export const run = (code: string) => eval(code)',
      'export const html = (el: HTMLElement, v: string) => { el.innerHTML = v }',
      'export const find = (db: any, id: string) => db.query(`SELECT * FROM users WHERE id = ${id}`)',
      "export const zip = (exec: any, name: string) => exec(`zip -r ${name}.zip .`)",
      'export const agent = { rejectUnauthorized: false }',
      "export const load = () => fetch('http://api.generic.app/v1/users')",
      "export const headers = { 'Access-Control-Allow-Origin': '*' }",
      "export const weak = (c: any, p: string) => c.createHash('md5').update(p)",
      'export const resetToken = () => Math.random().toString(36).slice(2)',
      'export const trace = (password: string) => console.log(password)',
      "export const back = (res: any, req: any) => res.redirect(req.query.next)",
      "export const login = (res: any, jwt: string) => res.cookie('session', jwt)",
      'export const fail = (res: any, err: Error) => res.json({ error: err.stack })',
    ].join('\n') },
    { path: '.env.local', text: 'DATABASE_URL=postgres://u:p@db:5432/app\n' },
    { path: 'package.json', text: '{ "dependencies": { "left-pad": "latest", "ui": "*" } }\n' },
  ]
  const found = ids(check(sources))
  const expected = ['SEC-01', 'SEC-02', 'SEC-03', 'SEC-04', 'SEC-05', 'SEC-06', 'SEC-07', 'SEC-08', 'SEC-09', 'SEC-10', 'SEC-11', 'SEC-12', 'SEC-13', 'SEC-14', 'SEC-15', 'SEC-20', 'SEC-21']
  assert.deepEqual(expected.filter((id) => !found.has(id)), [])
  assert.ok(ids(check(fixtures('slop').filter((f) => f.path === 'page.html'))).has('SEO-01'))
  const seo = ids(check(fixtures('slop').filter((f) => f.path === 'seo.html')))
  const want = ['SEO-02', 'SEO-03', 'SEO-04', 'SEO-05', 'SEO-06', 'SEO-07', 'SEO-08', 'SEO-11', 'SEO-12', 'SEO-13', 'SEO-14', 'SEO-19', 'SEO-20', 'SEC-09']
  assert.deepEqual(want.filter((id) => !seo.has(id)), [])
})

test('false positives the checker must not raise', () => {
  const cases = [
    { path: 'a.tsx', text: "export const A = () => <p>Don't worry, it's fine.</p>\n// keeps the cache warm between renders because the API is slow\nconst x = 1\n" },
    { path: 'b.ts', text: "const quote = /[“”]/g\nconst apostrophe = /['’]/\nexport { quote, apostrophe }\n" },
    { path: 'c.tsx', text: 'export const F = () => <input id="email" placeholder="you@example.com" />\n' },
    { path: 'd.md', text: 'Run it from 1 to 10 times. The range goes from 0 to 255.\n\nWe sell coffee, tea and cake.\n' },
    { path: 'e.md', text: 'Studies show the effect, see [the paper](https://doi.org/10.1000/xyz).\n' },
    { path: 'f.tsx', text: '<Link href="/a"><div className="hover:-translate-y-1 rounded border p-4">Card</div></Link>\n' },
    { path: 'g.md', text: 'Mulai dari 10 ribu hingga 50 ribu per bulan.\n' },
    { path: 'i.tsx', text: 'export const Go = ({ to, children }: { to: string; children: string }) => <a href={to}>{children}<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4" /></svg></a>\n' },
    { path: 'j.ts', text: "import { sql } from 'drizzle-orm'\nexport const byId = (db: { execute(q: unknown): unknown }, id: string) => db.execute(sql`SELECT * FROM users WHERE id = ${id}`)\nexport const key = process.env.API_KEY\nexport const pick = () => crypto.randomUUID()\nexport const probe = (domain: string) => fetch(`http://${domain}`, { redirect: 'manual' })\n" },
    { path: 'k.tsx', text: 'export const Ld = ({ data }: { data: object }) => <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />\n' },
    { path: 'h.ts', text: 'export function sum(values: number[]): number {\n  return values.reduce((a, b) => a + b, 0)\n}\n' },
  ]
  for (const c of cases) {
    const r = check([c])
    assert.deepEqual(r.findings.map((f) => `${f.rule} ${f.note ?? ''}`), [], c.path)
  }
})

test('the CLI exits 1 on slop, 0 on clean, and prints JSON', () => {
  const cli = fileURLToPath(new URL('../dist/cli/index.js', import.meta.url))
  const slop = spawnSync(process.execPath, [cli, 'check', 'slop'], { cwd: here + 'fixtures', encoding: 'utf8' })
  assert.equal(slop.status, 1)
  const clean = spawnSync(process.execPath, [cli, 'check', 'clean'], { cwd: here + 'fixtures', encoding: 'utf8' })
  assert.equal(clean.status, 0)
  const json = JSON.parse(execFileSync(process.execPath, [cli, 'check', 'clean', '--json'], { cwd: here + 'fixtures', encoding: 'utf8' }))
  assert.equal(json.failed, false)
  const commit = spawnSync(process.execPath, [cli, '--commit', 'slop/COMMIT_EDITMSG'], { cwd: here + 'fixtures', encoding: 'utf8' })
  assert.equal(commit.status, 1)
  assert.match(commit.stdout, /GIT-01/)
})
