import esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';

const context = await esbuild.context({
	logLevel: 'info',
	entryPoints: ['src/app.ts', 'src/index.html'],
	bundle: true,
	outdir: 'dist',
	sourcemap: true,
	platform: 'browser',
	loader: {
		'.html': 'copy',
		// '.png': 'file',
	},
	format: 'esm',
	define: {
		'process.env.DEBUG': `"${process.env.DEBUG}"`,
	},
	plugins: [
		copy({
			assets: {
				from: ['./src/assets/**/*'],
				to: ['./assets'],
			},
			watch: true,
		}),
	],
});

// Manually do an incremental build
const result = await context.rebuild();

// Enable watch mode
await context.watch();

// Enable serve mode
await context.serve({ servedir: './dist' });

// Dispose of the context
// context.dispose();
