import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { promisify } from 'node:util';
import { spawn, exec } from 'node:child_process';

import ora from 'ora';
import chalk from 'chalk';

const execAsync = promisify(exec);

/**
 * Development environment setup and execution script
 * Handles Docker container management, database setup, and development server startup
 */
class DevelopmentEnvironment {
	private readonly DATABASE_CONTAINER_NAME = 'aristocrat-development-database';
	private readonly POSTGRES_DOCKER_IMAGE = 'postgres:16-alpine';
	private readonly DATABASE_NAME = 'postgres';
	private readonly DATABASE_USERNAME = 'postgres';
	private readonly DATABASE_PASSWORD = 'mypassword';
	private readonly DATABASE_HOST_PORT = 5432;
	private readonly PROJECT_ROOT_PATH = join(process.cwd());

	/**
	 * Main execution flow
	 */
	async run(): Promise<void> {
		try {
			console.clear();
			console.log(chalk.bgBlack.white.bold(' Aristocrat :: Starting development environment '));
			console.log();

			await this.checkSystemRequirements();
			await this.handleDatabaseContainer();
			await this.waitForDatabase();
			await this.runDatabaseMigrations();
			await this.startDevelopmentServers();
			
			console.log(chalk.green.bold('✅ Development environment setup completed!'));
		} catch (error) {
			console.error(chalk.red.bold('❌ Failed to start development environment:'), error);
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
				spinner.fail(chalk.red(`${toolName} is not installed or not available in PATH`));
				throw new Error(`${toolName} is not installed or not available in PATH`);
			}
		}
		
		console.log();
	}

	/**
	 * Check if Docker container exists and is running, create/start if needed
	 */
	private async handleDatabaseContainer(): Promise<void> {
		console.log(chalk.bold('Handle database container'));

		const spinner = ora(chalk.dim('Checking container status...')).start();

		try {
			const containerExists = await this.containerExists();
			const containerIsRunning =
				containerExists && (await this.containerIsRunning());

			if (!containerExists) {
				spinner.text = chalk.dim(`Creating container: ${this.DATABASE_CONTAINER_NAME}...`);
				await this.createContainer();
				spinner.succeed(chalk.green(`Container ${this.DATABASE_CONTAINER_NAME} created successfully`));
			} else if (!containerIsRunning) {
				spinner.text = chalk.dim(` Starting container: ${this.DATABASE_CONTAINER_NAME}...`);
				await this.startContainer();
				spinner.succeed(chalk.green(`Container ${this.DATABASE_CONTAINER_NAME} started successfully`));
			} else {
				spinner.succeed(chalk.green(`Container ${this.DATABASE_CONTAINER_NAME} is already running`));
			}

			console.log();
		} catch (error) {
			spinner.fail(chalk.red('Failed to handle database container'));
			throw error;
		}
	}

	/**
	 * Check if the Docker container exists
	 */
	private async containerExists(): Promise<boolean> {
		try {
			const { stdout } = await execAsync(
				`docker ps -a --filter name=${this.DATABASE_CONTAINER_NAME} --format "{{.Names}}"`,
			);
			return stdout.trim() === this.DATABASE_CONTAINER_NAME;
		} catch {
			return false;
		}
	}

	/**
	 * Check if the Docker container is running
	 */
	private async containerIsRunning(): Promise<boolean> {
		try {
			const { stdout } = await execAsync(
				`docker ps --filter name=${this.DATABASE_CONTAINER_NAME} --format "{{.Names}}"`,
			);
			return stdout.trim() === this.DATABASE_CONTAINER_NAME;
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
	 * Start an existing Docker container
	 */
	private async startContainer(): Promise<void> {
		try {
			await execAsync(`docker start ${this.DATABASE_CONTAINER_NAME}`);
		} catch (error) {
			throw new Error(`Failed to start Docker container: ${error}`);
		}
	}

	/**
	 * Wait for the database to be ready to accept connections
	 */
	private async waitForDatabase(): Promise<void> {
		console.log(chalk.bold('Wait for database'));

		const spinner = ora(chalk.dim('Waiting for database to be ready...')).start();

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
					spinner.succeed(chalk.green('Database is ready'));
					console.log();
					return;
				} catch {
					if (currentAttempt === maxConnectionAttempts) {
						spinner.fail(chalk.red('Database failed to become ready within timeout period'));
						throw new Error(
							'Database failed to become ready within timeout period',
						);
					}

					spinner.text = chalk.dim(`Waiting for database... (attempt ${currentAttempt}/${maxConnectionAttempts})`);
					await this.sleep(retryDelayMs);
				}
			}
		} catch (error) {
			spinner.fail(chalk.red('Database connection failed'));
			throw error;
		}
	}

	/**
	 * Run database migrations if needed
	 */
	private async runDatabaseMigrations(): Promise<void> {
		console.log(chalk.bold('Database migrations'));

		const spinner = ora(chalk.dim('Checking database migrations...')).start();

		const serverDirectoryPath = join(this.PROJECT_ROOT_PATH, 'apps', 'server');
		const environmentFilePath = join(serverDirectoryPath, '.env');

		if (!existsSync(environmentFilePath)) {
			spinner.warn(chalk.yellow('No .env file found in server directory, skipping migrations'));
			console.log();
			return;
		}

		try {
			spinner.text = chalk.dim('Updating database schema...');
			// Check if we need to run migrations by comparing schema
			await execAsync('cd apps/server && bun run db:push', {
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
	 * Start the development servers using Turbo
	 */
	private async startDevelopmentServers(): Promise<void> {
		console.log(chalk.bold('Start development servers'));
		console.log(chalk.dim('Server: http://localhost:3000'));
		console.log(chalk.dim('Website: http://localhost:3001'));
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
			console.log(chalk.yellow('\n🛑 Shutting down development environment...'));
			developmentProcess.kill('SIGTERM');

			// Optionally stop the database container (uncomment if desired)
			// console.log(chalk.dim('🐳 Stopping database container...'));
			// await execAsync(`docker stop ${this.DATABASE_CONTAINER_NAME}`).catch(() => {});

			process.exit(0);
		};

		process.on('SIGINT', cleanupResources);
		process.on('SIGTERM', cleanupResources);

		developmentProcess.on('exit', (exitCode) => {
			if (exitCode !== 0) {
				console.error(chalk.red.bold(`Development servers exited with code ${exitCode}`));
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
