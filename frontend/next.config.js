/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["localhost", "res.cloudinary.com", "s3.amazonaws.com"],
    },
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
        };
        return config;
    },
};

module.exports = nextConfig;
