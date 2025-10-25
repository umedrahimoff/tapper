/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable dev overlay
  devIndicators: {
    buildActivity: false,
  },
  // Disable dev toolbar completely
  experimental: {
    devToolbar: false,
  }
}

module.exports = nextConfig
