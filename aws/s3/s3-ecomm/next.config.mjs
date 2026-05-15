/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "do1vbrd2aouom.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
