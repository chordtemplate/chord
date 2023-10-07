export const log = {
	error(message: unknown) {
		console.error(`\x1b[31m \x1b[0m ${message}`);
	},
	success(message: unknown) {
		console.log(`\x1b[32m \x1b[0m ${message}`);
	},
	info(message: unknown) {
		console.log(`\x1b[34m \x1b[0m ${message}`);
	},
	bold(message: unknown) {
		return `\x1b[1m${message}\x1b[0m`;
	},
};
