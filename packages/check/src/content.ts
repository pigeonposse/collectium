import * as yaml    from 'js-yaml'
import { readFile } from 'node:fs/promises'
import {
	isAbsolute,
	join,
} from 'node:path'
import { parse } from 'smol-toml'

export const getContent = async <Obj extends object = object>( content: string ): Promise<Obj | string> => {

	try {

		const getObject = ( data: string ) => {

			try {

				const r = JSON.parse( data ) as Obj
				return r

			}
			catch ( _e ) {

				try {

					const r = yaml.load( data ) as Obj
					return r

				}
				catch ( _e ) {

					try {

						const r = parse( data ) as Obj
						return r

					}
					catch ( _e ) {

						return

					}

				}

			}

		}

		const res = getObject( content )

		return res ? res : content

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error getting data: ${error.message}` )

	}

}

const isUrl = ( value: string | URL ): boolean => {

	try {

		new URL( value )
		return true

	}
	catch {

		return false

	}

}

const isPath = ( str: string ) => {

	if ( isAbsolute( str ) || /^(\.\/|\.\.\/|[A-Za-z]:\\|\/)/.test( str ) ) {

		if ( isAbsolute( str ) || /^(\.\/|\.\.\/|[A-Za-z]:\\|\/)/.test( str ) ) {

			if ( /\s(?!\\)/.test( str ) && !/\\\s/.test( str ) )
				return false

			try {

				const normalizedPath = join( str )
				return normalizedPath !== ''

			}
			catch {

				return false

			}

		}

	}
	return false

}

export const getStringType = ( value: string ): 'text' | 'url' | 'path' => {

	if ( isUrl( value ) ) return 'url'
	if ( isPath( value ) ) return 'path'
	return 'text'

}

export const getContentFrom =  async <Obj extends object = object>( value: string  ): Promise<Obj | string> => {

	const type = getStringType( value )

	const res = type === 'path'
		? await readFile( value, 'utf-8' )
		: type === 'url'
			? await ( await fetch( value ) ).text()
			: value

	return await getContent<Obj>( res )

}
