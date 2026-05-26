export function MowloLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 6C58 4 72 14 76 30C80 46 72 64 56 72C40 80 22 74 12 60C2 46 4 26 14 16C24 6 22 8 40 6Z" fill="#F5A623" />
      <circle cx="29" cy="34" r="9" fill="white" opacity="0.95" />
      <circle cx="51" cy="34" r="9" fill="white" opacity="0.95" />
      <circle cx="30" cy="33" r="4.5" fill="#0E0E0F" />
      <circle cx="52" cy="33" r="4.5" fill="#0E0E0F" />
      <circle cx="32" cy="31" r="1.8" fill="white" />
      <circle cx="54" cy="31" r="1.8" fill="white" />
      <path d="M28 50Q40 60 52 50" stroke="#0E0E0F" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  )
}
