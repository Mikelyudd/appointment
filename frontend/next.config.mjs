/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    autoStaticOptimization: false,
    serverComponents: false,
    serverActions: false
  }
}

export default nextConfig
