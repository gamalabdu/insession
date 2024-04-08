/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "jdpxivbijcijxgtkwlfc.supabase.co",
      },
      {
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
