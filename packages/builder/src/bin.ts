import { build } from '@backan/builder'

import {
	ensureDir,
	fnConstructor,
	successOut,
} from './utils'

export type BuildBinParams = {
	/** Api App path */
	input   : string
	/** Output dir */
	output? : string
	opts?   : Omit<Parameters<typeof build>[0], 'input' | 'output'>
}

export const buildBin = async ( {
	input, opts, output = 'build',
}:BuildBinParams ): Promise<void> => {

	const run = async () => {

		await ensureDir( output )
		await build( {
			input,
			output,
			...opts || {},
		} )
		console.log( successOut( 'Successfully builded' ) )

	}

	await fnConstructor( 'Build Binaries', run )

}

export default buildBin
