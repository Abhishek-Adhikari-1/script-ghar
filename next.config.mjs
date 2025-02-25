/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
      },
    ],
  },
};

export default nextConfig;

// https://files.edgestore.dev/ve4yczdyei2hu7qz/myProfileImages/_public/user/profile/045ecd9b-b03c-4b7e-92a5-4a5792781ff1.jpg
