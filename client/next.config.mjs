/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "http",
        hostname: "*",
      },
    ],
  },
  api: {
    bodyParser: {
      sizeLimit: "100mb", // Increase this according to your needs
    },
  },
  reactStrictMode: false,
};

export default nextConfig;
