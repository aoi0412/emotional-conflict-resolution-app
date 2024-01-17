/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "emotional-conflict-resolution-app.vercel.app"], // 画像を置いているドメイン
  },
};

module.exports = nextConfig;
