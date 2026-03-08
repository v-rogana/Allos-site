/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/Allos-site",
  assetPrefix: "/Allos-site/",
  images: { unoptimized: true },
  transpilePackages: ['three'],
};

export default nextConfig;
