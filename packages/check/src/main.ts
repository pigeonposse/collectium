import { z }         from '@hono/zod-openapi'
import { getConfig } from 'config'
import { globby }    from 'globby'
import { readFile }  from 'node:fs/promises'
import { join }      from 'node:path'
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
type Content = NonNullable<NonNullable<CollectiumOpts['github']>[number]['content']>
// type OpenApiSchema = string | object
type CollectiumOptsPath = string
export type CheckOpts = CollectiumOpts | CollectiumOptsPath

/**
 * Checker class to validate schemas against specified content files.
 * This class is designed to work with Zod schemas and supports dynamic content validation
 * from either a configuration object or a configuration file path.
 * @example
 * // Example usage with a configuration file path:
 * import { Checker } from '@collectium/check';
 *
 * const checker = new Checker("/path/to/config.js");
 * checker.run("config-file", { cwd: "/path/to/dir" });
 * @example
 * // Example usage with an options object:
 * import { Checker } from '@collectium/check';
 *
 * const opts = {
 *   github: [
 *     {
 *       content: {
 *         "config-file": {
 *           input: ["configs/**\/*.json"],
 *           schema: (z) => z.object({
 *             name: z.string(),
 *             version: z.string(),
 *           }),
 *         },
 *       },
 *     },
 *   ],
 * };
 *
 * const checker = new Checker(opts);
 * checker.run("config-file", { cwd: "/path/to/dir" });
 */
export class Checker {

	#opts

	constructor( opts: CheckOpts ) {

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

	async #execute( readeadFiles: Content, dir: string ) {

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

				continue

			}

			for ( const path of localPaths ) {

				const content = await getContent( await readFile( join( dir, path ), 'utf-8' ) )

				await this.#validateSchema( schema, content, key, path )

				break

			}

		}

	}

	async #getContent( id: string ) {

		if ( typeof this.#opts === 'string' ) return ( await getConfig( this.#opts ) ).github?.[id].content as Content
		return this.#opts.github?.[id].content

	}

	async run( id: string, opts?: { cwd?: string } ) {

		const dir = opts?.cwd || cwd()
		console.log( this.#style.info( 'Path to check:', dir  ), '\n' )

		const readeadFiles = await this.#getContent( id )
		if ( !readeadFiles ) {

			console.warn( this.#style.warn( 'Nothing to check' ) )
			return undefined

		}
		this.#execute( readeadFiles, dir )

	}

}
