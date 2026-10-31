export interface Preset {
  id: string
  label: string
  path: string
  slop: string
  fixed: string
}

export const presets: Preset[] = [
  {
    id: 'landing',
    label: 'Landing page',
    path: 'Hero.tsx',
    slop: `import { Sparkles, Zap, ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative text-center">
      <div className="absolute -top-24 left-1/2 size-96 rounded-full bg-violet-500 blur-3xl" />
      <span className="rounded-full border px-3 py-1 text-xs">✨ Introducing Generic 2.0</span>
      <h1 className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Unlock the power of seamless collaboration
      </h1>
      <p>In today's fast-paced world, teams need more than a tool. It's not just an app, it's a movement.</p>
      <a href="#">Get started <ArrowRight /></a>
      <a href="/docs">Learn more <ArrowRight /></a>
      <p>Trusted by 10,000+ teams who ship 10x faster.</p>

      <p className="text-xs uppercase tracking-widest">Features</p>
      <h2>🚀 Everything you need</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f) => (
          <div className="rounded-2xl border p-6 shadow-lg hover:-translate-y-1">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <Zap />
            </div>
            <h3>{f.title}</h3>
          </div>
        ))}
      </div>
      <blockquote>"Generic changed everything." <cite>Sarah Chen, CEO at TechCorp</cite></blockquote>
    </section>
  )
}
`,
    fixed: `import Link from 'next/link'

export function Hero({ teams }: { teams: number }) {
  return (
    <section className="grid gap-6 md:grid-cols-[3fr_2fr]">
      <div>
        <h1>Shared notes that turn into a task list</h1>
        <p>
          Write the meeting notes together. Every line that starts with a name becomes a task for that
          person, with the meeting as its source.
        </p>
        <Link href="/signup">Create a workspace</Link>
        <Link href="/docs/import">Import notes from Google Docs</Link>
        <p>{teams} teams used Generic this week.</p>
      </div>
      <img src="/notes-to-tasks.webp" alt="A meeting note on the left, the tasks it created on the right" width="960" height="720" />
    </section>
  )
}
`,
  },
  {
    id: 'readme',
    label: 'README',
    path: 'README.md',
    slop: `# 🚀 Generic

## ✨ Features

- ⚡ **Blazing fast** performance
- 🔒 **Secure by default**
- 🎨 Beautiful UI

Whether you're a beginner or a pro, Generic helps you delve into your data. It's worth noting that experts say this is the best approach.

## Getting Started

\`\`\`bash
npm install “generic”
\`\`\`

## Star History

Built with ❤️ by the team. Happy coding!
`,
    fixed: `# Generic

Turns meeting notes into tasks. A line that starts with a name becomes a task for that person.

## Install

\`\`\`bash
npm install generic
\`\`\`

## Use

\`\`\`bash
generic notes.md --assign
\`\`\`

Lines without a name stay as notes. If a name does not match anyone in the workspace, the command stops and lists the unknown names instead of guessing.

## Licence

MIT
`,
  },
  {
    id: 'copy-id',
    label: 'Copy (Indonesian)',
    path: 'produk.md',
    slop: `## Solusi Terbaik untuk Bisnis Anda

Di era digital saat ini, bisnis Anda butuh solusi terbaik yang revolusioner. Generic tidak hanya cepat, tetapi juga aman, yang menunjukkan komitmen kami pada kualitas.

Para ahli mengatakan Generic menjadi bukti nyata transformasi digital, mulai dari UMKM hingga korporasi. Kamu gak perlu khawatir, Anda tinggal daftar!

[Selengkapnya](/fitur)

Semoga bermanfaat!
`,
    fixed: `## Catatan rapat yang langsung jadi daftar tugas

Tulis catatan rapat bareng tim. Baris yang diawali nama orang otomatis jadi tugas buat orang itu, lengkap dengan tautan ke rapatnya.

Paket gratis cukup buat tim sampai 5 orang. Kalau lebih, biayanya Rp25.000 per orang per bulan, dan bisa berhenti kapan aja dari halaman tagihan.

[Bikin ruang kerja gratis](/daftar)
`,
  },
  {
    id: 'commit',
    label: 'Commit',
    path: 'COMMIT_EDITMSG',
    slop: `✨ feat: add amazing new dashboard

This commit updates the dashboard component to change the layout and enhance the overall user experience.
`,
    fixed: `fix: tasks from deleted meetings no longer show up on the board

The board query joined tasks to meetings without checking deleted_at,
so tasks kept their old meeting link after the meeting was removed.
`,
  },
  {
    id: 'code',
    label: 'Code',
    path: 'tasks.ts',
    slop: `// ===== HELPERS =====

// Get the task
export async function getTask(id: any) {
  // Return the task
  return db.task.find(id)
}

export async function closeTask(id: string) {
  try {
    await db.task.update(id, { done: true })
  } catch (e) {}
  console.log('✅ Task closed!')
}

export function remind() {
  // TODO: implement this
  throw new Error('Not implemented')
}
`,
    fixed: `export async function getTask(id: string) {
  return db.task.find(id)
}

export async function closeTask(id: string) {
  const task = await db.task.update(id, { done: true })
  if (!task) throw new Error(\`task \${id} does not exist\`)
  return task
}
`,
  },
]
