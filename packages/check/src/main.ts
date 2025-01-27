import { z }        from '@hono/zod-openapi'
import { globby }   from 'globby'
import { readFile } from 'node:fs/promises'
import { join }     from 'node:path'
import {
	cwd,
	exit,
}  from 'node:process'
import { styleText } from 'node:util'
import { fromError } from 'zod-validation-error'

import { getContent } from './content'

import type { CollectiumOpts } from '@collectium/core'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any
type ZodAnyType = z.ZodType<Any, Any, Any>

export class Checker {

	#opts

	constructor( opts: CollectiumOpts ) {

		this.#opts = opts

	}

	async #validateSchema( schema: ZodAnyType, data: unknown, key: string, path?: string ) {

		try {

			schema.parse( data )
			console.log( this.#style.successMsg( key, 'Successfully checked!' ) )

		}
		catch ( err ) {

			const e = fromError( err )

			console.error( this.#style.errorMsg(
				key,
				path ? `Error in path: ${path}\n${e.message}` : e.message,
			) )

			exit( 1 )

		}

	}

	#style = {
		warn       : ( msg: string ) => styleText( 'yellow',  styleText( 'bold', '⚠️' ) + ' ' +  styleText( 'dim', msg ) ),
		errorMsg   : ( k:string, msg: string ) => styleText( 'red',  styleText( 'bold', '✦ ' + k ) + ' ' + msg ),
		info       : ( t:string, msg: string ) => styleText( 'bold',  t ) + ' ' + styleText( 'dim', msg ),
		successMsg : ( k:string, msg: string ) => styleText( 'green',  styleText( 'bold', '✦ ' + k ) + ' ' + msg ),
	}

	async run( id: string, opts?: { cwd?: string } ) {

		const dir = opts?.cwd || cwd()
		console.log( this.#style.info( 'Path to check:', dir  ), '\n' )

		const readeadFiles = this.#opts.github?.[id].content

		if ( !readeadFiles ) {

			console.log( this.#style.warn( 'Nothing to check' ) )
			return undefined

		}

		for ( const key of Object.keys( readeadFiles ) ) {

			const file   = readeadFiles[key]
			const isObj  = typeof file !== 'string' && !Array.isArray( file )
			const input  = !isObj ? file : file.input
			const paths  = typeof input === 'string' ? [ input ] : input
			const schema = isObj ? await file.schema?.( z ) : undefined
			if ( !schema ) {

				console.log( this.#style.successMsg( key, 'Any schema provided' ) )
				continue

			}
			const localPaths = await globby( paths, {
				dot       : true,
				onlyFiles : true,
				cwd       : dir,
			} )

			if ( localPaths.length === 0 ) {

				await this.#validateSchema( schema, undefined, key )
				// console.log( this.#style.errorMsg( key, `No local files provided at: ${paths.join( ',' )}` ) )
				continue

			}

			for ( const path of localPaths ) {

				const content = await getContent( await readFile( join( dir, path ), 'utf-8' ) )

				await this.#validateSchema( schema, content, key, path )

				break

			}

		}

	}

}
