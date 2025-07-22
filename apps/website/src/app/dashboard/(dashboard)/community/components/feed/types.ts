export type PostType = 'Pregunta' | 'Reseña' | 'Celebracion';

export interface CommunityPost {
	id: number;
	name: string;
	avatar: string;
	type: PostType;
	description: string;
	tags: string[];
	hours: number;
	likes: number;
	comments: number;
}
