
import { objectMap }      from '../_shared/obj'
import {
	CollectiumSuperMininal,
	type CollectiumConfig,
} from '../_super/main'
import { Custom }   from '../custom/main'
import {
	GitHub,
	type GitHubOpts,
} from '../gh/main'

import type { CustomOpts } from '../custom/main'

type CollectiumOpts = {
	/** Github options */
	github? : GitHubOpts
	/** Custom options */
	custom? : CustomOpts
	/** Global Configuration */
	config? : CollectiumConfig
}

type CollectiumRes = {
	github? : Awaited<ReturnType<GitHub['get']>>
	custom? : Awaited<ReturnType<Custom['get']>>
	/** Execution time in miliseconds */
	timeout : number
}

export type {
	CollectiumOpts,
	CollectiumRes,
}

export const defineConfig = ( v: CollectiumOpts ): CollectiumOpts => v

/**
 * Create a Collectium instance
 * @see https://collectium.pigeonposse.com/guide/core
 * @example
 * import { argv } from 'node:process';
 *
 * // Retrieve the GitHub token from the command line arguments
 * const token = argv[2];
 *
 * // Initialize a new Collectium instance
 * const collectium = new Collectium({
 *   github: {
 *     test: {
 *       user: 'pigeonposse',  // GitHub username or organization
 *       branch: 'main',       // Target branch
 *       userType: 'org',      // User type: 'org' for organization, 'user' for individual
 *       token,                // Authentication token for GitHub
 *     },
 *   },
 *   config: {
 *     skipError: true, // Skip errors during execution
 *     skipWarn: true,  // Skip warnings during execution
 *   },
 * });
 *
 * // Fetch data using the Collectium instance
 * const data = await collectium.get();
 *
 * // Log the retrieved data to the console with full depth
 * console.dir(data, { depth: Infinity });
 */
export class Collectium extends CollectiumSuperMininal {

	github
	custom
	schema

	constructor( public opts: CollectiumOpts ) {

		super( { config: opts.config } )

		this.github = new GitHub( this.opts.github || {}, this.opts.config )
		this.custom = new Custom( this.opts.custom || {}, this.opts.config )

		this.schema = { res : this.z.object( {
			github  : this.github.schema.res.optional(),
			custom  : this.custom.schema.res.optional(),
			timeout : this.z.number().describe( 'time in miliseconds' ),
		} ) }

		if ( this.config?.debug ) console.dir( {
			github : objectMap( this.github.opts, d => ( {
				...d,
				token : !d.token || '***',
			} ) ),
			custom : this.custom.opts,
			config : this.config,
		}, { depth: Infinity } )

	}

	async get(): Promise<CollectiumRes> {

		if ( !this.opts ) throw new Error( `Options not exist` )

		const startTime          = performance.now()
		const res: CollectiumRes = {
			github  : undefined,
			custom  : undefined,
			timeout : 0,
		}

		if ( this.github ) res.github = await this.github.get()
		if ( this.custom ) res.custom = await this.custom.get()

		const endTime = performance.now()
		res.timeout   = endTime - startTime

		return res

	}

}
