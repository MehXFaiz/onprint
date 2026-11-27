import Button from './Button'

export default function PagePlaceholder({ title, note = 'This section is currently being updated in our portal.' }) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-8 sm:p-12 text-center shadow-xs">
      <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
        ONPRINT Management
      </span>
      <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">{title}</h1>
      <p className="mt-3 text-base leading-relaxed text-secondary">{note}</p>
      <div className="mt-8 flex justify-center">
        <Button to="/" variant="outline" size="sm">
          Return to Storefront
        </Button>
      </div>
    </div>
  )
}

