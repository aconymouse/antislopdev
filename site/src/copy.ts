import { catalog, implemented } from '../../src/core/index.js'

const total = catalog.length
const auto = implemented.length

export type Lang = 'en' | 'id'
export type Page = 'home' | 'docs' | 'rules' | 'support' | 'stories' | 'features'

export const langs: { code: Lang; name: string; base: string }[] = [
  { code: 'en', name: 'English', base: '/' },
  { code: 'id', name: 'Bahasa Indonesia', base: '/id/' },
]

export const href = (lang: Lang, page: Page, hash = '') => `${lang === 'en' ? '/' : '/id/'}${page === 'home' ? '' : page + '/'}${hash}`

const en = {
  meta: {
    home: { title: 'antiSlopdev: the anti AI slop gatekeeper', description: `${total} named habits of AI-generated UI, copy, code, SEO and security, and an open-source checker that finds ${auto} of them. Skill or CLI.` },
    docs: { title: 'Docs · antiSlopdev', description: 'Install the antiSlopdev skill, run the checker in CI or on commit messages, and keep deliberate choices with a written reason.' },
    rules: { title: 'Rules · antiSlopdev', description: `All ${total} antiSlopdev rules for UI, English and Indonesian copy, code, docs, commits, claims, accessibility, performance, SEO and security.` },
    support: { title: 'Support · antiSlopdev', description: 'Report a false positive, propose a rule, see what is planned next, or chip in to keep antiSlopdev free and open source.' },
    features: { title: 'Features · antiSlopdev', description: 'Everything antiSlopdev does: named rules, a checker, levels with written reasons, your own rules, an agent skill, CI and commit hooks.' },
    stories: { title: 'Stories · antiSlopdev', description: 'Notes from building antiSlopdev: new rules, false positives, releases and the habits AI coding agents keep repeating.' },
  },
  nav: { playground: 'Playground', docs: 'Docs', rules: 'Rules', support: 'Support', stories: 'Stories', features: 'Features', github: 'GitHub', star: 'Star', cta: 'Try it', menu: 'Menu', close: 'Close', theme: 'Theme', light: 'Light', dark: 'Dark', language: 'Language', skip: 'Skip to content' },
  hero: {
    line1: 'The anti AI slop',
    line2: 'gatekeeper.',
    lead: `antiSlopdev names ${total} habits of AI-generated UI, copy, code, SEO and security, and checks ${auto} of them on every change. Give it to your agent as a skill, or run it as a CLI.`,
    plugin: 'Claude Code plugin',
    play: 'Open the playground',
    fine: 'Open source under MIT. Runs on your machine, nothing is uploaded.',
    copied: 'Copied',
  },
  play: {
    label: 'Playground',
    generated: 'As generated',
    rewritten: 'Rewritten',
    readAs: 'Read as',
    clean: 'Nothing to flag.',
    local: 'Runs in this tab. Nothing you type leaves the page.',
    line: 'line',
    cols: { level: 'Level', rule: 'Rule', title: 'Finding', line: 'Line' },
    hint: 'Click a finding to jump to it.',
    presets: { landing: 'Landing page', readme: 'README', 'copy-id': 'Indonesian copy', commit: 'Commit', code: 'Code' } as Record<string, string>,
  },
  agents: {
    title: 'Your agent checks its own work.',
    p1: 'Add the skill once. Before the agent says it is done, it runs the checker, fixes everything that blocks, and writes down why it kept the rest.',
    p2: 'It reads the same Agent Skills format as the tools below, so there is nothing to configure per editor.',
    you: 'You',
    note: 'Delivery note',
    scenes: [
      { prompt: 'Build a pricing page for Generic.', wrote: 'Wrote app/pricing/page.tsx', fixed: 'Fixed 4 findings', kept: 'Kept UI-11: the wordmark gradient is the brand.' },
      { prompt: 'Write the README for the CLI.', wrote: 'Wrote README.md', fixed: 'Fixed 3 findings', kept: 'No justify kept. Checked install steps by running them.' },
      { prompt: 'Commit the billing fix.', wrote: 'Drafted the commit message', fixed: 'Rewrote the subject line', kept: 'No justify kept.' },
    ],
  },
  xray: {
    title: 'Every default has a name.',
    p1: 'Point at the page on the right. It is what an agent ships when nobody decides anything, and every part of it is a rule you can name in a review.',
    p2: 'Then rewrite it. Same product, one decision at a time.',
    slop: 'The slop',
    rewrite: 'The rewrite',
    rewritten: 'Rewritten',
    point: 'Point at a part of the page',
    tap: 'Tap a part of the page',
    rules: 'rules on this screen',
  },
  terminal: {
    title: 'One command, in CI or before a commit.',
    p1: 'block fails the run. justify fails until someone writes the reason next to it. warn is a smell, and three of the same rule in one file count as justify.',
    p2: 'It reads TSX, HTML, Vue, Svelte, CSS, TypeScript, Python, Markdown, package.json, translation files and commit messages.',
  },
  allow: {
    title: 'Keep it, but say why.',
    p1: 'Some defaults are the right call. A justify finding passes as soon as the reason is written next to it, and that reason shows up in the diff where a reviewer can argue with it.',
    toggle: 'Add the reason',
    remove: 'Remove the reason',
    failing: 'fails: UI-11 needs a reason',
    passing: 'passes: allowed with a reason',
  },
  indo: {
    title: 'Reads Indonesian copy too.',
    p1: 'Fourteen rules written for Indonesian, from throat-clearing openers to chatbot leftovers that English-only tools walk straight past.',
    p2: 'Hover a squiggle to see which rule it is.',
  },
  groups: {
    title: `${total} rules. ${auto} checked by a script.`,
    p1: 'The rest need a person looking at the page, so the skill asks the agent to check them by eye and say so in the delivery note.',
    all: 'Read all the rules',
    auto: 'checked by script',
    names: { UI: 'Interface', TX: 'English copy', ID: 'Indonesian copy', CD: 'Code', DOC: 'Docs', GIT: 'Commits', TR: 'Truth', AX: 'Accessibility', PF: 'Performance', SEO: 'SEO', SEC: 'Security' } as Record<string, string>,
  },
  faq: {
    title: 'Questions',
    items: [
      { q: 'Is this a style guide?', a: 'No. Gradients, dark themes, monospace, motion and rounded corners are all fine when someone chose them. The rules only ask that the choice was made, and the justify level exists for exactly that.' },
      { q: 'Does it send my code anywhere?', a: 'No. The checker is a plain Node package with no network calls, unless you pass --links to test external URLs. The playground runs in your browser tab.' },
      { q: 'How is it different from a linter?', a: 'A linter checks whether code is valid. antiSlopdev checks whether anyone made a decision, which is why it also reads the copy, the README and the commit message.' },
      { q: 'Which agents does it work with?', a: 'Anything that reads Agent Skills: Claude Code, Cursor, Codex, GitHub Copilot, Gemini, Windsurf, Cline and others. Agents that do not read skills can still run the CLI.' },
      { q: 'It flagged something I meant to do.', a: 'Write the reason on the line above: antislopdev-allow UI-11 followed by a colon and why. For a whole file, use antislopdev-allow-file. block rules cannot be allowed, because they are never acceptable in shipped work.' },
      { q: 'Can I add my own rules?', a: 'Yes. Put them in antislopdev.json under rules, as a word list or a regular expression with your own prefix, and change any built-in level under levels. A rule that belongs to everyone goes in RULES.md as a pull request, with one example that fails and one that passes.' },
    ],
  },
  source: {
    title: 'Read the rules. Fork them.',
    p1: 'One Markdown file of rules and a small TypeScript engine with no dependencies. Disagree with a rule? Change it and keep your own version.',
    button: 'View on GitHub',
  },
  rules: {
    title: 'Rules',
    lead: 'Every rule has a stable ID and a level. An ID never changes meaning, so you can quote it in a code review.',
    filter: 'Filter rules',
    all: 'All',
    none: 'No rule matches that.',
    auto: 'Checked automatically',
    eye: 'Checked by eye during review',
    of: 'of',
    promo: { SEO: 'Audit a live page with sarangSEO', SEC: 'Scan a domain you own with wowHacker' } as Record<string, string>,
  },
  docs: {
    title: 'Docs',
    toc: 'On this page',
  },
  support: {
    title: 'Support antiSlopdev',
    lead: 'It is free and MIT-licensed, and it gets sharper every time someone reports a false positive, argues for a rule or sends a fix. If it saves you review time, you can chip in too.',
    help: 'Contribute',
    ways: [
      { key: 'fp', label: 'Report a false positive', note: 'The smallest snippet that trips a rule it should not.' },
      { key: 'rule', label: 'Propose a rule', note: 'A habit no rule covers yet, with one real example.' },
      { key: 'setup', label: 'Show your setup', note: 'How you run antiSlopdev in your agent, CI or hooks.' },
      { key: 'guide', label: 'Read the contributing guide', note: 'How a rule goes from idea to check, and how to run the tests.' },
    ],
    roadmap: 'Roadmap',
    roadmapLead: 'What comes next, read straight from ROADMAP.md. An item moves to Now when someone starts on it.',
    stages: { Now: 'Now', Next: 'Next', Later: 'Later' } as Record<string, string>,
    source: 'ROADMAP.md on GitHub',
    give: 'Donate',
    giveLead: 'The payment happens on Saweria or PayPal. Nothing about it passes through this site.',
    saweria: 'QRIS and e-wallets, for Indonesia',
    paypal: 'Cards or PayPal, from anywhere',
  },
  foot: { rights: '© 2026', made: 'Made with love by', creator: 'creator of antiSlopdev', faq: 'FAQ' },
  fit: {
    title: 'Make it fit your project.',
    p1: 'Add rules in your own words, decide how strict each one is, and let the agent read only the part of the list it needs.',
    items: [
      { key: 'rules', title: 'Your own rules', body: 'A word list or a regular expression in antislopdev.json, under your own prefix. The findings look like any other.' },
      { key: 'levels', title: 'Your own levels', body: 'Make hype words fail the run in marketing copy, or turn a rule down to a warn where it does not fit.' },
      { key: 'skill', title: 'Lighter for the agent', body: 'The rules ship one file per group. Building a page, the agent reads ui.md, about 6 KB instead of 30.' },
      { key: 'scan', title: 'Rules from real scans', body: 'When a code scanner finds something here, it becomes a rule. SEC-26 catches page text written back as HTML or a link.' },
    ],
    copyLine: 'Open the dashboard to invite your team.',
    more: 'All features',
  },
  features: {
    title: 'Everything it does.',
    lead: 'A rule list your agent reads, a checker that runs anywhere Node runs, and a few ways to make both fit the project.',
    groups: [
      {
        name: 'Name the default',
        items: [
          { title: `${total} rules with stable IDs`, body: 'UI, English and Indonesian copy, code, docs, commits, claims, accessibility, performance, SEO and security. An ID never changes meaning.', to: 'rules' },
          { title: `A checker for ${auto} of them`, body: 'Reads TSX, HTML, Vue, Svelte, Astro, CSS, JavaScript, TypeScript, Python, Markdown, package.json, translation files and commit messages.', to: 'docs#checker' },
          { title: 'Security rules from real scans', body: 'Leaked keys, server env in the browser, regexes that hang, HTML cleaned with a regex, page text used as HTML. Several came from CodeQL findings.', to: 'rules#SEC' },
          { title: 'Indonesian copy, not only English', body: 'Fourteen rules for Indonesian, from throat-clearing openers to chatbot leftovers.', to: 'rules#ID' },
        ],
      },
      {
        name: 'Keep what was chosen',
        items: [
          { title: 'Three levels', body: 'block fails the run, justify needs a written reason, warn is a smell until it repeats three times in a file.', to: 'docs#levels' },
          { title: 'Reasons next to the code', body: 'antislopdev-allow UI-11: the reason. It shows up in the diff, where a reviewer can argue with it.', to: 'docs#allow' },
          { title: 'A delivery note', body: 'The agent ends with what it ran, every reason it kept and every rule it checked by eye.', to: 'docs#note' },
        ],
      },
      {
        name: 'Fit the project',
        items: [
          { title: 'Your own rules', body: 'Word lists or regular expressions with your own prefix, checked in copy, code, commits or everywhere.', to: 'docs#config' },
          { title: 'Your own levels', body: 'Make any rule stricter or looser for one project without forking.', to: 'docs#config' },
          { title: 'Ignore and disable', body: 'Skip folders, turn off a rule, or run one group with --only.', to: 'docs#options' },
        ],
      },
      {
        name: 'Run it anywhere',
        items: [
          { title: 'An agent skill', body: 'Claude Code, Cursor, Codex, GitHub Copilot, Gemini, Windsurf and Cline read it. The agent loads only the groups it needs.', to: 'docs#skill' },
          { title: 'CI and commit hooks', body: 'One npx line in a workflow, one in commit-msg.', to: 'docs#ci' },
          { title: 'JSON and a JavaScript API', body: '--json for scripts, check() and checkSources() for tools of your own.', to: 'docs#api' },
          { title: 'Local, free, no dependencies', body: 'MIT licensed. Nothing leaves your machine unless you ask it to check links.', to: 'docs#start' },
        ],
      },
    ],
  },
  stories: { title: 'Stories', lead: 'Notes from building antiSlopdev: new rules, false positives, releases and the habits AI coding agents keep repeating.', minutes: 'min read', back: 'All stories', by: 'By', other: 'Baca dalam Bahasa Indonesia', feed: 'RSS feed', copy: 'Copy', copied: 'Copied' },
}

export type Copy = typeof en

const id: Copy = {
  meta: {
    home: { title: 'antiSlopdev: palang pintu anti AI slop', description: `${total} kebiasaan AI di UI, copy, kode, SEO, dan keamanan diberi nama, dan ${auto} di antaranya dicek otomatis. Skill agent atau CLI, open source.` },
    docs: { title: 'Docs · antiSlopdev', description: 'Pasang skill antiSlopdev, jalankan checker-nya di CI atau di pesan commit, dan pertahankan pilihan yang disengaja lewat alasan tertulis.' },
    rules: { title: 'Aturan · antiSlopdev', description: `Semua ${total} aturan antiSlopdev untuk UI, copy Inggris dan Indonesia, kode, dokumentasi, commit, klaim, aksesibilitas, performa, SEO, dan keamanan.` },
    support: { title: 'Dukung · antiSlopdev', description: 'Lapor false positive, usulin aturan, lihat rencana berikutnya, atau ikut patungan biar antiSlopdev tetap gratis dan open source.' },
    features: { title: 'Fitur · antiSlopdev', description: 'Semua yang dikerjakan antiSlopdev: aturan bernama, checker, level dengan alasan tertulis, aturan sendiri, skill agent, CI dan hook commit.' },
    stories: { title: 'Cerita · antiSlopdev', description: 'Catatan dari bikin antiSlopdev: aturan baru, false positive, rilis, dan kebiasaan agent AI yang terus berulang.' },
  },
  nav: { playground: 'Playground', docs: 'Docs', rules: 'Aturan', support: 'Dukung', stories: 'Cerita', features: 'Fitur', github: 'GitHub', star: 'Star', cta: 'Coba', menu: 'Menu', close: 'Tutup', theme: 'Tema', light: 'Terang', dark: 'Gelap', language: 'Bahasa', skip: 'Langsung ke isi' },
  hero: {
    line1: 'Palang pintu',
    line2: 'anti AI Slop.',
    lead: `antiSlopdev memberi nama ${total} kebiasaan AI di UI, copy, kode, SEO, dan keamanan, lalu mengecek ${auto} di antaranya setiap ada perubahan. Pasang sebagai skill di agent-mu, atau jalankan sebagai CLI.`,
    plugin: 'Plugin Claude Code',
    play: 'Buka playground',
    fine: 'Open source, lisensi MIT. Jalan di komputermu, gak ada yang diunggah.',
    copied: 'Tersalin',
  },
  play: {
    label: 'Playground',
    generated: 'Hasil AI',
    rewritten: 'Ditulis ulang',
    readAs: 'Baca sebagai',
    clean: 'Gak ada temuan.',
    local: 'Jalan di tab ini. Apa pun yang kamu ketik gak keluar dari halaman.',
    line: 'baris',
    cols: { level: 'Level', rule: 'Aturan', title: 'Temuan', line: 'Baris' },
    hint: 'Klik temuan buat lompat ke bagiannya.',
    presets: { landing: 'Landing page', readme: 'README', 'copy-id': 'Copy Indonesia', commit: 'Commit', code: 'Kode' },
  },
  agents: {
    title: 'Agent-mu ngecek kerjaannya sendiri.',
    p1: 'Pasang skill-nya sekali. Sebelum agent bilang selesai, dia jalanin checker, benerin semua yang block, dan nulis alasan buat yang dia pertahankan.',
    p2: 'Formatnya Agent Skills, sama dengan yang dibaca alat-alat di bawah, jadi gak perlu disetel satu-satu per editor.',
    you: 'Kamu',
    note: 'Delivery note',
    scenes: [
      { prompt: 'Bikin halaman harga buat Generic.', wrote: 'Menulis app/pricing/page.tsx', fixed: 'Membereskan 4 temuan', kept: 'UI-11 dipertahankan: gradien wordmark itu bagian dari brand.' },
      { prompt: 'Tulis README buat CLI-nya.', wrote: 'Menulis README.md', fixed: 'Membereskan 3 temuan', kept: 'Gak ada justify. Langkah instalasi dicek dengan dijalankan.' },
      { prompt: 'Commit fix billing-nya.', wrote: 'Menyusun pesan commit', fixed: 'Menulis ulang subject line', kept: 'Gak ada justify.' },
    ],
  },
  xray: {
    title: 'Tiap kebiasaan ada namanya.',
    p1: 'Arahkan kursor ke halaman di samping. Itu yang di-ship agent kalau gak ada yang mengambil keputusan, dan tiap bagiannya adalah aturan yang bisa kamu sebut saat review.',
    p2: 'Lalu tulis ulang. Produknya sama, keputusannya diambil satu per satu.',
    slop: 'Versi slop',
    rewrite: 'Ditulis ulang',
    rewritten: 'Ditulis ulang',
    point: 'Arahkan kursor ke bagian halaman',
    tap: 'Ketuk bagian halaman',
    rules: 'aturan di satu layar',
  },
  terminal: {
    title: 'Satu perintah, di CI atau sebelum commit.',
    p1: 'block bikin pengecekan gagal. justify gagal sampai ada yang nulis alasan di sebelahnya. warn cuma smell, tapi tiga warn aturan yang sama di satu file dihitung justify.',
    p2: 'Bisa baca TSX, HTML, Vue, Svelte, CSS, TypeScript, Python, Markdown, package.json, file i18n, dan pesan commit.',
  },
  allow: {
    title: 'Boleh dipertahankan, asal ada alasannya.',
    p1: 'Kadang bawaan memang pilihan yang pas. Temuan justify lolos begitu alasannya ditulis di sebelahnya, dan alasan itu ikut muncul di diff, jadi reviewer bisa mendebatnya.',
    toggle: 'Tambah alasan',
    remove: 'Hapus alasan',
    failing: 'gagal: UI-11 butuh alasan',
    passing: 'lolos: diizinkan dengan alasan',
  },
  indo: {
    title: 'Paham copy bahasa Indonesia.',
    p1: 'Empat belas aturan khusus bahasa Indonesia, dari pembuka basa-basi sampai sisa obrolan chatbot yang lolos dari alat yang cuma paham bahasa Inggris.',
    p2: 'Arahkan kursor ke garis bergelombang buat lihat aturannya.',
  },
  groups: {
    title: `${total} aturan. ${auto} dicek otomatis.`,
    p1: 'Sisanya butuh mata manusia, jadi skill-nya minta agent mengecek bagian itu sendiri dan menuliskannya di delivery note.',
    all: 'Baca semua aturan',
    auto: 'dicek otomatis',
    names: { UI: 'UI', TX: 'Copy Inggris', ID: 'Copy Indonesia', CD: 'Kode', DOC: 'Docs', GIT: 'Commit', TR: 'Kejujuran', AX: 'Aksesibilitas', PF: 'Performa', SEO: 'SEO', SEC: 'Keamanan' },
  },
  faq: {
    title: 'Pertanyaan',
    items: [
      { q: 'Ini style guide?', a: 'Bukan. Gradien, dark mode, monospace, animasi, dan rounded corner boleh semua kalau memang dipilih. Aturannya cuma minta pilihan itu diambil dengan sadar, dan level justify ada buat itu.' },
      { q: 'Kodeku dikirim ke mana-mana?', a: 'Gak. Checker-nya paket Node biasa tanpa request jaringan, kecuali kamu pakai --links buat ngecek link eksternal. Playground-nya jalan di tab browser-mu.' },
      { q: 'Apa bedanya sama linter?', a: 'Linter ngecek kode valid atau gak. antiSlopdev ngecek ada yang ambil keputusan atau gak, makanya dia juga baca copy, README, sampai pesan commit.' },
      { q: 'Jalan di agent apa aja?', a: 'Semua yang baca Agent Skills: Claude Code, Cursor, Codex, GitHub Copilot, Gemini, Windsurf, Cline, dan lainnya. Agent yang gak baca skill tetap bisa jalanin CLI-nya.' },
      { q: 'Ada yang ketangkep padahal sengaja.', a: 'Tulis alasannya di baris atas: antislopdev-allow UI-11 diikuti titik dua dan alasannya. Buat satu file penuh, pakai antislopdev-allow-file. Aturan block gak bisa diizinkan, karena memang gak pernah layak di-ship.' },
      { q: 'Bisa nambah aturan sendiri?', a: 'Bisa. Taruh di antislopdev.json bagian rules, berupa daftar kata atau regex dengan prefix kalian sendiri, dan ubah level aturan bawaan di bagian levels. Aturan yang berguna buat semua orang masuk ke RULES.md lewat pull request, bawa satu contoh yang gagal dan satu yang lolos.' },
    ],
  },
  source: {
    title: 'Baca aturannya. Fork.',
    p1: 'Satu file Markdown berisi aturan dan mesin TypeScript kecil tanpa dependency. Gak setuju sama satu aturan? Ubah aja dan pakai versimu sendiri.',
    button: 'Lihat di GitHub',
  },
  rules: {
    title: 'Aturan',
    lead: 'Tiap aturan punya ID tetap dan level. Arti ID gak pernah berubah, jadi aman dikutip waktu code review.',
    filter: 'Filter aturan',
    all: 'Semua',
    none: 'Gak ada aturan yang cocok.',
    auto: 'Dicek otomatis',
    eye: 'Dicek pakai mata saat review',
    of: 'dari',
    promo: { SEO: 'Audit halaman live pakai sarangSEO', SEC: 'Pindai domain milikmu pakai wowHacker' },
  },
  docs: {
    title: 'Docs',
    toc: 'Di halaman ini',
  },
  support: {
    title: 'Dukung antiSlopdev',
    lead: 'antiSlopdev gratis dan berlisensi MIT. Dia makin tajam tiap ada yang lapor false positive, ngusulin aturan, atau kirim perbaikan. Kalau dia ngirit waktu review kamu, kamu juga bisa ikut patungan.',
    help: 'Kontribusi',
    ways: [
      { key: 'fp', label: 'Lapor false positive', note: 'Snippet terkecil yang kena aturan padahal gak seharusnya.' },
      { key: 'rule', label: 'Usulin aturan', note: 'Kebiasaan yang belum punya aturan, plus satu contoh nyata.' },
      { key: 'setup', label: 'Pamerin setup kamu', note: 'Cara kamu jalanin antiSlopdev di agent, CI, atau hook.' },
      { key: 'guide', label: 'Baca panduan kontribusi', note: 'Alur aturan dari ide sampai dicek, dan cara jalanin tes.' },
    ],
    roadmap: 'Roadmap',
    roadmapLead: 'Rencana ke depan, dibaca langsung dari ROADMAP.md yang ditulis dalam bahasa Inggris. Item pindah ke Sekarang begitu ada yang mulai ngerjain.',
    stages: { Now: 'Sekarang', Next: 'Berikutnya', Later: 'Nanti' } as Record<string, string>,
    source: 'ROADMAP.md di GitHub',
    give: 'Donasi',
    giveLead: 'Pembayarannya terjadi di Saweria atau PayPal. Gak ada data pembayaran yang lewat situs ini.',
    saweria: 'QRIS dan e-wallet, dari Indonesia',
    paypal: 'Kartu atau PayPal, dari mana saja',
  },
  foot: { rights: '© 2026', made: 'Dibuat dengan cinta oleh', creator: 'creator antiSlopdev', faq: 'FAQ' },
  fit: {
    title: 'Sesuaikan sama project kalian.',
    p1: 'Tambah aturan pakai kata kalian sendiri, atur seberapa ketat tiap aturan, dan biarkan agent cuma baca bagian yang dia perlukan.',
    items: [
      { key: 'rules', title: 'Aturan sendiri', body: 'Daftar kata atau regex di antislopdev.json, pakai prefix kalian sendiri. Temuannya tampil kayak aturan lain.' },
      { key: 'levels', title: 'Level sendiri', body: 'Bikin kata hype menggagalkan run di copy marketing, atau turunkan aturan jadi warn kalau memang gak cocok.' },
      { key: 'skill', title: 'Lebih ringan buat agent', body: 'Aturan dikirim satu file per grup. Lagi bikin halaman, agent cukup baca ui.md, sekitar 6 KB, bukan 30 KB.' },
      { key: 'scan', title: 'Aturan dari scan beneran', body: 'Kalau code scanner nemu masalah di sini, temuannya jadi aturan. SEC-26 nangkep teks halaman yang dipakai lagi jadi HTML atau link.' },
    ],
    copyLine: 'Buka dashboard buat ngundang tim kamu.',
    more: 'Semua fitur',
  },
  features: {
    title: 'Semua yang dia kerjakan.',
    lead: 'Daftar aturan yang dibaca agent, checker yang jalan di mana pun Node jalan, dan beberapa cara biar keduanya pas sama project kalian.',
    groups: [
      {
        name: 'Kasih nama ke kebiasaan',
        items: [
          { title: `${total} aturan dengan ID tetap`, body: 'UI, copy Inggris dan Indonesia, kode, dokumentasi, commit, klaim, aksesibilitas, performa, SEO, dan keamanan. Arti sebuah ID gak pernah berubah.', to: 'rules' },
          { title: `Checker untuk ${auto} di antaranya`, body: 'Membaca TSX, HTML, Vue, Svelte, Astro, CSS, JavaScript, TypeScript, Python, Markdown, package.json, file terjemahan, dan pesan commit.', to: 'docs#checker' },
          { title: 'Aturan keamanan dari scan beneran', body: 'Kunci bocor, env server di browser, regex yang bisa hang, HTML dibersihkan pakai regex, teks halaman dipakai jadi HTML. Beberapa lahir dari temuan CodeQL.', to: 'rules#SEC' },
          { title: 'Copy bahasa Indonesia juga', body: 'Empat belas aturan khusus bahasa Indonesia, dari pembuka basa-basi sampai sisa obrolan chatbot.', to: 'rules#ID' },
        ],
      },
      {
        name: 'Pertahankan yang disengaja',
        items: [
          { title: 'Tiga level', body: 'block menggagalkan run, justify butuh alasan tertulis, warn cuma bau sampai muncul tiga kali di satu file.', to: 'docs#levels' },
          { title: 'Alasan di sebelah kodenya', body: 'antislopdev-allow UI-11: alasannya. Muncul di diff, tempat reviewer bisa membantahnya.', to: 'docs#allow' },
          { title: 'Delivery note', body: 'Agent menutup kerjaan dengan apa yang dia jalankan, tiap alasan yang dia pertahankan, dan aturan yang dia cek pakai mata.', to: 'docs#note' },
        ],
      },
      {
        name: 'Pas sama project',
        items: [
          { title: 'Aturan sendiri', body: 'Daftar kata atau regex dengan prefix sendiri, dicek di copy, kode, commit, atau di mana saja.', to: 'docs#config' },
          { title: 'Level sendiri', body: 'Bikin aturan apa pun lebih ketat atau lebih longgar buat satu project tanpa fork.', to: 'docs#config' },
          { title: 'Abaikan dan matikan', body: 'Lewati folder, matikan aturan, atau jalankan satu grup aja pakai --only.', to: 'docs#options' },
        ],
      },
      {
        name: 'Jalan di mana saja',
        items: [
          { title: 'Skill agent', body: 'Dibaca Claude Code, Cursor, Codex, GitHub Copilot, Gemini, Windsurf, dan Cline. Agent cuma memuat grup yang dia butuhkan.', to: 'docs#skill' },
          { title: 'CI dan hook commit', body: 'Satu baris npx di workflow, satu di commit-msg.', to: 'docs#ci' },
          { title: 'JSON dan JavaScript API', body: '--json buat script, check() dan checkSources() buat tool buatan sendiri.', to: 'docs#api' },
          { title: 'Lokal, gratis, tanpa dependency', body: 'Lisensi MIT. Gak ada yang keluar dari mesin kalian kecuali kalian minta cek link.', to: 'docs#start' },
        ],
      },
    ],
  },
  stories: { title: 'Cerita', lead: 'Catatan dari bikin antiSlopdev: aturan baru, false positive, rilis, dan kebiasaan agent AI yang terus berulang.', minutes: 'menit baca', back: 'Semua cerita', by: 'Oleh', other: 'Read in English', feed: 'Feed RSS', copy: 'Salin', copied: 'Tersalin' },
}

export const copies: Record<Lang, Copy> = { en, id }
