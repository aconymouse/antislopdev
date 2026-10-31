export type Lang = 'en' | 'id'
export type Page = 'home' | 'docs' | 'rules'

export const langs: { code: Lang; name: string; base: string }[] = [
  { code: 'en', name: 'English', base: '/' },
  { code: 'id', name: 'Bahasa Indonesia', base: '/id/' },
]

export const href = (lang: Lang, page: Page, hash = '') => `${lang === 'en' ? '/' : '/id/'}${page === 'home' ? '' : page + '/'}${hash}`

const en = {
  meta: {
    home: { title: 'antiSlopdev: the anti AI slop gatekeeper', description: '122 named habits of AI-generated UI, copy and code, and an open-source checker that finds 105 of them. Works as an agent skill and as a CLI.' },
    docs: { title: 'Docs · antiSlopdev', description: 'Install the antiSlopdev skill, run the checker in CI or on commit messages, and keep deliberate choices with a written reason.' },
    rules: { title: 'Rules · antiSlopdev', description: 'All 122 antiSlopdev rules for UI, English and Indonesian copy, code, docs, commits, claims, accessibility and performance.' },
  },
  nav: { playground: 'Playground', docs: 'Docs', rules: 'Rules', github: 'GitHub', star: 'Star', cta: 'Try it', menu: 'Menu', close: 'Close', theme: 'Theme', light: 'Light', dark: 'Dark', language: 'Language', skip: 'Skip to content' },
  hero: {
    line1: 'The anti AI slop',
    line2: 'gatekeeper.',
    lead: 'antiSlopdev names 122 habits of AI-generated UI, copy and code, and checks 105 of them on every change. Give it to your agent as a skill, or run it as a CLI.',
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
      { prompt: 'Build a pricing page for Flowly.', wrote: 'Wrote app/pricing/page.tsx', fixed: 'Fixed 4 findings', kept: 'Kept UI-11: the wordmark gradient is the brand.' },
      { prompt: 'Write the README for the CLI.', wrote: 'Wrote README.md', fixed: 'Fixed 3 findings', kept: 'No justify kept. Checked install steps by running them.' },
      { prompt: 'Commit the billing fix.', wrote: 'Drafted the commit message', fixed: 'Rewrote the subject line', kept: 'No justify kept.' },
    ],
  },
  xray: {
    title: 'Every default has a name.',
    p1: 'Point at the page on the right. It is what an agent ships when nobody decides anything, and every part of it is a rule you can name in a review.',
    p2: 'Then rewrite it. Same product, one decision at a time.',
    rewrite: 'Rewrite it',
    restore: 'Show the generated one',
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
    p1: 'Fourteen rules for Indonesian: the openers, the closers, the promo words and the chatbot leftovers that English-only tools walk past.',
    p2: 'Hover a squiggle to see which rule it is.',
  },
  groups: {
    title: '122 rules. 105 checked by a script.',
    p1: 'The rest need a person looking at the page, so the skill asks the agent to check them by eye and say so in the delivery note.',
    all: 'Read all the rules',
    names: { UI: 'Interface', TX: 'English copy', ID: 'Indonesian copy', CD: 'Code', DOC: 'Docs', GIT: 'Commits', TR: 'Truth', AX: 'Accessibility', PF: 'Performance' } as Record<string, string>,
  },
  faq: {
    title: 'Questions',
    items: [
      { q: 'Is this a style guide?', a: 'No. Gradients, dark themes, monospace, motion and rounded corners are all fine when someone chose them. The rules only ask that the choice was made, and the justify level exists for exactly that.' },
      { q: 'Does it send my code anywhere?', a: 'No. The checker is a plain Node package with no network calls, unless you pass --links to test external URLs. The playground runs in your browser tab.' },
      { q: 'How is it different from a linter?', a: 'A linter checks whether code is valid. antiSlopdev checks whether the result looks, reads and behaves like an unedited default: copy, layout choices, invented numbers, README habits and commit messages included.' },
      { q: 'Which agents does it work with?', a: 'Anything that reads Agent Skills: Claude Code, Cursor, Codex, GitHub Copilot, Gemini, Windsurf, Cline and others. Agents that do not read skills can still run the CLI.' },
      { q: 'It flagged something I meant to do.', a: 'Write the reason on the line above: antislopdev-allow UI-11 followed by a colon and why. For a whole file, use antislopdev-allow-file. block rules cannot be allowed, because they are never acceptable in shipped work.' },
      { q: 'Can I add my own rules?', a: 'Fork the repo. Rules live in RULES.md and the checks in src/core/rules. Pull requests with a failing example and a passing one are welcome.' },
    ],
  },
  source: {
    title: 'Read the rules. Fork them.',
    p1: 'One Markdown file of rules and a small TypeScript engine with no dependencies. Change a rule, run the tests, ship your own house version.',
    button: 'View on GitHub',
  },
  rules: {
    title: 'Rules',
    lead: 'Every rule has a stable ID and a level. The ID never changes meaning, so you can point at it in a review, a commit or a comment.',
    filter: 'Filter rules',
    all: 'All',
    none: 'No rule matches that.',
    auto: 'Checked automatically',
    eye: 'Checked by eye during review',
    of: 'of',
  },
  docs: {
    title: 'Docs',
    toc: 'On this page',
  },
  foot: { rights: '© 2026 Hafidz Nc', faq: 'FAQ' },
}

export type Copy = typeof en

const id: Copy = {
  meta: {
    home: { title: 'antiSlopdev: palang pintu anti AI slop', description: '122 kebiasaan AI di UI, copy, dan kode diberi nama, dan 105 di antaranya dicek otomatis. Bisa dipakai sebagai skill agent atau CLI, open source.' },
    docs: { title: 'Dokumentasi · antiSlopdev', description: 'Pasang skill antiSlopdev, jalankan pemeriksanya di CI atau di pesan commit, dan pertahankan pilihan yang disengaja lewat alasan tertulis.' },
    rules: { title: 'Aturan · antiSlopdev', description: 'Semua 122 aturan antiSlopdev untuk UI, copy Inggris dan Indonesia, kode, dokumentasi, commit, klaim, aksesibilitas, dan performa.' },
  },
  nav: { playground: 'Playground', docs: 'Dokumentasi', rules: 'Aturan', github: 'GitHub', star: 'Star', cta: 'Coba', menu: 'Menu', close: 'Tutup', theme: 'Tema', light: 'Terang', dark: 'Gelap', language: 'Bahasa', skip: 'Langsung ke isi' },
  hero: {
    line1: 'Palang pintu',
    line2: 'anti AI Slop.',
    lead: 'antiSlopdev memberi nama 122 kebiasaan AI di UI, copy, dan kode, lalu mengecek 105 di antaranya setiap ada perubahan. Pasang sebagai skill di agent-mu, atau jalankan sebagai CLI.',
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
    hint: 'Klik temuan buat lompat ke bagiannya.',
    presets: { landing: 'Landing page', readme: 'README', 'copy-id': 'Copy Indonesia', commit: 'Commit', code: 'Kode' },
  },
  agents: {
    title: 'Agent-mu ngecek kerjaannya sendiri.',
    p1: 'Pasang skill-nya sekali. Sebelum agent bilang selesai, dia jalanin pemeriksa, benerin semua yang block, dan nulis alasan buat yang dia pertahankan.',
    p2: 'Formatnya Agent Skills, sama dengan yang dibaca alat-alat di bawah, jadi gak perlu disetel satu-satu per editor.',
    you: 'Kamu',
    note: 'Catatan serah',
    scenes: [
      { prompt: 'Bikin halaman harga buat Flowly.', wrote: 'Menulis app/pricing/page.tsx', fixed: 'Membereskan 4 temuan', kept: 'UI-11 dipertahankan: gradien wordmark itu identitas merek.' },
      { prompt: 'Tulis README buat CLI-nya.', wrote: 'Menulis README.md', fixed: 'Membereskan 3 temuan', kept: 'Gak ada justify. Langkah instalasi dicek dengan dijalankan.' },
      { prompt: 'Commit perbaikan tagihan.', wrote: 'Menyusun pesan commit', fixed: 'Menulis ulang baris subjek', kept: 'Gak ada justify.' },
    ],
  },
  xray: {
    title: 'Tiap kebiasaan ada namanya.',
    p1: 'Arahkan kursor ke halaman di samping. Itu yang dikirim agent kalau gak ada yang mengambil keputusan, dan tiap bagiannya adalah aturan yang bisa kamu sebut saat review.',
    p2: 'Lalu tulis ulang. Produknya sama, keputusannya diambil satu per satu.',
    rewrite: 'Tulis ulang',
    restore: 'Lihat hasil AI-nya',
    point: 'Arahkan kursor ke bagian halaman',
    tap: 'Ketuk bagian halaman',
    rules: 'aturan di satu layar',
  },
  terminal: {
    title: 'Satu perintah, di CI atau sebelum commit.',
    p1: 'block menggagalkan pemeriksaan. justify gagal sampai ada yang nulis alasan di sebelahnya. warn cuma bau, tapi tiga warn aturan yang sama di satu file dihitung justify.',
    p2: 'Bisa baca TSX, HTML, Vue, Svelte, CSS, TypeScript, Python, Markdown, package.json, file terjemahan, dan pesan commit.',
  },
  allow: {
    title: 'Boleh dipertahankan, asal ada alasannya.',
    p1: 'Ada kebiasaan yang memang pilihan tepat. Temuan justify lolos begitu alasannya ditulis di sebelahnya, dan alasan itu muncul di diff, jadi reviewer bisa mendebatnya.',
    toggle: 'Tambah alasan',
    remove: 'Hapus alasan',
    failing: 'gagal: UI-11 butuh alasan',
    passing: 'lolos: diizinkan dengan alasan',
  },
  indo: {
    title: 'Paham copy bahasa Indonesia.',
    p1: 'Empat belas aturan khusus bahasa Indonesia: pembuka basa-basi, penutup klise, kosakata promosi, sampai sisa obrolan chatbot yang lolos dari alat yang cuma paham bahasa Inggris.',
    p2: 'Arahkan kursor ke garis bergelombang buat lihat aturannya.',
  },
  groups: {
    title: '122 aturan. 105 dicek otomatis.',
    p1: 'Sisanya butuh mata manusia, jadi skill-nya minta agent mengecek bagian itu sendiri dan menuliskannya di catatan serah.',
    all: 'Baca semua aturan',
    names: { UI: 'Antarmuka', TX: 'Copy Inggris', ID: 'Copy Indonesia', CD: 'Kode', DOC: 'Dokumentasi', GIT: 'Commit', TR: 'Kejujuran', AX: 'Aksesibilitas', PF: 'Performa' },
  },
  faq: {
    title: 'Pertanyaan',
    items: [
      { q: 'Ini panduan gaya?', a: 'Bukan. Gradien, tema gelap, monospace, animasi, dan sudut membulat boleh semua kalau memang dipilih. Aturannya cuma minta pilihan itu diambil dengan sadar, dan level justify ada buat itu.' },
      { q: 'Kodeku dikirim ke mana-mana?', a: 'Gak. Pemeriksanya paket Node biasa tanpa panggilan jaringan, kecuali kamu pakai --links buat ngecek tautan luar. Playground-nya jalan di tab browser-mu.' },
      { q: 'Apa bedanya sama linter?', a: 'Linter ngecek kode valid atau gak. antiSlopdev ngecek apakah hasilnya kelihatan, kebaca, dan berperilaku kayak bawaan yang gak disunting: copy, pilihan layout, angka karangan, kebiasaan README, sampai pesan commit.' },
      { q: 'Jalan di agent apa aja?', a: 'Semua yang baca Agent Skills: Claude Code, Cursor, Codex, GitHub Copilot, Gemini, Windsurf, Cline, dan lainnya. Agent yang gak baca skill tetap bisa jalanin CLI-nya.' },
      { q: 'Ada yang ketangkep padahal sengaja.', a: 'Tulis alasannya di baris atas: antislopdev-allow UI-11 diikuti titik dua dan alasannya. Buat satu file penuh, pakai antislopdev-allow-file. Aturan block gak bisa diizinkan, karena memang gak pernah layak dikirim.' },
      { q: 'Bisa nambah aturan sendiri?', a: 'Fork repo-nya. Aturan ada di RULES.md dan pemeriksanya di src/core/rules. Pull request yang bawa contoh gagal dan contoh lolos sangat diterima.' },
    ],
  },
  source: {
    title: 'Baca aturannya. Fork.',
    p1: 'Satu file Markdown berisi aturan dan mesin TypeScript kecil tanpa dependency. Ubah aturan, jalankan tes, kirim versi rumahmu sendiri.',
    button: 'Lihat di GitHub',
  },
  rules: {
    title: 'Aturan',
    lead: 'Tiap aturan punya ID tetap dan level. Arti ID gak pernah berubah, jadi bisa kamu sebut di review, commit, atau komentar.',
    filter: 'Saring aturan',
    all: 'Semua',
    none: 'Gak ada aturan yang cocok.',
    auto: 'Dicek otomatis',
    eye: 'Dicek pakai mata saat review',
    of: 'dari',
  },
  docs: {
    title: 'Dokumentasi',
    toc: 'Di halaman ini',
  },
  foot: { rights: '© 2026 Hafidz Nc', faq: 'FAQ' },
}

export const copies: Record<Lang, Copy> = { en, id }
