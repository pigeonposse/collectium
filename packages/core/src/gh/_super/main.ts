import { Octokit } from '@octokit/core'

import { CollectiumSuper } from '../../_super/main'

import type { GitHubOpts }    from './types'
import type { RequiredTypes } from '../../_shared/types'

type GitHubOptsWithDefaults = RequiredTypes<
	GitHubOpts,
	'userType' | 'branch' | 'configPath' | 'configSchema' | 'files' | 'skipError' | 'requestHeaders'
>

const ERROR_ID = {
	GET_REPO_FILE_CONTENT : 'GET_REPO_FILE_CONTENT',
	GET_REPO_CONTENT      : 'GET_REPO_CONTENT',
	GET_REPO_DATA         : 'GET_REPO_DATA',
	GET_USER_DATA         : 'GET_USER_DATA',
	GET_USER_TEAMS_DATA   : 'GET_USER_TEAMS_DATA',
} as const

type E = typeof ERROR_ID[keyof typeof ERROR_ID]

export class GitHubSuper extends CollectiumSuper<
	GitHubOptsWithDefaults, E
>  {

	protected gh

	constructor( opts : GitHubOpts, config?: GitHubSuper['config'] ) {

		const options: this['opts'] = {
			...opts,
			branch     : opts.branch || 'main',
			configPath : ( Array.isArray( opts.configPath )
				? opts.configPath
				: [ opts.configPath || `.${opts.user}` ] ).flatMap( p => [ `${p}.yml`, `${p}.yaml` ] ),
			userType       : opts.userType || 'user',
			configSchema   : opts.configSchema ? opts.configSchema : z => z.object( {} ).passthrough(),
			files          : opts.files || { pkg: 'package.json' },
			skipError      : opts.skipError || false,
			requestHeaders : {
				...( opts.requestHeaders || {} ),
				'X-GitHub-Api-Version' : '2022-11-28', // latest: https://docs.github.com/en/rest/about-the-rest-api/api-versions?apiVersion=2022-11-28
			},
		}

		super( {
			opts     : options,
			config,
			ERROR_ID : ERROR_ID,
		} )

		this.gh = new Octokit( {
			auth    : opts.token,
			request : { signal: this.controller.signal },
		} )

		console.debug( { options: this.opts } )

	}

	async getRateLimit() {

		const res = await this.gh.request( 'GET /rate_limit', { headers: this.opts.requestHeaders } )

		if ( !res || !res.data || !res.data.resources || !res.data.resources.core )
			return false

		return res.data.resources

	}

	async hasRateLimit( top: number = 10 ) {

		const res = await this.getRateLimit()

		if ( !res ) return true
		const core = res.core

		console.debug( {
			id   : 'github-rate-limit',
			data : {
				core,
				top,
			},
		} )

		if ( ( Number( core.used ) + top ) >= Number( core.limit ) ) return true
		return false

	}

}

