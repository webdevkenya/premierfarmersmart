/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['loremflickr.com'],
	},
};

const { withSuperjson } = require('next-superjson');
module.exports = withSuperjson()(nextConfig);
