
import { join }            from 'node:path'
import { zodToJsonSchema } from 'zod-to-json-schema'

import {
	boldOut,
	ensureDir,
	fnConstructor,
	successOut,
	writeJSON,
} from './utils'

import type { Collectium } from '@collectium/core'

export type BuildSchemaParams = {
	input   : Collectium
	/**
	 * Output dir
	 *
	 * @default 'build/schema'
	 */
	output? : string
}
export const buildSchema = async ( {
	input,
	output = 'build/schema',
}: BuildSchemaParams ): Promise<void> => {

	const run = async () => {

		await ensureDir( output )

		const zodSchemas = input.github.schema.content

		if ( !zodSchemas ) throw Error( 'Zod schemas does not exists' )

		for ( const [ k, v ] of Object.entries( zodSchemas ) ) {

			const jsonSchema = zodToJsonSchema( v.shape.content, { errorMessages: true } )
			const file       = join( output, k + '.json' )

			await writeJSON(
				file,
				jsonSchema,
			)
			console.log( successOut( `Build schema file for ${boldOut( k )}:`, file ) )

		}

	}

	await fnConstructor( 'Build Schema', run )

}

export default buildSchema

