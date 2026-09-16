import clsx from 'clsx'

/** Section label. The only uppercase body text on the site. */
export function Eyebrow({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={clsx('inline-block font-body text-eyebrow uppercase', className)}>{children}</span>
}

/**
 * Mega display type — condensed, uppercase, one per viewport. Decorative ghost
 * words should pass `aria-hidden` and a low-contrast colour.
 */
export function Mega({
  as: Tag = 'span',
  className,
  children,
  ...rest
}: {
  as?: 'span' | 'h1' | 'h2' | 'p'
  className?: string
  children: React.ReactNode
} & React.AriaAttributes) {
  return (
    <Tag className={clsx('block font-display text-mega font-condensed uppercase', className)} {...rest}>
      {children}
    </Tag>
  )
}
