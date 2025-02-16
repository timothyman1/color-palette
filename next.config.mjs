/** @type {import('next').NextConfig} */
const nextConfig = {
  // (Optional) Export as a standalone site
  // See https://nextjs.org/docs/pages/api-reference/next-config-js/output#automatically-copying-traced-files
  output: "export", // Feel free to modify/remove this option
  env: {
    HF_TOKEN: process.env.HF_TOKEN,
  },
};

export default nextConfig;
