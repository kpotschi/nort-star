import esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';

esbuild.build({
	logLevel: 'info',
	entryPoints: [
		{ out: 'app', in: 'src/app.ts' },
		{ out: 'index', in: 'src/index.html' },
	],
	bundle: true,
	outdir: 'dist',

	sourcemap: false,
	minify: true,
	legalComments: 'none',
	loader: {
		'.html': 'copy',
	},
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
