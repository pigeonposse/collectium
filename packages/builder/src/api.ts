import {
	buildMD,
	buildSchema,
} from '@backan/builder'
import { join } from 'node:path'

import {
	ensureDir,
	fnConstructor,
	successOut,
} from './utils'

import type { createApp } from '@collectium/api/standard'

export type BuildApiParams = {
	/** Collectium Api App */
	input   : Awaited<ReturnType<typeof createApp>>
	/**
	 * Output dir
	 *
	 * @default 'build/api'
	 */
	output? : string
	opts?: {
		/**
		 * Build openapi schema
		 *
		 * @default true
		 */
		schema? : boolean
		/**
		 * Build openapi Definition ts file
		 *
		 * @default true
		 */
		dts?    : boolean
		/**
		 * Build markdown documentation file
		 *
		 * @default false
		 */
		md?     : boolean
	}
}

export const buildApi = async ( {
	input, opts, output = 'build/api',
}:BuildApiParams ): Promise<void> => {

	const run = async () => {

		const {
			schema = true,
			dts = true,
			md = false,
		} = opts || {}

		await ensureDir( output )

		if ( schema ) {

			await buildSchema( {
				app    : input,
				output : join( output, 'openapi.json' ),
				dts,
			} )
			console.log( successOut( 'Schema Successfully builded at', output ) )

		}

		if ( md ) {

			const out = join( output, 'md' )
			await buildMD( {
				app    : input,
				output : out,
			} )
			console.log( successOut( 'Markdown Successfully builded at', out ) )

		}

	}
	await fnConstructor( 'Build Api files', run )

}

export default buildApi
