import { deserialize as yamlParse } from '@structium/toml'
import { deserialize as tomlParse } from '@structium/toml'

export const getContent = async <Obj extends object = object>( content: string ): Promise<Obj | string> => {

	try {

		const getObject = async ( data: string ) => {

			try {

				const r = JSON.parse( data ) as Obj
				return r

			}
			catch ( _e ) {

				try {

					const r = await yamlParse( data ) as Obj
					return r

				}
				catch ( _e ) {

					try {

						const r = await tomlParse( data ) as Obj
						return r

					}
					catch ( _e ) {

						return

					}

				}

			}

		}

		const res = await getObject( content )

		return res ? res : content

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error getting data: ${error.message}` )

	}

}

export const encode = ( data: string ) => {

	const fromBinary = ( msg: string ) => {

		const ui = new Uint8Array( msg.length )
		for ( let i = 0; i < msg.length; ++i ) {

			ui[i] = msg.charCodeAt( i )

		}
		return ui

	}
	const res = fromBinary( atob( data ) )
	return res

}

export const decode = ( content: string ) => {

	const decoder = new TextDecoder()

	let data

	data = Uint8Array.from( atob( content ), c => c.charCodeAt( 0 ) )
	data = decoder.decode( data )

	return data

}
