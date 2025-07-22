import { defineConfig as instantiateConfiguration } from '@trigger.dev/sdk/v3';

export default instantiateConfiguration({
	project: 'proj_gvreertngztgrcpfvjtn',
	dirs: ['./src/trigger'],
	maxDuration: 300,
	enableConsoleLogging: true,
});
