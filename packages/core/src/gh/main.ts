import { CollectiumSuper } from '../_super/main'
import { Sort }            from './filter/main'
import { GitHubRepo }      from './repo/main'
import { GitHubUser }      from './user/main'
import { z }               from '../_shared/validate'

import type { GitHubOpts as GitHubOptsValue } from './_super/types'

export type GitHubOpts = {
	[key in string]: GitHubOptsValue
}

export class GitHub extends CollectiumSuper<GitHubOpts, string> {

	#part: Record<string, {
		repo : GitHubRepo
		user : GitHubUser
	}>

	schema
	data : z.infer<GitHub['schema']['res']> | undefined

	constructor( opts: GitHubOpts, config?: GitHub['config'] ) {

		super( {
			opts     : opts,
			config,
			ERROR_ID : { '': '' },
		} )

		const mappedObject = Object.fromEntries( Object.entries( this.opts ).map( ( [ key, opt ] ) => {

			const repo = new GitHubRepo( opt, config )
			const user = new GitHubUser( opt, config )

			return [
				key,
				{
					repo,
					user,
				},
			]

		} ),
		)

		this.#part = mappedObject

		const first = this.#part[Object.keys( this.#part )[0]]
		this.schema = {
			content : first.repo.schema.content,
			res     : z.object( {
				data : z.record(
					z.string(),
					z.object( {
						repo : first.repo.schema.res.optional(),
						user : first.user.schema.res.optional(),
					} ),
				),
				rate : z.union( [
					z.object( {
						limit     : z.number(),
						remaining : z.number(),
						reset     : z.number(),
						used      : z.number(),
					} ),
					z.literal( false ),
				] ),
			} ),
		}

	}

	filter( index: keyof GitHub['data'] ) {

		if ( !this.data || !this.data.rate || !this.data.data?.[index]?.repo )
			throw new Error( `Data does not exist for index ${index}` )

		const s = new Sort( this.data.data?.[index]?.repo )
		return s

	}

	async getRateLimit() {

		return await this.#part[Object.keys( this.#part )[0]].repo.getRateLimit() || undefined

	}

	async get() {

		const resultsEntries = await Promise.all(
			Object.entries( this.#part ).map( async ( [ key, part ] ) => {

				return [
					key,
					{
						user : await part.user.get(),
						repo : await part.repo.get(),
					},
				]

			} ),
		)
		const rate           = await this.getRateLimit()
		this.data            = {
			data : Object.fromEntries( resultsEntries ),
			rate : rate?.core || false,
		}
		return this.data

	}

}
