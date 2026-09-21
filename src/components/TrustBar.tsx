/**
 * Scrolling trust marquee. Also carries the AI points that used to have
 * sections of their own.
 */
const ITEMS = [
  '24hr Lagos delivery',
  'AI brand kit in minutes',
  'Order 25 or 500 — your call',
  'One-tap reorder',
  'Your brand profile, saved for next time',
  'No designer. No Computer Village. No wahala.',
  'Social flyers, ready to post',
]

/**
 * Yellow paper tape: amber stock, tilted a touch and running past both edges,
 * so it reads as a strip laid across the page rather than a bar.
 */
const TAPE: React.CSSProperties = {
  backgroundColor: '#F5A623',
  // Inline, because .marquee's own padding would otherwise leave a bare yellow
  // band above and below the paper: the stock rides on the track inside it.
  padding: 0,
  maskImage: 'none',
  WebkitMaskImage: 'none',
  border: 'none',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.12), 0 14px 30px rgba(0,0,0,0.45)',
}

/**
 * The paper itself rides on the moving track, not on the tape behind it, so the
 * creases travel with the words. Left on the tape they sat still while the type
 * slid over them, which read as type on a flat yellow bar.
 */
const STOCK: React.CSSProperties = {
  backgroundImage: "url('/assets/paper-crumpled.jpg'), url('/assets/paper-crumpled.jpg')",
  backgroundSize: '900px 100%',
  backgroundRepeat: 'repeat-x',
  backgroundPosition: 'left center',
  // Between the two copies, then over the amber underneath: the creases darken
  // the yellow instead of covering it, the way the hero's letters are printed.
  backgroundBlendMode: 'multiply',
  mixBlendMode: 'multiply',
  padding: '17px 0',
}

export function TrustBar() {
  return (
    <div className="overflow-hidden bg-ink py-9">
      <div className="marquee -mx-[2%] w-[104%] -rotate-[1.6deg]" style={TAPE}>
        {/* The list is rendered twice so the -50% translation loops seamlessly. */}
        <div className="marquee-track" style={STOCK}>
          {[0, 1].map(copy => (
            <div key={copy} className="flex" aria-hidden={copy === 1}>
              {ITEMS.map(item => (
                <span key={item} className="marquee-item text-[17px]! font-extrabold! text-ink!">
                  <span aria-hidden="true" className="text-[13px] leading-none">
                    ✦
                  </span>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
