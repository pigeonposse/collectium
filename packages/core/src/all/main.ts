
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

export type CollectiumOpts = {
	github? : GitHubOpts
	custom? : CustomOpts
	config? : CollectiumConfig
}

export type CollectiumRes = {
	github? : Awaited<ReturnType<GitHub['get']>>
	custom? : Awaited<ReturnType<Custom['get']>>
	timeout : number
}

export const defineConfig = ( v: CollectiumOpts ): CollectiumOpts => v

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
			timeout : this.z.number(),
		} ) }

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
