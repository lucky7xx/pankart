/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "encrypted-tbn0.gstatic.com"],
  },
  output: "standalone", // Enable standalone output
};

export default nextConfig;
