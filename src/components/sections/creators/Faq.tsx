import { Chapter } from '@/components/layout/Chapter'
import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/Reveal'
import { Accent } from '@/components/type/Accent'
import { Eyebrow } from '@/components/type/Type'
import { MERCH, MERCH_ORDER } from '@/lib/merch'

/** The catalogue as a list: "Tees, Mugs, Stickers, …". */
const LINE = MERCH_ORDER.map(id => MERCH[id].name).join(', ')

/**
 * Only what is decided. No prices, markup share (Q1), window bounds (Q3) or
 * identity checks (Q13) until they are settled.
 */
const QUESTIONS = [
  {
    q: 'Do I need to buy stock?',
    a: 'No. You pick items from our catalogue and we hold the blank stock with our print partners. Nothing is printed until your drop closes, and then only what sold.',
  },
  {
    q: 'What does it cost me?',
    a: 'Nothing up front. You set the price for each item; production comes out of each sale, and you earn on everything above it.',
  },
  {
    q: 'What can I sell?',
    a: `${LINE}. Upload one print file per item, and mockups if you have them.`,
  },
  {
    q: 'How long is a drop open?',
    a: 'You choose when orders open and close when you set up the drop. It also closes early if it sells out.',
  },
  {
    q: 'When do I get paid?',
    a: 'In two parts per drop: half of what you earned when the drop closes, and the rest once every order has been delivered.',
  },
  {
    q: 'Who packs and delivers?',
    a: 'We do, to every buyer. If you’d rather pack and hand the drop out yourself, you can choose that when you set it up — your buyers see it before they pay.',
  },
  {
    q: 'Who can apply?',
    a: 'Creators with an audience. Apply with your social handles and we review every application before you can open a drop.',
  },
  {
    q: 'Can I sell art prints too?',
    a: 'Yes, in Artist’s Corner. One account can run both: choose either or both when you apply.',
  },
]

/** Chapter — questions, on ink-2 so it parts from the closing CTA on ink. Native disclosure, so it works without JavaScript. */
export function Faq() {
  return (
    <Chapter ground="ink-2" id="faq" className="py-section">
      <Container>
        <div className="grid gap-12 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-4">
            <Eyebrow className="mb-5 text-amber">FAQ</Eyebrow>
            <h2 className="font-display text-poster leading-[1] font-condensed text-bone">
              <span className="block">Asked</span>{' '}
              <span className="block">
                <Accent className="text-amber">a lot.</Accent>
              </span>
            </h2>
          </Reveal>

          <ul className="flex flex-col md:col-span-8">
            {QUESTIONS.map(({ q, a }) => (
              <li key={q} className="border-b border-bone/10 first:border-t">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-semibold text-bone marker:hidden md:text-xl [&::-webkit-details-marker]:hidden">
                    {q}
                    <span
                      aria-hidden="true"
                      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-bone/15 text-amber transition-transform duration-300 ease-out-expo group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-[40rem] pb-6 text-base leading-relaxed text-bone/65">{a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Chapter>
  )
}
