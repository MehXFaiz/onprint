import React from 'react'

export default function Container({ as: Tag = 'div', className = '', children, ...props }) {
  const Component = Tag || 'div'
  return <Component className={`mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12 ${className}`} {...props}>{children}</Component>
}

