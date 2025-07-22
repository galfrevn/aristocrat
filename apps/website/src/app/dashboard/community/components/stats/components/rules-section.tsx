import { motion } from 'framer-motion';

export const AristocratCommunityRulesSection = () => {
	return (
		<motion.section
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				type: 'spring',
				delay: 0.2,
				duration: 1,
			}}
			aria-labelledby="community-rules-title"
			aria-describedby="community-rules-desc"
		>
			<header className="mb-4 flex items-center gap-2">
				<h3 id="community-rules-title" className="font-medium text-lg">
					Normas de la Comunidad
				</h3>
			</header>
			<p id="community-rules-desc" className="sr-only">
				Lista de normas para la participación segura y respetuosa en la
				comunidad.
			</p>
			<dl className="space-y-4">
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						type: 'spring',
						delay: 0.4,
						duration: 1,
					}}
				>
					<dt className="font-semibold">Sé respetuoso</dt>
					<dd className="text-muted-foreground text-sm">
						Respeta a todos los miembros.
					</dd>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						type: 'spring',
						delay: 0.6,
						duration: 1,
					}}
				>
					<dt className="font-semibold">Mantén el tema</dt>
					<dd className="text-muted-foreground text-sm">
						Publica solo sobre aprendizaje.
					</dd>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						type: 'spring',
						delay: 0.8,
						duration: 1,
					}}
				>
					<dt className="font-semibold">No spam</dt>
					<dd className="text-muted-foreground text-sm">
						Evita mensajes repetidos o promocionales.
					</dd>
				</motion.div>
			</dl>
		</motion.section>
	);
};
