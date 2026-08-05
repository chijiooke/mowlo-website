import { cardVars, type Product } from './products'

/**
 * The card face itself — identical in the desktop fan and the phone deck.
 * Everything that differs between the two (stacking, reachability, gestures)
 * belongs to the deck around it, not in here.
 */
export function ProductCard({ product: p, onOpen }: { product: Product; onOpen: () => void }) {
  return (
    <button
      type="button"
      className={`prod-card${p.light ? ' is-light' : ''}`}
      onClick={onOpen}
      style={cardVars(p)}
    >
      <div>
        <div className="card-name">{p.name}</div>
        <div className="card-spec">{p.spec}</div>
        {p.soon && <div className="card-p cs">Coming soon</div>}
      </div>
      <p.Blob />
    </button>
  )
}
