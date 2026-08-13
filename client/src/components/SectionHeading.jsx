export default function SectionHeading({ eyebrow, title, subtitle, center = false, tone = 'default', className = '' }) {
  const light = tone === 'light'
  return (
    <div className={`flex flex-col ${center ? 'mx-auto max-w-2xl items-center text-center' : 'max-w-2xl'} ${className}`}>
      {eyebrow && (
        <span
          className={`mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${
            light ? 'text-background/60' : 'text-accent'
          }`}
        >
          <span className={`h-1.5 w-1.5 ${light ? 'bg-background/60' : 'bg-accent'}`} aria-hidden="true" />
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl ${
          light ? 'text-background' : 'text-primary'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? 'text-background/70' : 'text-secondary'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
