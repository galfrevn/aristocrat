#!/usr/bin/env bun

import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

const PORTS = [3000, 3001, 3002, 3003, 5432, 5433];

/**
 * Find the process ID (PID) running on a specific port
 */
async function findProcessOnPort(port: number): Promise<string | null> {
	try {
		const { stdout } = await execAsync(`lsof -ti:${port}`);
		const pid = stdout.trim();
		return pid || null;
	} catch (error) {
		// No process found on this port
		return null;
	}
}

/**
 * Kill a process by PID
 */
async function killProcess(pid: string, port: number): Promise<boolean> {
	try {
		await execAsync(`kill -9 ${pid}`);
		console.log(`✅ Killed process ${pid} on port ${port}`);
		return true;
	} catch (error) {
		console.error(`❌ Failed to kill process ${pid} on port ${port}:`, error);
		return false;
	}
}

/**
 * Kill all processes running on the specified ports
 */
async function killProcessesOnPorts(ports: number[]): Promise<void> {
	console.log(`🔍 Checking for processes on ports: ${ports.join(', ')}`);

	const results = await Promise.allSettled(
		ports.map(async (port) => {
			const pid = await findProcessOnPort(port);

			if (!pid) {
				console.log(`📭 No process found on port ${port}`);
				return { port, killed: false };
			}

			console.log(`🎯 Found process ${pid} on port ${port}`);
			const killed = await killProcess(pid, port);
			return { port, killed };
		}),
	);

	const killedCount = results
		.filter(
			(
				result,
			): result is PromiseFulfilledResult<{ port: number; killed: boolean }> =>
				result.status === 'fulfilled',
		)
		.filter((result) => result.value.killed).length;

	const failedCount = results.filter(
		(result) => result.status === 'rejected',
	).length;

	console.log('\n📊 Summary:');
	console.log(`✅ Processes killed: ${killedCount}`);
	if (failedCount > 0) {
		console.log(`❌ Failed operations: ${failedCount}`);
	}
	console.log('🏁 Done!');
}

/**
 * Main execution
 */
async function main(): Promise<void> {
	try {
		await killProcessesOnPorts(PORTS);
		process.exit(0);
	} catch (error) {
		console.error('💥 Unexpected error:', error);
		process.exit(1);
	}
}

// Run the script if executed directly
if (import.meta.main) {
	main();
}

export { killProcessesOnPorts, findProcessOnPort, killProcess };
