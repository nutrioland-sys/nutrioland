/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // The admin panel lets you paste any hosted image URL for a
        // product photo, not just Unsplash, so this allows any HTTPS host.
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
