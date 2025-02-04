import { join } from 'path'

import buildApi         from './api'
import {
	buildBin,
	type BuildBinParams,
} from './bin'
import buildSchema from './schema'

import type { BuildApiParams }    from './api'
import type { BuildSchemaParams } from './schema'

type BuildParams = {
	/**
	 * Output dir
	 * @default './build'
	 */
	output? : string
	schema? : Omit<BuildSchemaParams, 'output'>
	api?    : Omit<BuildApiParams, 'output'>
	bin?    : Omit<BuildBinParams, 'output'>
}

export type {
	BuildParams,
	BuildSchemaParams,
	BuildApiParams,
	BuildBinParams,
}

export {
	buildApi,
	buildSchema,
}

export const build = async ( data: BuildParams ): Promise<void> => {

	const output = data.output || './build'

	if ( data.schema ) await buildSchema( {
		...data.schema,
		output : join( output, 'schema' ),
	} )

	if ( data.api ) await buildApi( {
		...data.api,
		output : join( output, 'api' ),
	} )

	if ( data.bin ) await buildBin( {
		...data.bin,
		output : join( output ),
	} )

}

export default build
