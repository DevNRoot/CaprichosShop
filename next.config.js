/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, 

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "sistemanegocio-backend-production.up.railway.app",
      },
    ],
  },
};

export default nextConfig;