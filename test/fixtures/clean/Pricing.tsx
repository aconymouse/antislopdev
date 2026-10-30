import Link from 'next/link'
import { formatPrice } from '@/lib/money'

type Plan = { id: string; name: string; price: number; seats: number; summary: string }

export function Pricing({ plans }: { plans: Plan[] }) {
  if (plans.length === 0) return <p className="text-muted">No plans are on sale right now.</p>

  return (
    <section aria-labelledby="pricing-title" className="grid gap-8 md:grid-cols-[1fr_2fr]">
      <header>
        <h2 id="pricing-title">Pricing</h2>
        <p>Pay per seat. Cancel from the billing page whenever you like, and keep your data for 30 days after.</p>
      </header>
      <ol className="divide-y border-y">
        {plans.map((plan) => (
          <li key={plan.id} className="flex items-baseline justify-between py-4">
            <div>
              <h3>{plan.name}</h3>
              <p>{plan.summary}</p>
            </div>
            <Link href={`/checkout/${plan.id}`} className="underline-offset-4 hover:underline focus-visible:outline-2">
              Buy {plan.name} for {formatPrice(plan.price)}
            </Link>
          </li>
        ))}
      </ol>
      <button type="button" aria-label="Close pricing" className="size-10 p-2">
        <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16"><path d="M3 3l10 10M13 3L3 13" /></svg>
      </button>
      <img src="/team.webp" alt="Our support desk in Jakarta" width="960" height="540" />
    </section>
  )
}
