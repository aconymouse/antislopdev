import { useEffect } from 'react'

export function Words({ text, start = 0 }: { text: string; start?: number }) {
  const parts = text.split(/(\s+)/)
  let i = start
  return (
    <>
      {parts.map((part, n) =>
        /^\s+$/.test(part) || part === '' ? (
          part
        ) : (
          <span key={n} className="w" style={{ ['--i' as string]: i++ }}>
            {part}
          </span>
        ),
      )}
    </>
  )
}

export function useTheater() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (const el of document.querySelectorAll('[data-words]')) el.classList.add('is-shown')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add('is-shown')
          else if (e.boundingClientRect.top > window.innerHeight * 0.5) e.target.classList.remove('is-shown')
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.4 },
    )
    for (const el of document.querySelectorAll('[data-words]')) io.observe(el)
    return () => io.disconnect()
  }, [])
}
