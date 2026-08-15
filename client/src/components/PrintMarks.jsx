export function CornerMarks({ className = '' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M0 10V0H10" />
      <path d="M30 0H40V10" />
      <path d="M40 30V40H30" />
      <path d="M10 40H0V30" />
    </svg>
  )
}

export function CmykDots({ className = '' }) {
  const colors = ['#000000', '#A82F19', '#FFFFFF', '#000000']
  return (
    <div className={`flex items-center gap-1.5 ${className}`} aria-hidden="true">
      {colors.map((color, idx) => (
        <span key={idx} className="h-1.5 w-1.5 rounded-full border border-white/20" style={{ backgroundColor: color }} />
      ))}
    </div>
  )
}

export function RegistrationMark({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="16" cy="16" r="10" />
      <path d="M16 0v32M0 16h32" />
    </svg>
  )
}
