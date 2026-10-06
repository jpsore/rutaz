import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF pesa menos en 4G (LCP < 2.5 s en el navegador de TikTok).
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
  },
};

export default nextConfig;
