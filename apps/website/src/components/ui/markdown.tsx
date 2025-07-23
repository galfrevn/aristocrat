import { MarkdownHooks } from 'react-markdown';
import EnableCodeFragments from 'rehype-starry-night';
import { cn } from '@/lib/utils';

interface MarkdownProps {
	content: string;
	className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
	return (
		<div
			className={cn(
				'prose prose-sm dark:prose-invert max-w-none',
				'prose-headings:font-semibold prose-headings:text-foreground',
				'prose-p:text-foreground prose-p:leading-relaxed',
				'prose-strong:font-semibold prose-strong:text-foreground',
				'prose-em:text-foreground',
				'prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-foreground prose-code:text-sm',
				'prose-pre:border prose-pre:bg-muted prose-pre:text-foreground',
				'prose-blockquote:border-l-border prose-blockquote:text-muted-foreground',
				'prose-ol:text-foreground prose-ul:text-foreground',
				'prose-li:text-foreground',
				'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
				className,
			)}
		>
			<MarkdownHooks
				rehypePlugins={[EnableCodeFragments]}
				components={contentRootMarkdownComponents}
			>
				{content}
			</MarkdownHooks>
		</div>
	);
}

type MarkdownComponentProps = {
	heading: React.HTMLProps<HTMLHeadingElement>;
	paragraph: React.HTMLProps<HTMLParagraphElement>;
	ul: React.HTMLProps<HTMLUListElement>;
	ol: React.OlHTMLAttributes<HTMLOListElement>;
	hr: React.HTMLProps<HTMLHRElement>;
	code: React.HTMLProps<HTMLPreElement>;
};

const contentRootMarkdownComponents = {
	h2: (props: MarkdownComponentProps['heading']) => (
		<h2 className="my-6 font-semibold text-lg" {...props} />
	),
	p: (props: MarkdownComponentProps['paragraph']) => (
		<p className="my-2 text-base text-muted-foreground" {...props} />
	),
	ul: (props: MarkdownComponentProps['ul']) => (
		<ul className="my-4 list-disc pl-6 text-base" {...props} />
	),
	ol: (props: MarkdownComponentProps['ol']) => (
		<ol className="my-2 list-decimal pl-6 text-base" {...props} />
	),
	hr: (props: MarkdownComponentProps['hr']) => (
		<hr className="my-6 border-muted border-t" {...props} />
	),
	pre: (props: MarkdownComponentProps['code']) => (
		<pre
			className="no-scrollbar my-2 overflow-y-hidden overflow-x-scroll rounded-lg border bg-muted/50 p-6"
			{...props}
		/>
	),
};
