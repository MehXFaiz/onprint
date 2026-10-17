export default function SectionHeading({ eyebrow, title, subtitle, center = false, tone = 'default', className = '' }) {
  const light = tone === 'light'
  return (
    <div className={`flex flex-col ${center ? 'mx-auto max-w-3xl items-center text-center' : 'max-w-3xl'} ${className}`}>
      {eyebrow && (
        <div className={`mb-3 inline-flex items-center gap-2 rounded-full border border-[#D4AF65] bg-[#FFFFFF] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest ${
          light ? 'border-[#FFFFFF]/30 bg-[#101D35] text-[#FFFFFF]' : 'text-[#D4AF65]'
        }`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF65]" aria-hidden="true" />
          <span>{eyebrow}</span>
        </div>
      )}
      <h2
        className={`font-display text-3xl font-black tracking-tight text-balance sm:text-4xl lg:text-5xl ${
          light ? 'text-[#FFFFFF]' : 'text-[#101D35]'
        }`}
      >
        {title}
      </h2>
      
      {/* Signature Gold Underline Bar */}
      <div className={`mt-3.5 flex items-center gap-1.5 ${center ? 'justify-center' : ''}`}>
        <span className="h-1.5 w-20 rounded-full bg-[#D4AF65]" />
        <span className="h-1.5 w-4 rounded-full bg-[#D4AF65]/10" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF65]/10" />
      </div>

      {subtitle && (
        <p className={`mt-4 text-sm leading-relaxed sm:text-base ${light ? 'text-[#FFFFFF]/75' : 'text-[#343D4F]'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
