/** @type {import('next').NextConfig} */
const isProd = process.env.GITHUB_ACTIONS === 'true';
const basePath = isProd ? '/Allos-site' : '';

const nextConfig = {
  output: "export",
  ...(basePath && { basePath, assetPrefix: `${basePath}/` }),
  images: { unoptimized: true },
  transpilePackages: ['three'],
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
