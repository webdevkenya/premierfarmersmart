// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs');
const { withAxiom } = require('next-axiom');

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if your project has type errors.
		ignoreBuildErrors: true,
	},
	// Optional build-time configuration options
	sentry: {
		hideSourceMaps: true,

		// See the sections below for information on the following options:
		//   'Configure Source Maps':
		//     - disableServerWebpackPlugin
		//     - disableClientWebpackPlugin
		//     - hideSourceMaps
		//     - widenClientFileUpload
		//   'Configure Legacy Browser Support':
		//     - transpileClientSDK
		//   'Configure Serverside Auto-instrumentation':
		//     - autoInstrumentServerFunctions
		//     - excludeServerRoutes
		//   'Configure Tunneling to avoid Ad-Blockers':
		//     - tunnelRoute
	  },
};

const sentryWebpackPluginOptions = {
	// Additional config options for the Sentry Webpack plugin. Keep in mind that
	// the following options are set automatically, and overriding them is not
	// recommended:
	//   release, url, org, project, authToken, configFile, stripPrefix,
	//   urlPrefix, include, ignore
  
	silent: true, // Suppresses all logs
	// For all available options, see:
	// https://github.com/getsentry/sentry-webpack-plugin#options.
  };

const { withSuperjson } = require('next-superjson');
module.exports = withAxiom(withSuperjson()(nextConfig));

module.exports = withSentryConfig(
  module.exports,
  sentryWebpackPluginOptions
);
