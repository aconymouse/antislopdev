import { Sparkles, Zap, Shield, Rocket, ArrowRight } from 'lucide-react'

const features = [
  { icon: Zap, title: 'Lightning fast', text: 'Built for speed.' },
  { icon: Shield, title: 'Secure', text: 'Bank-grade encryption for your data.' },
  { icon: Rocket, title: 'Scalable', text: 'From startups to enterprises.' },
]

export default function Landing() {
  return (
    <main>
      <section className="relative text-center">
        <div className="absolute -top-20 left-1/2 h-96 w-96 rounded-full bg-purple-500 blur-3xl" />
        <span className="rounded-full border px-3 py-1 text-xs">✨ Introducing v2.0</span>
        <h1 className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Unlock the power of seamless collaboration
        </h1>
        <p>In today's fast-paced world, teams need a robust, intuitive, and powerful platform.</p>
        <button className="flex items-center">Get started <ArrowRight /></button>
        <a href="#">Learn more <ArrowRight /></a>
        <a href="/docs">Read more <ArrowRight /></a>
        <p>Join 10,000+ developers who ship 10x faster.</p>
      </section>
      <section className="text-center">
        <p className="text-xs uppercase tracking-widest">Features</p>
        <h2>🚀 Why choose us</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div className="rounded-2xl border p-6 shadow-lg hover:-translate-y-1">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <f.icon />
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="text-center">
        <p className="text-xs uppercase tracking-widest">Testimonials</p>
        <h2>What our customers say</h2>
        <blockquote>
          <p>It's not just a tool, it's a movement.</p>
          <cite>Sarah Chen, CEO at TechCorp</cite>
        </blockquote>
        <img src="https://i.pravatar.cc/150?img=3" />
      </section>
      <div onClick={() => {}} className="cursor-pointer">Contact</div>
      <button className="size-4"><Sparkles /></button>
    </main>
  )
}
