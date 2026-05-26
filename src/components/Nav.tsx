import Link from 'next/link'
import { MowloLogo } from './MowloLogo'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:5173'

export function Nav() {
  return (
    <nav>
      <Link href="/" className="logo">
        <MowloLogo size={32} />
        <span className="logo-text">Mowlo</span>
      </Link>

      <div className="nav-links">
        <a href="#products">Products</a>
        <a href="#packs">Brand Packs</a>
        <a href="#how">How it works</a>
        <a href="#popup">Pop-up kit</a>
        <Link href="/partners">Print partners</Link>
      </div>

      <div className="nav-right">
        <a href={`${APP_URL}/auth/login`} className="btn-g">Sign in</a>
        <a href={`${APP_URL}/auth/register`} className="btn-a">Get started</a>
      </div>
    </nav>
  )
}
