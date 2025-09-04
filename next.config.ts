/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_BASE_API_URL: process.env.REACT_BASE_API_URL,
  } ,
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  images: {
    unoptimized: true,
  },
  output: 'export',

    // API proxy configuration
  // async rewrites() {
  //   console.log(`[Rewrites] Proxying /api/:path* to ${process.env.REACT_APP_API_URL}/api/:path*`);
  //   return [
  //       {
  //           source: "/api/:path*",
  //           destination: `${process.env.REACT_BASE_API_URL}/api/:path*`, // Correct path mapping
  //       },
  //   ];
  // },
  /* config options here */
};

export default nextConfig;
