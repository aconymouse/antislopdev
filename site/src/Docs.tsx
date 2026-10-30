import { useEffect, useState, type ReactNode } from 'react'
import { catalog, implemented } from '../../src/core/index.js'
import { Footer, Header, repo } from './Chrome'
import { copies, href, type Lang } from './copy'

type Section = { id: string; title: string; body: ReactNode }

const Code = ({ children }: { children: string }) => (
  <pre className="snippet">
    <code>{children}</code>
  </pre>
)

const output = `src/app/page.tsx
  14:9     justify  UI-11  Gradient text on headings · bg-clip-text text-transparent
  26:9     block    UI-05  Emoji used as icons · "🚀 Why choose us"
  43:14    warn     TX-02  "Not just X, but Y" · "It's not just a tool, it's"

✗ 1 block · 1 justify · 1 warn · 1 file`

const flags: [string, string, string][] = [
  ['--json', 'machine-readable report', 'laporan JSON buat dibaca mesin'],
  ['--links', 'open every external link and report dead ones', 'buka semua tautan luar dan laporkan yang mati'],
  ['--commit <file>', 'check a commit or PR message', 'cek pesan commit atau PR'],
  ['--only UI,TX-04', 'run only these rules or groups', 'jalankan aturan atau kelompok ini saja'],
  ['--disable CD-11', 'skip these rules', 'lewati aturan ini'],
  ['--quiet', 'hide warn findings', 'sembunyikan temuan warn'],
]

function sections(lang: Lang): Section[] {
  const n = catalog.length
  const auto = implemented.length
  const en = lang === 'en'
  return [
    {
      id: 'start',
      title: en ? 'Start' : 'Mulai',
      body: en ? (
        <>
          <p>antiSlopdev has two parts. The <b>rules</b> are {n} named habits of AI-generated work, each with a stable ID and a level. The <b>checker</b> finds {auto} of them in your files. The rest need a person looking at the rendered page.</p>
          <p>Give the skill to your agent so it checks its own work, and run the checker in CI so nothing slips through when you write the code yourself.</p>
        </>
      ) : (
        <>
          <p>antiSlopdev punya dua bagian. <b>Aturan</b>: {n} kebiasaan hasil AI yang diberi nama, masing-masing punya ID tetap dan level. <b>Pemeriksa</b>: mencari {auto} di antaranya di file-mu. Sisanya butuh orang yang melihat halaman yang sudah jadi.</p>
          <p>Pasang skill-nya di agent supaya dia ngecek kerjaannya sendiri, lalu jalankan pemeriksanya di CI supaya gak ada yang lolos waktu kamu nulis kodenya sendiri.</p>
        </>
      ),
    },
    {
      id: 'skill',
      title: en ? 'Install the skill' : 'Pasang skill',
      body: (
        <>
          <p>{en ? 'For agents that read Agent Skills, including Claude Code, Cursor, Codex, GitHub Copilot, Gemini, Windsurf and Cline:' : 'Buat agent yang membaca Agent Skills, termasuk Claude Code, Cursor, Codex, GitHub Copilot, Gemini, Windsurf, dan Cline:'}</p>
          <Code>npx skills add aconymouse/antislopdev</Code>
          <p>{en ? 'As a Claude Code plugin:' : 'Sebagai plugin Claude Code:'}</p>
          <Code>{`/plugin marketplace add aconymouse/antislopdev
/plugin install antislopdev@antislopdev`}</Code>
          <p>
            {en ? 'Any other agent: give it ' : 'Agent lain: kasih '}
            <a href={`${repo}/blob/main/skills/antislopdev/SKILL.md`}>SKILL.md</a>
            {en ? ' and ' : ' dan '}
            <a href={`${repo}/blob/main/RULES.md`}>RULES.md</a>
            {en ? ' as instructions.' : ' sebagai instruksi.'}
          </p>
        </>
      ),
    },
    {
      id: 'checker',
      title: en ? 'Run the checker' : 'Jalankan pemeriksa',
      body: (
        <>
          <Code>npx antislopdev check src</Code>
          <Code>{output}</Code>
          <p>{en ? 'Each line is a finding: position, level, rule ID, rule title, and what matched. Pass files or folders; with no path it checks the current folder. node_modules, build output, lock files and anything in .gitignore are skipped.' : 'Tiap baris adalah satu temuan: posisi, level, ID aturan, judul aturan, dan bagian yang cocok. Kasih file atau folder; tanpa path, folder saat ini yang dicek. node_modules, hasil build, lock file, dan isi .gitignore dilewati.'}</p>
          <p>{en ? 'It reads .tsx, .jsx, .html, .vue, .svelte, .astro, .css, .js, .ts, .py and friends, Markdown, package.json, and translation files under messages/, locales/ or i18n/.' : 'Bisa baca .tsx, .jsx, .html, .vue, .svelte, .astro, .css, .js, .ts, .py dan sejenisnya, Markdown, package.json, serta file terjemahan di messages/, locales/, atau i18n/.'}</p>
        </>
      ),
    },
    {
      id: 'levels',
      title: en ? 'Levels' : 'Level',
      body: (
        <ul className="levels">
          <li>
            <b className="block">block</b>
            {en ? 'Never acceptable in shipped work. Fails the run and cannot be allowed.' : 'Gak pernah layak dikirim. Menggagalkan pemeriksaan dan gak bisa diizinkan.'}
          </li>
          <li>
            <b className="justify">justify</b>
            {en ? 'Fails until someone writes the reason next to it.' : 'Gagal sampai ada yang menulis alasan di sebelahnya.'}
          </li>
          <li>
            <b className="warn">warn</b>
            {en ? 'A smell. Reported, never fails on its own. Three warns of the same rule in one file count as justify.' : 'Bau. Dilaporkan, gak pernah gagal sendirian. Tiga warn aturan yang sama di satu file dihitung justify.'}
          </li>
        </ul>
      ),
    },
    {
      id: 'allow',
      title: en ? 'Keeping a finding' : 'Mempertahankan temuan',
      body: (
        <>
          <p>{en ? 'Write the reason on the same line or the line above, in the file’s own comment syntax:' : 'Tulis alasannya di baris yang sama atau baris di atasnya, pakai format komentar file itu:'}</p>
          <Code>{`// antislopdev-allow UI-11: the wordmark gradient is the brand
{/* antislopdev-allow UI-04: the AI menu really is the AI feature */}
<!-- antislopdev-allow TX-04: quoted as an example -->
/* antislopdev-allow UI-14: the player controls float over video */`}</Code>
          <p>{en ? 'Several IDs can share one reason (UI-10, UI-11). For a whole file, use antislopdev-allow-file. A reason needs real words; an empty one does not count.' : 'Beberapa ID boleh berbagi satu alasan (UI-10, UI-11). Buat satu file penuh, pakai antislopdev-allow-file. Alasannya harus berisi kata-kata; alasan kosong gak dihitung.'}</p>
        </>
      ),
    },
    {
      id: 'options',
      title: en ? 'Options' : 'Opsi',
      body: (
        <>
          <table>
            <tbody>
              {flags.map(([f, e, i]) => (
                <tr key={f}>
                  <td>
                    <code>{f}</code>
                  </td>
                  <td>{en ? e : i}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>{en ? 'antislopdev rules lists every rule. antislopdev explain UI-01 prints one.' : 'antislopdev rules menampilkan semua aturan. antislopdev explain UI-01 menampilkan satu aturan.'}</p>
        </>
      ),
    },
    {
      id: 'config',
      title: en ? 'Config' : 'Konfigurasi',
      body: (
        <>
          <p>{en ? 'Put antislopdev.json in the folder you run it from:' : 'Taruh antislopdev.json di folder tempat kamu menjalankannya:'}</p>
          <Code>{`{
  "ignore": ["docs/legacy", "src/fixtures"],
  "disable": ["CD-11"]
}`}</Code>
        </>
      ),
    },
    {
      id: 'ci',
      title: en ? 'CI and commits' : 'CI dan commit',
      body: (
        <>
          <p>GitHub Actions:</p>
          <Code>{`- uses: actions/setup-node@v4
  with:
    node-version: 22
- run: npx antislopdev@latest check .`}</Code>
          <p>{en ? 'Check every commit message with a commit-msg hook:' : 'Cek setiap pesan commit lewat hook commit-msg:'}</p>
          <Code>{`#!/bin/sh
npx antislopdev check --commit "$1"`}</Code>
        </>
      ),
    },
    {
      id: 'api',
      title: en ? 'From code' : 'Dari kode',
      body: (
        <>
          <Code>{`import { check } from 'antislopdev'

const report = check([{ path: 'hero.tsx', text: source }])
report.failed
report.findings`}</Code>
          <p>{en ? 'The engine has no dependencies and no Node APIs, so the same call works in a browser. The playground on the home page uses it.' : 'Mesinnya tanpa dependency dan tanpa API khusus Node, jadi pemanggilan yang sama jalan di browser. Playground di beranda memakainya.'}</p>
        </>
      ),
    },
    {
      id: 'note',
      title: en ? 'Delivery note' : 'Catatan serah',
      body: (
        <>
          <p>{en ? 'The skill asks the agent to end every handoff with three things:' : 'Skill-nya meminta agent menutup setiap serah terima dengan tiga hal:'}</p>
          <ol>
            <li>{en ? 'What it ran: build, tests, the checker, and what it looked at in a browser.' : 'Apa yang dijalankan: build, tes, pemeriksa, dan apa yang dilihat di browser.'}</li>
            <li>{en ? 'Every justify it kept, with the reason.' : 'Setiap justify yang dipertahankan, beserta alasannya.'}</li>
            <li>{en ? 'Every review rule it checked by eye, one line each.' : 'Setiap aturan review yang dicek pakai mata, satu baris per aturan.'}</li>
          </ol>
        </>
      ),
    },
    {
      id: 'contribute',
      title: en ? 'Adding a rule' : 'Menambah aturan',
      body: (
        <>
          <p>{en ? 'Rules live in RULES.md as table rows. The checks live in src/core/rules, one file per group. A new rule needs a row, a check (or the review label), and an example in the slop fixtures that it catches.' : 'Aturan ada di RULES.md dalam bentuk baris tabel. Pemeriksanya ada di src/core/rules, satu file per kelompok. Aturan baru butuh satu baris, satu pemeriksa (atau label review), dan contoh di fixture slop yang berhasil ditangkap.'}</p>
          <Code>{`npm install
npm test`}</Code>
          <p>
            <a href={`${repo}/issues`}>{en ? 'Open an issue' : 'Buka issue'}</a>
            {en ? ' if a rule catches something it should not.' : ' kalau ada aturan yang salah tangkap.'}
          </p>
        </>
      ),
    },
  ]
}

export function Docs({ lang }: { lang: Lang }) {
  const t = copies[lang]
  const list = sections(lang)
  const [active, setActive] = useState(list[0]!.id)

  useEffect(() => {
    const seen = new Map<string, boolean>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting)
        const first = list.find((s) => seen.get(s.id))
        if (first) setActive(first.id)
      },
      { rootMargin: '-80px 0px -55% 0px' },
    )
    for (const s of list) {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [lang])

  const at = list.findIndex((s) => s.id === active)

  return (
    <>
      <Header lang={lang} page="docs" />
      <main id="content" className="wrap page docs">
        <nav className="toc" aria-label={t.docs.toc}>
          <p>{t.docs.toc}</p>
          <ol style={{ ['--at' as string]: at }}>
            {list.map((s, i) => (
              <li key={s.id} className={i < at ? 'past' : i === at ? 'here' : ''}>
                <a href={`#${s.id}`} aria-current={i === at ? 'location' : undefined}>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="doc">
          <h1>{t.docs.title}</h1>
          {list.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
              <h2 id={`${s.id}-h`}>{s.title}</h2>
              {s.body}
            </section>
          ))}
          <p className="doc-end">
            <a href={href(lang, 'rules')}>{t.groups.all}</a>
          </p>
        </article>
      </main>
      <Footer lang={lang} />
    </>
  )
}
