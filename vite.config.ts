import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

declare module '@remix-run/node' {
	interface Future {
		// biome-ignore lint/style/useNamingConvention: <explanation>
		v3_singleFetch: true;
	}
}

export default defineConfig({
	plugins: [
		remix({
			future: {
				// biome-ignore lint/style/useNamingConvention: <explanation>
				v3_fetcherPersist: true,
				// biome-ignore lint/style/useNamingConvention: <explanation>
				v3_relativeSplatPath: true,
				// biome-ignore lint/style/useNamingConvention: <explanation>
				v3_throwAbortReason: true,
				// biome-ignore lint/style/useNamingConvention: <explanation>
				v3_singleFetch: true,
				// biome-ignore lint/style/useNamingConvention: <explanation>
				v3_lazyRouteDiscovery: true,
			},
		}),
		tsconfigPaths(),
	],
});
