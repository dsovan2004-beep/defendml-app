/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true } // keeps next/image happy on static export
};

module.exports = nextConfig;
