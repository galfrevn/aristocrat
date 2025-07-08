import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [new URL('https://avatar.iran.liara.run/public/**')],
	},
};

export default nextConfig;
