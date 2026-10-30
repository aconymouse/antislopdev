declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export const track = (name: string, params: Record<string, string | number> = {}) => {
  if (typeof window !== 'undefined') window.gtag?.('event', name, params)
}

export const still = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function escape(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
}
