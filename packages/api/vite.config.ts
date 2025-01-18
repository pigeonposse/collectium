/**
 * Vite config.
 * @description Vite config.
 * @see https://vitejs.dev/guide
 */

import devServer        from '@hono/vite-dev-server'
import { defineConfig } from 'vite'
import dts              from 'vite-plugin-dts'

const target = 'node20'
export const port = 1312

export default defineConfig( {
	esbuild : {
		platform : 'node',
		target,
	},
	server : {
		host : '0.0.0.0',
		port,
	},
	preview : { port },
	build   : {
		ssr : true,
		target,
		lib : {
			entry   : [ 'src/main' ],
			formats : [ 'es' ],
		},
	},
	plugins : [ dts( { rollupTypes: true } ), devServer( { entry: 'examples/app' } ) ],
} )
