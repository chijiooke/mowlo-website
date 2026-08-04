/**
 * Scrolling trust marquee. Also carries the proofing and AI proof points that
 * used to have sections of their own.
 */
const ITEMS = [
  '24hr Lagos delivery',
  'AI brand kit in minutes',
  'One-tap proof approval',
  'Order 25 or 500 — your call',
  'One-tap reorder',
  'Your brand profile, saved forever',
  'No designer. No Computer Village. No wahala.',
  '3 social flyers, ready to post',
]

export function TrustBar() {
  return (
    <div className="marquee">
      {/* The list is rendered twice so the -50% translation loops seamlessly. */}
      <div className="marquee-track">
        {[0, 1].map(copy => (
          <div key={copy} className="flex" aria-hidden={copy === 1}>
            {ITEMS.map(item => (
              <span key={item} className="marquee-item">
                <span className="tdot" />
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
