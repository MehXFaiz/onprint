export default function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-bold text-ink-900 sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-3 text-ink-500">{subtitle}</p>}
    </div>
  )
}
