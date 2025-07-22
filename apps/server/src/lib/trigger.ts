import { configure } from '@trigger.dev/sdk/v3';

export const triggerClient = configure({
	baseURL: process.env.TRIGGER_BASE_URL,
});
