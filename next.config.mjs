/** @type {import('next').NextConfig} */
const nextConfig = {
    // (Optional) Export as a standalone site
    // See https://nextjs.org/docs/pages/api-reference/next-config-js/output#automatically-copying-traced-files
    output: 'standalone', // Feel free to modify/remove this option

    // Indicate that these packages should not be bundled by webpack
    serverExternalPackages: ['sharp', 'onnxruntime-node'],
    // serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],

};

export default nextConfig;