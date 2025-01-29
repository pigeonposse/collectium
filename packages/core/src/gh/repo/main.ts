
import { matcher } from 'matcher'

import { objectMap }   from '../../_shared/obj'
import { getContent }  from '../../_shared/string'
import { GitHubSuper } from '../_super/main'

import type {
	ZodInfer,
	Zod,
} from '../../_shared/validate'
import type { GitHubOpts } from '../_super/types'

export type RepoRes = {
	id        : string
	url       : string
	desc?     : string
	homepage? : string

	isPrivate  : boolean
	isArchived : boolean
	isDisabled : boolean
	isFork     : boolean
	isTemplate : boolean
	isPinned   : boolean

	stargazers : number
	watchers   : number
	forks      : number
	issues     : number
	size?      : number

	language?      : string
	tags?          : string[]
	createdAt?     : string
	updatedAt?     : string
	defaultBranch? : string

	license?: {
		key?  : string
		name? : string
		url?  : string
	}

	content? : Record<string, unknown>

	releases?: {
		url         : string
		tag         : string
		name        : string
		createdAt   : string
		publishedAt : string
		assets?: {
			name        : string
			id          : number
			size        : number
			downloadURL : string
			downloads   : number
			createdAt   : string
			updatedAt   : string
		}[]
	}[]
}[]

const schema = ( z: Zod, opts: GitHubOpts ) => {

	const fileContentRes = ( z: Zod ) => z.union( [ z.string(), z.object( {} ).passthrough().transform( val => val as object ) ] ).optional()

	const content = opts.content
		? objectMap( opts.content, d => {

			if ( typeof d === 'string' || Array.isArray( d ) ) return fileContentRes( z )
			else return d.schema?.( z ) || fileContentRes( z )

		} )
		: undefined

	const contentSchema = content
		? z.object( content )
		: z.record( z.string(), fileContentRes( z ) )
	return {

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
			isPinned   : z.boolean(),

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

			content  : contentSchema.optional(),
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
				} ) ).optional(),
			} ) ).optional(),
		} ) ) satisfies Zod.ZodSchema<RepoRes>,
		content        : content,
		fileContentRes : fileContentRes( z ),
	}

}

export type RepoContentRes = RepoRes[number]['content']
export type RepoReleases = RepoRes[number]['releases']
export type RepoFileContentRes = ZodInfer<GitHubRepo['schema']['fileContentRes']>

export class GitHubRepo extends GitHubSuper {

	schema

	constructor( opts: GitHubOpts, config?: GitHubRepo['config'] ) {

		super( opts, config )

		this.schema = schema( this.z, this.opts )

	}

	async getPinnedRepos() {

		try {

			const type     = this.opts.userType === 'org' ? 'organization' : 'user'
			const response = await this.gh.graphql(
				`query ($login: String!) {
				${type}(login: $login) {
				  pinnedItems(first: 6, types: REPOSITORY) {
				    nodes {
					  ... on Repository {
					    name
					  }
				    }
				  }
				}
			  }`,
				{
					login   : this.opts.user,
					headers : this.opts.requestHeaders,
				},
			) as {
				[key in typeof type]: { pinnedItems: { nodes: { name: string }[] } }
			} | undefined

			const pinnedItems = response && typeof response === 'object' && type in response && typeof response[type] === 'object' && 'pinnedItems' in response[type]
				? response?.[type].pinnedItems
				: undefined
			const nodes       = pinnedItems?.nodes || undefined
			const pinnedRepos = nodes?.map( d => d.name )

			return pinnedRepos

		}
		catch ( e ) {

			console.warn( 'Error fetching pinned repositories:', e )
			return undefined

		}

	}

	async getReleases( repo: string ): Promise<RepoReleases> {

		// https://api.github.com/repos/pigeonposse/bepp/releases
		if ( !this.opts.releases ) return

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
			assets      : this.opts.releases === 'no-assets'
				? undefined
				: d.assets.map( a => ( {
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

		const res : RepoContentRes = {}

		try {

			const readeadFiles = this.opts.content

			if ( !readeadFiles ) return undefined

			for ( const key of Object.keys( readeadFiles ) ) {

				const file   = readeadFiles[key]
				const isObj  = typeof file !== 'string' && !Array.isArray( file )
				const input  = !isObj ? file : file.input
				const paths  = typeof input === 'string' ? [ input ] : input
				const schema = isObj ? await file.schema?.( this.z ) : undefined

				for ( const path of paths ) {

					if ( res[key] ) continue

					let content = await this.geFileContent( repo, path )

					const resOn = await this.opts?.hook?.onContent?.( {
						opts : this.opts,
						path : path,
						id   : key,
						content,
					} )

					content = resOn ? resOn : content

					if ( schema ) res[key] = await this.validateSchema( schema, content )
					else res[key] = content

				}

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

			const pinnedRepos = await this.getPinnedRepos() || []

			const response = await this.gh.request( 'GET /users/{username}/repos', {
				username : this.opts.user,
				headers  : this.opts.requestHeaders,
			} )

			const repoIDs    = response.data.map( d => d.name )
			const reposMatch = matcher( repoIDs, this.opts.repos )

			const repos = await Promise.all( response.data.map( async repo => {

				if ( !reposMatch.includes( repo.name ) ) return undefined

				const res = {
					id       : repo.name,
					url      : repo.html_url,
					desc     : repo.description || undefined,
					homepage : repo.homepage || undefined,

					isFork     : repo.fork || false,
					isTemplate : repo.is_template || false,
					isArchived : repo.archived || false,
					isDisabled : repo.disabled || false,
					isPrivate  : repo.private || false,
					isPinned   : pinnedRepos?.includes( repo.name ),

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
					license       : repo.license
						? {
							key  : repo.license.key,
							name : repo.license.name,
							url  : repo.license.url,
						}
						: undefined,
					content  : await this.getContent( repo.name ),
					releases : await this.getReleases( repo.name ),
				}

				const resHooked = await this.opts?.hook?.afterRepo?.( {
					data : res,
					opts : this.opts,
				} )
				return resHooked || res

				// return res

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
				ref     : this.opts.branch,
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
