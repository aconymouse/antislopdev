import { useEffect, useRef, useState } from 'react'
import { still } from './track'

export function Typed({ text, className = 'snippet' }: { text: string; className?: string }) {
  const box = useRef<HTMLPreElement>(null)
  const [shown, setShown] = useState(text.length)

  useEffect(() => {
    const el = box.current
    if (!el || still()) return
    setShown(0)
    let frame = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        io.disconnect()
        const total = text.length
        const span = Math.min(1600, Math.max(500, total * 16))
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / span)
          setShown(Math.round(total * p))
          if (p < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [text])

  const typing = shown < text.length
  return (
    <pre className={`${className} typed${typing ? ' is-typing' : ''}`} ref={box}>
      <code>
        <span className="typed-ghost">{text}</span>
        <span className="typed-live" aria-hidden="true">
          {text.slice(0, shown)}
          {typing ? <i className="cursor" /> : null}
        </span>
      </code>
    </pre>
  )
}
