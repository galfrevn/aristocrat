import { exec, spawn } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import chalk from 'chalk';
import ora from 'ora';

const execAsync = promisify(exec);

/**
 * Development environment setup and execution script
 * Handles Docker container management, database setup, and development server startup
 * Now includes pgvector support for transcript embedding and vector search
 */
class DevelopmentEnvironment {
	private readonly DATABASE_CONTAINER_NAME = 'aristocrat-development-database';
	private readonly VECTOR_DATABASE_CONTAINER_NAME =
		'aristocrat-vector-database';
	private readonly POSTGRES_DOCKER_IMAGE = 'postgres:16-alpine';
	private readonly VECTOR_POSTGRES_IMAGE = 'pgvector/pgvector:pg16'; // pgvector-enabled image
	private readonly DATABASE_NAME = 'postgres';
	private readonly VECTOR_DATABASE_NAME = 'vector_db';
	private readonly DATABASE_USERNAME = 'postgres';
	private readonly DATABASE_PASSWORD = 'mypassword';
	private readonly DATABASE_HOST_PORT = 5432;
	private readonly VECTOR_DATABASE_HOST_PORT = 5433; // Different port for vector DB
	private readonly PROJECT_ROOT_PATH = join(process.cwd());

	/**
	 * Main execution flow
	 */
	async run(): Promise<void> {
		try {
			console.clear();
			console.log(
				chalk.bgBlack.white.bold(
					' Aristocrat :: Starting development environment ',
				),
			);
			console.log();

			await this.checkSystemRequirements();
			await this.handleDatabaseContainer();
			await this.handleVectorDatabaseContainer();
			await this.waitForDatabase();
			await this.waitForVectorDatabase();
			await this.setupEnvironmentFiles();
			await this.runDatabaseMigrations();
			await this.setupVectorDatabase(); // Setup pgvector and schema
			await this.startDevelopmentServers();

			console.log(
				chalk.green.bold('✅ Development environment setup completed!'),
			);
		} catch (error) {
			console.error(
				chalk.red.bold('❌ Failed to start development environment:'),
				error,
			);
			process.exit(1);
		}
	}

	/**
	 * Check if required system dependencies are available
	 */
	private async checkSystemRequirements(): Promise<void> {
		console.log(chalk.bold('Check system requirements'));

		const systemRequirements = [
			{ command: 'docker --version', toolName: 'Docker' },
			{ command: 'bun --version', toolName: 'Bun' },
		];

		for (let i = 0; i < systemRequirements.length; i++) {
			const { command, toolName } = systemRequirements[i];
			const spinner = ora(chalk.dim(`Checking ${toolName}...`)).start();

			try {
				await execAsync(command);
				spinner.succeed(chalk.green(`${toolName} is available`));
			} catch {
				spinner.fail(
					chalk.red(`${toolName} is not installed or not available in PATH`),
				);
				throw new Error(
					`${toolName} is not installed or not available in PATH`,
				);
			}
		}

		console.log();
	}

	/**
	 * Check if Docker container exists and is running, create/start if needed
	 */
	private async handleDatabaseContainer(): Promise<void> {
		console.log(chalk.bold('Handle main database container'));

		const spinner = ora(chalk.dim('Checking container status...')).start();

		try {
			const containerExists = await this.containerExists(
				this.DATABASE_CONTAINER_NAME,
			);
			const containerIsRunning =
				containerExists &&
				(await this.containerIsRunning(this.DATABASE_CONTAINER_NAME));

			if (!containerExists) {
				spinner.text = chalk.dim(
					`Creating container: ${this.DATABASE_CONTAINER_NAME}...`,
				);
				await this.createContainer();
				spinner.succeed(
					chalk.green(
						`Container ${this.DATABASE_CONTAINER_NAME} created successfully`,
					),
				);
			} else if (!containerIsRunning) {
				spinner.text = chalk.dim(
					` Starting container: ${this.DATABASE_CONTAINER_NAME}...`,
				);
				await this.startContainer(this.DATABASE_CONTAINER_NAME);
				spinner.succeed(
					chalk.green(
						`Container ${this.DATABASE_CONTAINER_NAME} started successfully`,
					),
				);
			} else {
				spinner.succeed(
					chalk.green(
						`Container ${this.DATABASE_CONTAINER_NAME} is already running`,
					),
				);
			}

			console.log();
		} catch (error) {
			spinner.fail(chalk.red('Failed to handle database container'));
			throw error;
		}
	}

	/**
	 * Handle vector database container with pgvector support
	 */
	private async handleVectorDatabaseContainer(): Promise<void> {
		console.log(chalk.bold('Handle vector database container (pgvector)'));

		const spinner = ora(
			chalk.dim('Checking vector database container status...'),
		).start();

		try {
			const containerExists = await this.containerExists(
				this.VECTOR_DATABASE_CONTAINER_NAME,
			);
			const containerIsRunning =
				containerExists &&
				(await this.containerIsRunning(this.VECTOR_DATABASE_CONTAINER_NAME));

			if (!containerExists) {
				spinner.text = chalk.dim(
					`Creating vector container: ${this.VECTOR_DATABASE_CONTAINER_NAME}...`,
				);
				await this.createVectorContainer();
				spinner.succeed(
					chalk.green(
						`Vector container ${this.VECTOR_DATABASE_CONTAINER_NAME} created successfully`,
					),
				);
			} else if (!containerIsRunning) {
				spinner.text = chalk.dim(
					` Starting vector container: ${this.VECTOR_DATABASE_CONTAINER_NAME}...`,
				);
				await this.startContainer(this.VECTOR_DATABASE_CONTAINER_NAME);
				spinner.succeed(
					chalk.green(
						`Vector container ${this.VECTOR_DATABASE_CONTAINER_NAME} started successfully`,
					),
				);
			} else {
				spinner.succeed(
					chalk.green(
						`Vector container ${this.VECTOR_DATABASE_CONTAINER_NAME} is already running`,
					),
				);
			}

			console.log();
		} catch (error) {
			spinner.fail(chalk.red('Failed to handle vector database container'));
			throw error;
		}
	}

	/**
	 * Check if the Docker container exists
	 */
	private async containerExists(containerName: string): Promise<boolean> {
		try {
			const { stdout } = await execAsync(
				`docker ps -a --filter name=${containerName} --format "{{.Names}}"`,
			);
			return stdout.trim() === containerName;
		} catch {
			return false;
		}
	}

	/**
	 * Check if the Docker container is running
	 */
	private async containerIsRunning(containerName: string): Promise<boolean> {
		try {
			const { stdout } = await execAsync(
				`docker ps --filter name=${containerName} --format "{{.Names}}"`,
			);
			return stdout.trim() === containerName;
		} catch {
			return false;
		}
	}

	/**
	 * Create and start a new PostgreSQL Docker container
	 */
	private async createContainer(): Promise<void> {
		const dockerCreateCommand = [
			'docker run -d',
			`--name ${this.DATABASE_CONTAINER_NAME}`,
			`-e POSTGRES_DB=${this.DATABASE_NAME}`,
			`-e POSTGRES_USER=${this.DATABASE_USERNAME}`,
			`-e POSTGRES_PASSWORD=${this.DATABASE_PASSWORD}`,
			`-p ${this.DATABASE_HOST_PORT}:5432`,
			'--restart unless-stopped',
			'-v aristocrat_postgres_data:/var/lib/postgresql/data',
			this.POSTGRES_DOCKER_IMAGE,
		].join(' ');

		try {
			await execAsync(dockerCreateCommand);
		} catch (error) {
			throw new Error(`Failed to create Docker container: ${error}`);
		}
	}

	/**
	 * Create and start a new pgvector-enabled PostgreSQL Docker container
	 */
	private async createVectorContainer(): Promise<void> {
		const dockerCreateCommand = [
			'docker run -d',
			`--name ${this.VECTOR_DATABASE_CONTAINER_NAME}`,
			`-e POSTGRES_DB=${this.VECTOR_DATABASE_NAME}`,
			`-e POSTGRES_USER=${this.DATABASE_USERNAME}`,
			`-e POSTGRES_PASSWORD=${this.DATABASE_PASSWORD}`,
			`-p ${this.VECTOR_DATABASE_HOST_PORT}:5432`,
			'--restart unless-stopped',
			// Optimized settings for vector operations
			'-e POSTGRES_INITDB_ARGS="--data-checksums"',
			'-e POSTGRES_HOST_AUTH_METHOD=md5',
			'-v aristocrat_vector_postgres_data:/var/lib/postgresql/data',
			this.VECTOR_POSTGRES_IMAGE,
			// PostgreSQL configuration as command arguments
			'postgres',
			'-c shared_preload_libraries=vector',
			'-c max_connections=200',
			'-c shared_buffers=256MB',
			'-c effective_cache_size=1GB',
			'-c maintenance_work_mem=256MB',
			'-c random_page_cost=1.1',
			'-c effective_io_concurrency=200',
		].join(' ');

		try {
			await execAsync(dockerCreateCommand);
		} catch (error) {
			throw new Error(`Failed to create vector Docker container: ${error}`);
		}
	}

	/**
	 * Start an existing Docker container
	 */
	private async startContainer(containerName: string): Promise<void> {
		try {
			await execAsync(`docker start ${containerName}`);
		} catch (error) {
			throw new Error(`Failed to start Docker container: ${error}`);
		}
	}

	/**
	 * Wait for the database to be ready to accept connections
	 */
	private async waitForDatabase(): Promise<void> {
		console.log(chalk.bold('Wait for main database'));

		const spinner = ora(
			chalk.dim('Waiting for main database to be ready...'),
		).start();

		const maxConnectionAttempts = 30;
		const retryDelayMs = 1000;

		try {
			for (
				let currentAttempt = 1;
				currentAttempt <= maxConnectionAttempts;
				currentAttempt++
			) {
				try {
					await execAsync(
						`docker exec ${this.DATABASE_CONTAINER_NAME} pg_isready -U ${this.DATABASE_USERNAME} -d ${this.DATABASE_NAME}`,
					);
					spinner.succeed(chalk.green('Main database is ready'));
					console.log();
					return;
				} catch {
					if (currentAttempt === maxConnectionAttempts) {
						spinner.fail(
							chalk.red(
								'Main database failed to become ready within timeout period',
							),
						);
						throw new Error(
							'Main database failed to become ready within timeout period',
						);
					}

					spinner.text = chalk.dim(
						`Waiting for main database... (attempt ${currentAttempt}/${maxConnectionAttempts})`,
					);
					await this.sleep(retryDelayMs);
				}
			}
		} catch (error) {
			spinner.fail(chalk.red('Main database connection failed'));
			throw error;
		}
	}

	/**
	 * Wait for the vector database to be ready to accept connections
	 */
	private async waitForVectorDatabase(): Promise<void> {
		console.log(chalk.bold('Wait for vector database'));

		const spinner = ora(
			chalk.dim('Waiting for vector database to be ready...'),
		).start();

		const maxConnectionAttempts = 30;
		const retryDelayMs = 1000;

		try {
			for (
				let currentAttempt = 1;
				currentAttempt <= maxConnectionAttempts;
				currentAttempt++
			) {
				try {
					await execAsync(
						`docker exec ${this.VECTOR_DATABASE_CONTAINER_NAME} pg_isready -U ${this.DATABASE_USERNAME} -d ${this.VECTOR_DATABASE_NAME}`,
					);
					spinner.succeed(chalk.green('Vector database is ready'));
					console.log();
					return;
				} catch {
					if (currentAttempt === maxConnectionAttempts) {
						spinner.fail(
							chalk.red(
								'Vector database failed to become ready within timeout period',
							),
						);
						throw new Error(
							'Vector database failed to become ready within timeout period',
						);
					}

					spinner.text = chalk.dim(
						`Waiting for vector database... (attempt ${currentAttempt}/${maxConnectionAttempts})`,
					);
					await this.sleep(retryDelayMs);
				}
			}
		} catch (error) {
			spinner.fail(chalk.red('Vector database connection failed'));
			throw error;
		}
	}

	/**
	 * Setup environment files for database package
	 */
	private async setupEnvironmentFiles(): Promise<void> {
		console.log(chalk.bold('Setup environment files'));

		const spinner = ora(chalk.dim('Creating environment files...')).start();

		const databaseUrl = `postgres://${this.DATABASE_USERNAME}:${this.DATABASE_PASSWORD}@localhost:${this.DATABASE_HOST_PORT}/${this.DATABASE_NAME}`;
		const vectorDatabaseUrl = `postgres://${this.DATABASE_USERNAME}:${this.DATABASE_PASSWORD}@localhost:${this.VECTOR_DATABASE_HOST_PORT}/${this.VECTOR_DATABASE_NAME}`;

		const environmentContent = `
			DATABASE_URL=${databaseUrl}
			VECTOR_DATABASE_URL=${vectorDatabaseUrl}
		`;

		try {
			// Create .env file for database package
			const databaseEnvPath = join(
				this.PROJECT_ROOT_PATH,
				'packages',
				'database',
				'.env',
			);
			writeFileSync(databaseEnvPath, environmentContent);

			// Create .env file for server app if it doesn't exist
			const serverEnvPath = join(
				this.PROJECT_ROOT_PATH,
				'apps',
				'server',
				'.env',
			);
			if (!existsSync(serverEnvPath)) {
				writeFileSync(serverEnvPath, environmentContent);
			}

			// Create .env file for workers app
			const workersEnvPath = join(
				this.PROJECT_ROOT_PATH,
				'apps',
				'workers',
				'.env',
			);
			if (!existsSync(workersEnvPath)) {
				writeFileSync(workersEnvPath, environmentContent);
			}

			spinner.succeed(chalk.green('Environment files created successfully'));
		} catch (error) {
			spinner.fail(chalk.red('Failed to create environment files'));
			throw error;
		}

		console.log();
	}

	/**
	 * Run database migrations if needed
	 */
	private async runDatabaseMigrations(): Promise<void> {
		console.log(chalk.bold('Database migrations'));

		const spinner = ora(chalk.dim('Checking database migrations...')).start();

		try {
			spinner.text = chalk.dim('Updating database schema...');
			// Use the database package for migrations
			await execAsync('cd packages/database && bun run db:push', {
				cwd: this.PROJECT_ROOT_PATH,
				env: { ...process.env, NODE_ENV: 'development' },
			});
			spinner.succeed(chalk.green('Database schema is up to date'));
		} catch (error) {
			spinner.warn(chalk.yellow(`Failed to update database schema: ${error}`));
		}

		console.log();
	}

	/**
	 * Setup vector database with pgvector extension and optimized schema
	 */
	private async setupVectorDatabase(): Promise<void> {
		console.log(chalk.bold('Setup vector database (pgvector)'));

		const spinner = ora(chalk.dim('Setting up pgvector extension...')).start();

		try {
			// Enable pgvector extension
			spinner.text = chalk.dim('Enabling pgvector extension...');
			await execAsync(
				`docker exec ${this.VECTOR_DATABASE_CONTAINER_NAME} psql -U ${this.DATABASE_USERNAME} -d ${this.VECTOR_DATABASE_NAME} -c "CREATE EXTENSION IF NOT EXISTS vector;"`,
			);

			// Create transcript chunks table with vector support
			spinner.text = chalk.dim('Creating transcript chunks table...');
			const createTableSQL = `
				CREATE TABLE IF NOT EXISTS transcript_chunks (
					id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
					transcript_id UUID NOT NULL,
					chunk_index INTEGER NOT NULL,
					content TEXT NOT NULL,
					embedding vector(1536),
					metadata JSONB,
					start_time INTERVAL,
					end_time INTERVAL,
					duration INTERVAL,
					topic_keywords TEXT[],
					created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
					updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
				);
			`;

			await execAsync(
				`docker exec ${this.VECTOR_DATABASE_CONTAINER_NAME} psql -U ${this.DATABASE_USERNAME} -d ${this.VECTOR_DATABASE_NAME} -c "${createTableSQL.replace(/\n\s+/g, ' ').replace(/\s+/g, ' ').trim()}"`,
			);

			// Create optimized indexes for vector search
			spinner.text = chalk.dim('Creating vector search indexes...');

			// HNSW index for fast approximate nearest neighbor search
			const createHNSWIndexSQL = `
				CREATE INDEX IF NOT EXISTS transcript_chunks_embedding_hnsw_idx 
				ON transcript_chunks 
				USING hnsw (embedding vector_cosine_ops) 
				WITH (m = 16, ef_construction = 64);
			`;

			await execAsync(
				`docker exec ${this.VECTOR_DATABASE_CONTAINER_NAME} psql -U ${this.DATABASE_USERNAME} -d ${this.VECTOR_DATABASE_NAME} -c "${createHNSWIndexSQL.replace(/\n\s+/g, ' ').replace(/\s+/g, ' ').trim()}"`,
			);

			// Additional indexes for efficient filtering
			const additionalIndexesSQL = `
				CREATE INDEX IF NOT EXISTS transcript_chunks_transcript_id_idx ON transcript_chunks (transcript_id);
				CREATE INDEX IF NOT EXISTS transcript_chunks_chunk_index_idx ON transcript_chunks (transcript_id, chunk_index);
				CREATE INDEX IF NOT EXISTS transcript_chunks_metadata_gin_idx ON transcript_chunks USING gin (metadata);
				CREATE INDEX IF NOT EXISTS transcript_chunks_topic_keywords_gin_idx ON transcript_chunks USING gin (topic_keywords);
				CREATE INDEX IF NOT EXISTS transcript_chunks_created_at_idx ON transcript_chunks (created_at);
			`;

			await execAsync(
				`docker exec ${this.VECTOR_DATABASE_CONTAINER_NAME} psql -U ${this.DATABASE_USERNAME} -d ${this.VECTOR_DATABASE_NAME} -c "${additionalIndexesSQL.replace(/\n\s+/g, ' ').replace(/\s+/g, ' ').trim()}"`,
			);

			// Create transcript processing status table
			spinner.text = chalk.dim(
				'Creating transcript processing status table...',
			);
			const createStatusTableSQL = `
				CREATE TABLE IF NOT EXISTS transcript_processing_status (
					id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
					transcript_id UUID NOT NULL UNIQUE,
					original_transcript JSONB NOT NULL,
					total_chunks INTEGER DEFAULT 0,
					processed_chunks INTEGER DEFAULT 0,
					embedding_model VARCHAR(100) DEFAULT 'text-embedding-3-small',
					chunking_strategy VARCHAR(50) DEFAULT 'semantic',
					chunk_size INTEGER DEFAULT 1000,
					chunk_overlap INTEGER DEFAULT 200,
					status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
					error_message TEXT,
					started_at TIMESTAMP WITH TIME ZONE,
					completed_at TIMESTAMP WITH TIME ZONE,
					created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
					updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
				);
			`;

			await execAsync(
				`docker exec ${this.VECTOR_DATABASE_CONTAINER_NAME} psql -U ${this.DATABASE_USERNAME} -d ${this.VECTOR_DATABASE_NAME} -c "${createStatusTableSQL.replace(/\n\s+/g, ' ').replace(/\s+/g, ' ').trim()}"`,
			);

			// Create vector search function for easy querying
			spinner.text = chalk.dim('Creating vector search functions...');
			const createSearchFunctionSQL = `
				CREATE OR REPLACE FUNCTION search_transcript_chunks(
					query_embedding vector(1536),
					transcript_filter UUID DEFAULT NULL,
					similarity_threshold FLOAT DEFAULT 0.7,
					result_limit INTEGER DEFAULT 10
				)
				RETURNS TABLE (
					id UUID,
					transcript_id UUID,
					content TEXT,
					similarity FLOAT,
					metadata JSONB,
					start_time INTERVAL,
					end_time INTERVAL
				) AS \\$\\$
				BEGIN
					RETURN QUERY
					SELECT 
						tc.id,
						tc.transcript_id,
						tc.content,
						1 - (tc.embedding <=> query_embedding) AS similarity,
						tc.metadata,
						tc.start_time,
						tc.end_time
					FROM transcript_chunks tc
					WHERE 
						tc.embedding IS NOT NULL
						AND (transcript_filter IS NULL OR tc.transcript_id = transcript_filter)
						AND (1 - (tc.embedding <=> query_embedding)) >= similarity_threshold
					ORDER BY tc.embedding <=> query_embedding
					LIMIT result_limit;
				END;
				\\$\\$ LANGUAGE plpgsql;
			`;

			await execAsync(
				`docker exec ${this.VECTOR_DATABASE_CONTAINER_NAME} psql -U ${this.DATABASE_USERNAME} -d ${this.VECTOR_DATABASE_NAME} -c "${createSearchFunctionSQL.replace(/\n\s+/g, ' ').replace(/\s+/g, ' ').trim()}"`,
			);

			spinner.succeed(
				chalk.green('Vector database setup completed successfully'),
			);

			// Display setup summary
			console.log(chalk.dim('📊 Vector Database Setup Summary:'));
			console.log(
				chalk.dim(
					`   • Database: ${this.VECTOR_DATABASE_NAME} on port ${this.VECTOR_DATABASE_HOST_PORT}`,
				),
			);
			console.log(chalk.dim('   • Extension: pgvector enabled'));
			console.log(
				chalk.dim(
					'   • Embedding dimensions: 1536 (OpenAI text-embedding-3-small)',
				),
			);
			console.log(chalk.dim('   • Index type: HNSW with cosine similarity'));
			console.log(
				chalk.dim('   • Search function: search_transcript_chunks()'),
			);
			console.log(
				chalk.dim(
					'   • Tables: transcript_chunks, transcript_processing_status',
				),
			);
		} catch (error) {
			spinner.fail(chalk.red('Failed to setup vector database'));
			throw error;
		}

		console.log();
	}

	/**
	 * Start the development servers using Turbo
	 */
	private async startDevelopmentServers(): Promise<void> {
		console.log(chalk.bold('Start development servers'));
		console.log(chalk.dim('Server: http://localhost:3000'));
		console.log(chalk.dim('Website: http://localhost:3001'));
		console.log(
			chalk.dim(`Main Database: localhost:${this.DATABASE_HOST_PORT}`),
		);
		console.log(
			chalk.dim(`Vector Database: localhost:${this.VECTOR_DATABASE_HOST_PORT}`),
		);
		console.log();
		console.log(chalk.dim('Press Ctrl+C to stop all services'));
		console.log();

		// Start development servers with Turbo
		const developmentProcess = spawn('bun', ['run', 'dev:turbo'], {
			cwd: this.PROJECT_ROOT_PATH,
			stdio: 'inherit',
			env: { ...process.env, NODE_ENV: 'development' },
		});

		// Handle graceful shutdown
		const cleanupResources = async () => {
			console.log(
				chalk.yellow('\n🛑 Shutting down development environment...'),
			);
			developmentProcess.kill('SIGTERM');

			// Optionally stop the database containers (uncomment if desired)
			// console.log(chalk.dim('🐳 Stopping database containers...'));
			// await execAsync(`docker stop ${this.DATABASE_CONTAINER_NAME}`).catch(() => {});
			// await execAsync(`docker stop ${this.VECTOR_DATABASE_CONTAINER_NAME}`).catch(() => {});

			process.exit(0);
		};

		process.on('SIGINT', cleanupResources);
		process.on('SIGTERM', cleanupResources);

		developmentProcess.on('exit', (exitCode) => {
			if (exitCode !== 0) {
				console.error(
					chalk.red.bold(`Development servers exited with code ${exitCode}`),
				);
				process.exit(exitCode || 1);
			}
		});
	}

	/**
	 * Utility function to sleep for a given number of milliseconds
	 */
	private sleep(milliseconds: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, milliseconds));
	}
}

(async () => {
	const developmentEnvironment = new DevelopmentEnvironment();
	await developmentEnvironment.run();
})().catch((error) => {
	console.error(chalk.red.bold('💥 Unhandled error:'), error);
	process.exit(1);
});
