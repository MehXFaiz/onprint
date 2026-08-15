import React from 'react'

export default function Container({ as: Tag = 'div', className = '', children }) {
  const Component = (typeof Tag === 'string' && Tag.trim()) || typeof Tag === 'function' || (typeof Tag === 'object' && Tag !== null && Tag.$$typeof) ? Tag : 'div'
  return <Component className={`mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12 ${className}`}>{children}</Component>
}

