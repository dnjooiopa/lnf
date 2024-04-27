/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: `${process.env.API_ENDPOINT}/:path*`,
        },
      ],
    }
  },
}

export default nextConfig
