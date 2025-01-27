import * as yaml from 'js-yaml'
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

