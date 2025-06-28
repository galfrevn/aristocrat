import type { Layout } from '@/types/layout';

interface AristocratAuthLayoutProps extends Layout {}

export default function AristocratAuthLayout(props: AristocratAuthLayoutProps) {
	const { children } = props;

	return (
		<div className="flex min-h-screen items-center justify-center">
			{children}
		</div>
	);
};
