/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Unit photos in the sample data are hosted on vacationrentalslbi.com.
    // Replace with owned/licensed photography (and your own hosts) in production.
    remotePatterns: [
      { protocol: "https", hostname: "www.vacationrentalslbi.com" },
      { protocol: "https", hostname: "vacationrentalslbi.com" },
    ],
  },
};

export default nextConfig;
