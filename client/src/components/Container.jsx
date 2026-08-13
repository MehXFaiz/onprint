export default function Container({ as: Tag = 'div', className = '', children }) {
  return <Tag className={`mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12 ${className}`}>{children}</Tag>
}
