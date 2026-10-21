export default function SectionHeading({ eyebrow, title, subtitle, center = false, tone = 'default', className = '' }) {
  const isLightSurface = tone === 'light' || tone === 'dark-on-light' || tone === 'ivory'

  return (
    <div className={`flex flex-col ${center ? 'mx-auto max-w-3xl items-center text-center' : 'max-w-3xl'} ${className}`}>
      {eyebrow && (
        <div className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest ${
          isLightSurface
            ? 'border-[#D4AF65]/40 bg-[#FFFFFF] text-[#101D35]'
            : 'border-[#203357] bg-[#172644] text-[#D4AF65]'
        }`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF65]" aria-hidden="true" />
          <span>{eyebrow}</span>
        </div>
      )}
      <h2
        className={`font-display text-3xl font-black tracking-tight text-balance sm:text-4xl lg:text-5xl ${
          isLightSurface ? 'text-[#101D35]' : 'text-[#F5F2EB]'
        }`}
      >
        {title}
      </h2>
      
      {/* Refined Gold Underline Accent */}
      <div className={`mt-3 flex items-center ${center ? 'justify-center' : ''}`}>
        <span className="h-0.5 w-12 rounded-full bg-[#D4AF65]" />
      </div>

      {subtitle && (
        <p className={`mt-3.5 text-sm leading-relaxed sm:text-base ${
          isLightSurface ? 'text-[#343D4F]' : 'text-[#B0BECE]'
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
