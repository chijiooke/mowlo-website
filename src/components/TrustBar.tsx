const items = [
  'Express delivery',
  'No minimum order',
  'AI-powered design',
  'WhatsApp approvals',
  'Reorder in one tap',
]

export function TrustBar() {
  return (
    <div className="trust">
      {items.map(item => (
        <div key={item} className="trust-item">
          <div className="tdot" />
          {item}
        </div>
      ))}
    </div>
  )
}
