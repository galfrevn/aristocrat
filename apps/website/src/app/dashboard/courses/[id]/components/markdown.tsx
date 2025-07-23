import { memo } from 'react';

import '@wooorm/starry-night/style/light';
import type { Lesson } from '@aristocrat/database/schema';

import { MarkdownHooks } from 'react-markdown';

import EnableCodeFragments from 'rehype-starry-night';
import EnableTables from 'remark-gfm';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface ContentRootMarkdownProps {
	content: Lesson['content'];
	type?: 'body' | 'concept';
}

export const ContentRootMarkdown = memo((props: ContentRootMarkdownProps) => {
	const { content, type = 'body' } = props;

	return (
		<MarkdownHooks
			rehypePlugins={[EnableCodeFragments, EnableTables]}
			components={getContentRootMarkdownComponents(type)}
		>
			{content}
		</MarkdownHooks>
	);
});

type MarkdownComponentProps = {
	heading: React.HTMLProps<HTMLHeadingElement>;
	paragraph: React.HTMLProps<HTMLParagraphElement>;
	ul: React.HTMLProps<HTMLUListElement>;
	li: React.HTMLProps<HTMLLIElement>;
	ol: React.OlHTMLAttributes<HTMLOListElement>;
	hr: React.HTMLProps<HTMLHRElement>;
	code: React.HTMLProps<HTMLPreElement>;
	table: React.HTMLProps<HTMLTableElement>;
	tableBody: React.HTMLProps<HTMLTableSectionElement>;
	tableCell: React.HTMLProps<HTMLTableCellElement>;
	tableHeader: React.HTMLProps<HTMLTableSectionElement>;
	tableHead: React.HTMLProps<HTMLTableHeaderCellElement>;
	tableRow: React.HTMLProps<HTMLTableRowElement>;
};

const getContentRootMarkdownComponents = (
	x: ContentRootMarkdownProps['type'],
) => ({
	h2: (props: MarkdownComponentProps['heading']) => (
		<h2
			className={`${x === 'body' ? 'my-6' : 'text-sm'} font-semibold text-lg`}
			{...props}
		/>
	),
	p: (props: MarkdownComponentProps['paragraph']) => (
		<p
			className={`${x === 'concept' ? 'text-sm' : ''} my-2 text-base text-muted-foreground`}
			{...props}
		/>
	),
	ul: (props: MarkdownComponentProps['ul']) => (
		<ul
			className={`${x === 'concept' ? 'text-sm' : ''} my-4 list-disc pl-6 text-base`}
			{...props}
		/>
	),
	ol: (props: MarkdownComponentProps['ol']) => (
		<ol className="my-2 list-decimal pl-6 text-base" {...props} />
	),
	li: (props: MarkdownComponentProps['li']) => (
		<li className="my-2 text-muted-foreground text-sm" {...props} />
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
	code: (props: MarkdownComponentProps['code']) => (
		<code className="rounded-sm border bg-muted/50 px-1" {...props} />
	),
	table: (props: MarkdownComponentProps['table']) => (
		<Table {...props} className={cn(props.className, 'my-4 w-full border')} />
	),
	thead: (props: MarkdownComponentProps['tableHeader']) => (
		<TableHeader {...props} />
	),
	tbody: (props: MarkdownComponentProps['tableBody']) => (
		<TableBody {...props} />
	),
	tr: (props: MarkdownComponentProps['tableRow']) => <TableRow {...props} />,
	td: (props: MarkdownComponentProps['tableCell']) => <TableCell {...props} />,
	th: (props: MarkdownComponentProps['tableHead']) => <TableHead {...props} />,
});
