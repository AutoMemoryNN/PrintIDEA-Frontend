import crypto from 'node:crypto';

/**
 * Retrieves a secret from the environment variables in a safe manner.
 * If the secret is not found, it generates and returns a random hash.
 *
 * @param {string} secret - The name of the environment variable to retrieve.
 * @returns {string} - The value of the environment variable or a randomly generated hash if the variable is not found.
 */
export function getSafeEnvSecret(secret: string): string {
	const safeSecret = process.env[secret];
	if (!safeSecret) {
		const randomHash = crypto.randomBytes(20).toString('hex');
		return randomHash;
	}
	return safeSecret;
}
