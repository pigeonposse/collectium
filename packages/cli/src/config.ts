import { access }  from 'node:fs/promises'
import { extname } from 'node:path'

export const getConfig = async ( path: string ) => {

	if ( extname( path ) ) {

		const data = await import( path )
		return data.default

	}

	const extensions = [
		'.js',
		'.mjs',
		'.cjs',
	]
	for ( const ext of extensions ) {

		try {

			const fullPath = `${path}${ext}`
			await access( fullPath )
			const data = await import( fullPath )
			return data.default

		}
		catch ( error ) {

			// @ts-ignore
			if ( error.code === 'ENOENT' ) continue // Si no existe, probamos la siguiente extensión
			throw error // Si es otro error, lo lanzamos

		}

	}

	throw new Error( `Config file not found for path: ${path}` )

}
