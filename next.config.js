/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  sassOptions: {
    includePaths: ['./styles', './resources/scss'],
  },
}

module.exports = nextConfig

