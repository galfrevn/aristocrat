import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			new URL('https://avatar.iran.liara.run/public/**'),
			new URL('https://i.ytimg.com/**'),
			// #TODO: Add Aristocrat CDN
		],
	},
};

export default nextConfig;
