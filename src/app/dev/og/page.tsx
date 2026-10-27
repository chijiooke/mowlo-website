import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MowloLogo } from '@/components/MowloLogo'
import { LoveSticker } from '@/components/sections/artists/LoveSticker'

export const metadata: Metadata = { robots: { index: false, follow: false } }

/**
 * The share images, drawn at 1200 × 630 for headless Chrome to shoot into
 * public/ (scripts/og/shoot.sh). `?v=creators` (default) or `?v=artists`.
 * Never served in production.
 */
export default async function OgPage({ searchParams }: { searchParams: Promise<{ v?: string }> }) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { v } = await searchParams
  return (
    <>
      {/* Keep Next's dev badge out of the shot. */}
      <style>{'nextjs-portal { display: none !important; }'}</style>
      {v === 'artists' ? <Artists /> : <Creators />}
    </>
  )
}

function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* On amber the amber mascot would vanish, so it sits on an ink disc there. */}
      {dark ? (
        <span className="flex size-12 items-center justify-center rounded-full bg-ink">
          <MowloLogo size={34} />
        </span>
      ) : (
        <MowloLogo size={44} />
      )}
      <span className={`font-display text-[30px] font-extrabold tracking-[-0.02em] ${dark ? 'text-ink' : 'text-bone'}`}>Mowlo</span>
    </div>
  )
}

/** Creators: the headline on ink beside the bread photo, money-bag sticker on its corner. */
function Creators() {
  return (
    <div className="relative flex h-[630px] w-[1200px] overflow-hidden bg-ink p-14">
      <div className="flex w-[560px] flex-col justify-between">
        <Brand />
        <div>
          <p className="font-body text-[64px] leading-[1.04] font-semibold tracking-[-0.03em] text-bone">
            Drop <span className="text-amber">merch</span> to your <span className="text-amber">audience.</span>
          </p>
          <p className="mt-6 max-w-[30ch] text-[24px] leading-snug text-bone/65">
            No stock, nothing upfront. You set the timer; we print, pack and deliver.
          </p>
        </div>
        <div className="flex gap-3">
          {['Tees', 'Hats', 'Mugs', 'Stickers', 'Framed prints'].map((item, i) => (
            <span
              key={item}
              className={`rounded-full px-4 py-1.5 text-[17px] font-bold text-ink ${['bg-amber', 'bg-pink', 'bg-teal', 'bg-sky', 'bg-lime'][i]}`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="relative ml-auto h-full w-[480px]">
        <div className="relative h-full overflow-hidden rounded-[2rem]">
          <Image src="/assets/creators-bread.jpg" alt="" fill sizes="480px" className="object-cover object-[52%_30%]" priority />
        </div>
        <div className="absolute -top-5 -left-8 size-36 rotate-[-10deg] overflow-hidden rounded-full bg-white shadow-[0_12px_24px_rgba(10,10,11,0.35)] ring-4 ring-white">
          <Image src="/assets/creators-naira-bag.png" alt="" fill sizes="144px" className="scale-[1.18] object-cover object-[50%_52%]" priority />
        </div>
      </div>
    </div>
  )
}

/** Artist's Corner: the landing in miniature — black paper type on amber, the sticker, the pitch. */
function Artists() {
  return (
    <div className="relative flex h-[630px] w-[1200px] flex-col justify-between overflow-hidden bg-amber p-14">
      <Brand dark />
      <div className="flex items-end justify-between">
        <p className="font-display text-[150px] leading-[0.82] font-extrabold tracking-[0.005em] text-ink uppercase font-condensed">
          {['For living', 'artists.'].map(line => (
            <span key={line} className="relative block whitespace-nowrap">
              {line}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[url('/assets/paper-crumpled.jpg')] bg-[length:140%_auto] bg-center bg-clip-text text-transparent opacity-80 mix-blend-screen invert"
              >
                {line}
              </span>
            </span>
          ))}
        </p>
        <div className="flex w-[360px] flex-col items-end gap-6 text-right">
          <div className="rotate-[-10deg] drop-shadow-[0_10px_18px_rgba(10,10,11,0.28)]">
            <LoveSticker className="size-44" />
          </div>
          <p className="text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">
            Fast, free art shops for digital artists.
          </p>
        </div>
      </div>
      <p className="text-[21px] text-ink/70">Framed prints in limited drops. We print, pack and deliver.</p>
    </div>
  )
}
