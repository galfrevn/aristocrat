'use client';

import { motion } from 'motion/react';

import { AristocratIcons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { AristocratCommunityPostCard } from './components/post-card';

import useFeedPosts from './hooks/useFeedPosts';
import type { PostType } from './types';

export const AristocratCommunityFeed = () => {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useFeedPosts();

	const posts = data?.pages.flatMap((page) => page.data) ?? [];

	return (
		<section
			aria-labelledby="feed-comunidad-titulo"
			className="w-full"
			role="feed"
		>
			<header className="flex items-center gap-2">
				<AristocratIcons.Chat className="size-5" aria-hidden="true" />
				<h2 id="feed-comunidad-titulo" className="font-medium text-lg">
					Feed de la Comunidad
				</h2>
			</header>

			<ul className="flex flex-col gap-6 pt-6">
				{posts.length === 0 ? (
					<li className="py-8 text-center text-muted-foreground">
						No hay publicaciones en la comunidad por el momento.
					</li>
				) : (
					posts.map((post, index) => (
						<motion.li
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								type: 'spring',
								delay: index * 0.2,
								duration: 1,
							}}
							key={post.id}
						>
							<AristocratCommunityPostCard
								{...post}
								type={post.type as PostType}
							/>
						</motion.li>
					))
				)}
			</ul>

			{hasNextPage ? (
				<Button
					onClick={() => fetchNextPage()}
					disabled={isFetchingNextPage}
					variant="outline"
					size="lg"
					className="mt-6 w-full"
					aria-label="Cargar más publicaciones del feed"
				>
					Cargar más publicaciones
				</Button>
			) : (
				<Button
					variant="default"
					size="lg"
					className="mt-6 w-full"
					aria-label="Crear una nueva publicación"
				>
					Crea una publicación
				</Button>
			)}
		</section>
	);
};
