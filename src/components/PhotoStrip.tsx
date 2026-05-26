import Image from 'next/image'
import { Stagger, StaggerItem } from './Reveal'

const photos = [
  { src: '/assets/side-hustle.jpg', alt: 'Side hustle to brand', title: 'Side hustle to brand', sub: 'Built from scratch. Looks like millions.' },
  { src: '/assets/delivery-man.jpeg', alt: 'Delivery to your doorstep', title: 'Fast delivery to your doorstep', sub: 'Full kit delivered in 24hrs' },
]

export function PhotoStrip() {
  return (
    <div className="photo-strip">
      <Stagger className="photo-grid">
        {photos.map(p => (
          <StaggerItem key={p.title}>
            <div className="photo-card">
              <Image src={p.src} alt={p.alt} fill sizes="(max-width:680px) 100vw, 33vw" style={{ objectFit: 'cover' }} loading="lazy" />
              <div className="photo-overlay" />
              <div className="photo-label">
                <div className="photo-label-title">{p.title}</div>
                <div className="photo-label-sub">{p.sub}</div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}
