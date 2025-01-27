
import { argv } from 'node:process'

export const getFlagValue = ( key: string ) => {

	const flagLine = key.length === 1 ? '-' : '--'
	return getCMD( `${flagLine}${key}` )

}

export const getFlagValues = ( key: string ): string[] | undefined => {

	const flags    = argv
	const flagLine = key.length === 1 ? '-' : '--'

	let values: string[] = []

	for ( let i = 0; i < flags.length; i++ ) {

		const flag = flags[i]

		// Formato --key=value1,value2,...
		if ( flag.startsWith( `${flagLine}${key}=` ) ) {

			values = flag.split( '=' )[1].split( ',' )
			break

		}

		// Formato --key value1 value2 ...
		if ( flag === `${flagLine}${key}` ) {

			for ( let j = i + 1; j < flags.length; j++ ) {

				if ( flags[j].startsWith( flagLine ) ) break
				values.push( flags[j] )

			}
			break

		}

	}
	return values.length > 0 ? values : undefined

}

export const existsFlag = ( v: string ) => {

	const flagLine = v.length === 1 ? '-' : '--'
	return argv.includes( `${flagLine}${v}` )

}

export const existsCmd = ( v: string ) => argv.includes( v )
export const getCMD = ( key:string ) => {

	const flags = argv
	for ( let i = 0; i < flags.length; i++ ) {

		const flag = flags[i]

		// Formato --key=value
		if ( flag.startsWith( `${key}=` ) )
			return flag.split( '=' )[1]

		// Formato --key value
		if ( flag === `${key}` && flags[i + 1] && !flags[i + 1].startsWith( '-' ) )
			return flags[i + 1]

	}
	return undefined

}
export const noFlags = () => argv.length <= 2
