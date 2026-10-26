import clsx from 'clsx'

/**
 * A word or two of flowing script inside a sans headline, for drama. Script
 * reads small and light next to a heavy sans, so it's set larger and bold,
 * nudged down onto the sans's baseline, and given a hair of room either side
 * so its entry and exit strokes don't touch the words next to it. Amber on ink; on
 * cream pass `text-ink`. At most one accent per headline phrase — it's a
 * highlight, not a style.
 */
export function Accent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <em className={clsx('relative top-[0.04em] mx-[0.06em] font-accent text-[1.24em] leading-[0.8] font-bold tracking-normal not-italic', className ?? 'text-amber')}>{children}</em>
  )
}
