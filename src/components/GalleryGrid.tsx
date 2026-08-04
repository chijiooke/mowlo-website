'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { CATEGORIES, type Category, type GalleryItem, type GalleryPage } from '@/lib/gallery'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:5173'

interface Props {
  initial: GalleryPage
}

/** Column count by viewport width — widest match wins. */
const BREAKPOINTS: [minWidth: number, columns: number][] = [
  [1000, 4],
  [640, 3],
  [0, 2],
]

function useColumnCount() {
  const [columns, setColumns] = useState(4)

  useEffect(() => {
    const read = () => {
      const width = window.innerWidth
      setColumns(BREAKPOINTS.find(([min]) => width >= min)![1])
    }
    read()
    window.addEventListener('resize', read)
    return () => window.removeEventListener('resize', read)
  }, [])

  return columns
}

/**
 * Pack items into the shortest column, in order. Because earlier items are
 * always placed first, appending a page never reshuffles what is already on
 * screen — the thing CSS `columns` gets wrong for an infinite feed.
 */
function packColumns(items: GalleryItem[], columns: number): GalleryItem[][] {
  const cols: GalleryItem[][] = Array.from({ length: columns }, () => [])
  const heights = new Array<number>(columns).fill(0)

  for (const item of items) {
    const shortest = heights.indexOf(Math.min(...heights))
    cols[shortest].push(item)
    heights[shortest] += 1 / item.ratio // relative height at unit column width
  }
  return cols
}

export function GalleryGrid({ initial }: Props) {
  const [items, setItems] = useState(initial.items)
  const [nextPage, setNextPage] = useState(initial.nextPage)
  const [total, setTotal] = useState(initial.total)
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState<GalleryItem | null>(null)

  const columns = useColumnCount()
  const reduceMotion = useReducedMotion()
  const sentinel = useRef<HTMLDivElement>(null)
  /** Newest request wins — an older response that lands late is discarded. */
  const requestId = useRef(0)
  /** The exact request in flight, so a re-triggered sentinel can't double-append. */
  const inFlightKey = useRef<string | null>(null)

  const load = useCallback(async (page: number, cat: Category | null, replace: boolean) => {
    const key = `${cat ?? 'all'}:${page}`
    if (inFlightKey.current === key) return

    const id = ++requestId.current
    inFlightKey.current = key
    setLoading(true)

    try {
      const query = new URLSearchParams({ page: String(page) })
      if (cat) query.set('category', cat)

      const res = await fetch(`/api/gallery?${query}`)
      if (!res.ok) throw new Error(`Gallery request failed: ${res.status}`)

      const data: GalleryPage = await res.json()
      if (id !== requestId.current) return // superseded by a newer request

      setItems(prev => (replace ? data.items : [...prev, ...data.items]))
      setNextPage(data.nextPage)
      setTotal(data.total)
    } catch (err) {
      console.error(err)
      if (id === requestId.current) setNextPage(null) // stop the observer retrying in a loop
    } finally {
      if (id === requestId.current) {
        inFlightKey.current = null
        setLoading(false)
      }
    }
  }, [])

  const selectCategory = (next: Category | null) => {
    if (next === category) return
    setCategory(next)
    setItems([])
    load(1, next, true)
  }

  // Fetch the next page as the sentinel comes into view.
  useEffect(() => {
    const node = sentinel.current
    if (!node || nextPage === null) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) load(nextPage, category, false)
      },
      { rootMargin: '600px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [nextPage, category, load])

  const cols = useMemo(() => packColumns(items, columns), [items, columns])

  return (
    <>
      <div className="gal-filters" role="group" aria-label="Filter artwork by product">
        <FilterPill label="All work" active={category === null} onClick={() => selectCategory(null)} />
        {CATEGORIES.map(c => (
          <FilterPill key={c} label={c} active={category === c} onClick={() => selectCategory(c)} />
        ))}
      </div>

      <div className="gal-wrap">
        <div className="gal-cols">
          {cols.map((col, i) => (
            <div className="gal-col" key={i}>
              {col.map(item => (
                <motion.button
                  key={item.id}
                  type="button"
                  className="gal-card"
                  style={{ aspectRatio: item.ratio, ['--pk' as string]: `var(--${item.accent})` }}
                  initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setActive(item)}
                  aria-label={`View ${item.title} by ${item.artist}`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1000px) 33vw, 25vw"
                    loading="lazy"
                  />
                  <span className="gal-chip">{item.category}</span>
                  <div className="gal-scrim">
                    <span className="gal-card-title">{item.title}</span>
                    <span className="gal-card-artist">
                      {item.artist} · {item.city}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Sentinel drives the auto-load; the button is the keyboard/no-observer path. */}
      <div ref={sentinel} className="gal-status" aria-live="polite">
        {loading && 'Loading more work…'}
        {!loading && nextPage !== null && (
          <button type="button" className="cs-waitlist" onClick={() => load(nextPage, category, false)}>
            Load more work
          </button>
        )}
        {!loading && nextPage === null && items.length > 0 && (
          <>That&apos;s all {total} pieces{category ? ` in ${category}` : ''}. More drop every week.</>
        )}
        {!loading && items.length === 0 && 'Nothing here yet.'}
      </div>

      <Lightbox item={active} onClose={() => setActive(null)} />
    </>
  )
}

function Lightbox({ item, onClose }: { item: GalleryItem | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!item) return

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label={`${item.title} by ${item.artist}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="lb-panel"
            style={{ ['--pk' as string]: `var(--${item.accent})` }}
            initial={{ scale: 0.94, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 24 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
          >
            <button ref={closeRef} type="button" className="lb-close" onClick={onClose} aria-label="Close">
              <Icon icon="lucide:x" width={20} />
            </button>

            <div className="lb-image" style={{ aspectRatio: item.ratio }}>
              <Image src={item.src} alt={item.alt} fill sizes="(max-width: 900px) 92vw, 640px" priority />
            </div>

            <div className="lb-meta">
              <span className="gal-chip lb-chip">{item.category}</span>
              <h2 className="lb-title">{item.title}</h2>
              <p className="lb-artist">
                {item.artist} <span>{item.handle} · {item.city}</span>
              </p>
              <a href={`${APP_URL}/auth/register`} className="pack-btn lb-cta">
                Print something like this →
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" className="gal-filter" aria-pressed={active} onClick={onClick}>
      {label}
    </button>
  )
}
