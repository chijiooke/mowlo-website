import clsx from 'clsx'

/** The page measure: 1320px wide, with gutters that scale with the viewport. */
export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx('mx-auto w-full max-w-page px-gutter', className)}>{children}</div>
}
