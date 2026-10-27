import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // The old Artist's Corner gallery; the artists page replaced it.
  async redirects() {
    return [{ source: '/gallery', destination: '/artists', permanent: true }]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}

export default nextConfig
