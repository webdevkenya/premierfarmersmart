/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if your project has type errors.
		ignoreBuildErrors: true,
	},
};

const { withSuperjson } = require('next-superjson');
module.exports = withSuperjson()(nextConfig);
