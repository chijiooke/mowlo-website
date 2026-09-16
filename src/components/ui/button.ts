/**
 * Button looks, as class strings, for <button>, <a> and <Link> alike.
 * One amber button per decision — pair `primary` with `ghost`, never two primaries.
 */
const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-body text-base transition duration-150 ease-out-expo active:scale-[0.97] cursor-pointer'

export const button = {
  /** Amber on any ground. Text on amber is always ink. */
  primary: `${base} bg-amber font-bold text-ink shadow-[0_0_44px_rgba(245,166,35,0.3)] hover:-translate-y-0.5 hover:bg-amber-hi`,
  /** For ink grounds. */
  ghost: `${base} border border-bone/15 bg-bone/5 font-semibold text-bone hover:bg-bone/10`,
  /** For cream and amber grounds. */
  ink: `${base} bg-ink font-bold text-bone shadow-[0_12px_30px_rgba(10,10,11,0.26)] hover:-translate-y-0.5 hover:bg-ink-3`,
}
