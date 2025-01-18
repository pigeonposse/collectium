
import { getContent }  from '../../_shared/string'
import { GitHubSuper } from '../_super/main'

import type {
	ZodInfer,
	Zod,
	ZodAnyType,
} from '../../_shared/validate'
import type { GitHubOpts } from '../_super/types'

const fileContentRes = ( z: Zod ) => z.union( [ z.string(), z.object( {} ).passthrough().transform( val => val as object ) ] ).optional()

const schema = ( z: Zod, customConf?: ZodAnyType ) => ( {
	res : z.array( z.object( {
		id       : z.string(),
		url      : z.string(),
		desc     : z.string().optional(),
		homepage : z.string().optional(),

		isPrivate  : z.boolean(),
		isArchived : z.boolean(),
		isDisabled : z.boolean(),
		isFork     : z.boolean(),
		isTemplate : z.boolean(),

		stargazers : z.number(),
		watchers   : z.number(),
		forks      : z.number(),
		issues     : z.number(),
		size       : z.number().optional(),

		language      : z.string().optional(),
		tags          : z.array( z.string() ).optional(),
		createdAt     : z.string().optional(),
		updatedAt     : z.string().optional(),
		defaultBranch : z.string().optional(),
		license       : z.object( {
			key  : z.string().optional(),
			name : z.string().optional(),
			url  : z.string().optional(),
		} ).optional(),

		content : z.object( {
			config : customConf || fileContentRes( z ),
			files  : z.record( z.string(), fileContentRes( z ) ),
		} ),
		releases : z.array( z.object( {
			url         : z.string(),
			tag         : z.string(),
			name        : z.string(),
			createdAt   : z.string(),
			publishedAt : z.string(),
			assets      : z.array( z.object( {
				name        : z.string(),
				id          : z.number(),
				size        : z.number(),
				downloadURL : z.string(),
				downloads   : z.number(),
				createdAt   : z.string(),
				updatedAt   : z.string(),
			} ) ),
		} ) ),
	} ) ),
	fileContentRes : fileContentRes( z ),
} )

export type RepoRes = ZodInfer<GitHubRepo['schema']['res']>
export type RepoContentRes = RepoRes[number]['content']
export type RepoReleases = RepoRes[number]['releases']
export type RepoFileContentRes = ZodInfer<GitHubRepo['schema']['fileContentRes']>

export class GitHubRepo extends GitHubSuper {

	schema

	constructor( opts: GitHubOpts, config?: GitHubRepo['config'] ) {

		super( opts, config )
		this.schema = schema( this.z, opts.configSchema?.( this.z ) )

	}

	async getReleases( repo: string ): Promise<RepoReleases> {

		// https://api.github.com/repos/pigeonposse/bepp/releases

		const response = await this.gh.request( 'GET /repos/{owner}/{repo}/releases', {
			owner   : this.opts.user,
			repo    : repo,
			headers : this.opts.requestHeaders,
		} )

		return response.data.map ( d => ( {
			url         : d.html_url,
			tag         : d.tag_name,
			name        : d.name || String( d.id ),
			createdAt   : d.created_at,
			publishedAt : d.published_at || d.created_at,
			assets      : d.assets.map( a => ( {
				name        : a.name,
				id          : a.id,
				size        : a.size,
				downloadURL : a.browser_download_url,
				downloads   : a.download_count,
				createdAt   : a.created_at,
				updatedAt   : a.updated_at,
			} ) ),
		} ) )

	}

	// async existsContents( repo: string ) {

	// 	// https://api.github.com/repos/pigeonposse/bepp/contents

	// 	const contents = await this.gh.request( 'GET /repos/{owner}/{repo}/contents', {
	// 		owner   : this.opts.user,
	// 		repo,
	// 		headers : this.opts.requestHeaders,
	// 	} )
	// 	console.log( contents.data )
	// 	throw Error( '' )

	// }

	async getContent( repo: string ): Promise<RepoContentRes> {

		const res : RepoContentRes = {
			config : undefined,
			files  : {},
		}

		try {

			const readeadFiles = this.opts.files

			if ( readeadFiles ) {

				for ( const key of Object.keys( readeadFiles ) ) {

					const file   = readeadFiles[key]
					const isObj  = typeof file !== 'string'
					const path   = !isObj ? file : file.input
					const schema = isObj ? await file.schema?.( this.z ) : undefined
					let content  = await this.geFileContent( repo, path )

					const resOn = await this.opts?.onFile?.( {
						user     : this.opts.user,
						isConfig : false,
						branch   : this.opts.branch,
						repo,
						path     : path,
						id       : key,
						content,
					} )
					content     = resOn ? resOn : content

					if ( schema ) await this.validateSchema( schema, content )
					res.files[key] = content

				}

			}

			for ( const file of this.opts.configPath ) {

				let content  = await this.geFileContent( repo, file )
				const schema = await this.opts.configSchema( this.z )

				if ( !content ) continue

				const resOn = await this.opts?.onFile?.( {
					user     : this.opts.user,
					isConfig : true,
					branch   : this.opts.branch,
					repo,
					path     : file,
					id       : file,
					content,
				} )
				content     = resOn ? resOn : content
				if ( schema ) await this.validateSchema( schema, content )
				res.config = content

				return res

			}

			return res

		}
		catch ( e ) {

			this.setError( {
				id   : this.ERROR_ID.GET_REPO_CONTENT,
				data : {
					e,
					props : { repo },
				},
			} )

			return res

		}

	}

	async get(): Promise<RepoRes | undefined> {

		try {

			const response = await this.gh.request( 'GET /users/{username}/repos', {
				username : this.opts.user,
				headers  : this.opts.requestHeaders,
			} )

			const repos = await Promise.all( response.data.map( async repo => {

				if ( this.opts.ignoreRepo && this.opts.ignoreRepo.includes( repo.name ) ) return undefined

				return {
					id       : repo.name,
					url      : repo.html_url,
					desc     : repo.description || undefined,
					homepage : repo.homepage || undefined,

					isFork     : repo.fork || false,
					isTemplate : repo.is_template || false,
					isArchived : repo.archived || false,
					isDisabled : repo.disabled || false,
					isPrivate  : repo.private || false,

					size       : repo.size,
					issues     : repo.open_issues_count || 0,
					forks      : repo.forks_count || 0,
					watchers   : repo.watchers || 0,
					stargazers : repo.stargazers_count || 0,

					tags          : repo.topics,
					language      : repo.language || undefined,
					createdAt     : repo.created_at || undefined,
					updatedAt     : repo.updated_at || undefined,
					defaultBranch : repo.default_branch,
					license       : repo.license || undefined,
					content       : await this.getContent( repo.name ),
					releases      : await this.getReleases( repo.name ),
				}

			} ) )

			return repos.filter( d => d !== undefined )

		}
		catch ( e ) {

			this.setError( {
				id   : this.ERROR_ID.GET_REPO_DATA,
				data : { e },
			} )
			return undefined

		}

	}

	async geFileContent( repo: string, path: string ): Promise<RepoFileContentRes>  {

		try {

			const res = await this.gh.request( 'GET /repos/{owner}/{repo}/contents/{path}', {
				owner   : this.opts.user,
				repo,
				path,
				headers : this.opts.requestHeaders,
			} )

			if ( !res || !res.data || !( 'content' in res.data ) ) return undefined

			const text = atob( res.data.content )

			const content = await getContent( text )

			if ( content ) return content

			return undefined

		}
		catch ( e ) {

			this.setError( {
				id   : this.ERROR_ID.GET_REPO_FILE_CONTENT,
				data : {
					e,
					props : {
						repo,
						path,
					},
				},
			} )

			return undefined

		}

	}

}
