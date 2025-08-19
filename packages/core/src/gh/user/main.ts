/* eslint-disable camelcase */
// import { z } from 'zod'

import { getContent } from '../../_shared/string'
import {
	validateURL,
	z,
} from '../../_shared/validate'
import { GitHubSuper } from '../_super/main'

import type { ZodInfer } from '../../_shared/validate'

export type UserRes = ZodInfer<GitHubUser['schema']['res']>
export type TeamsResponse = UserRes['teams']

const FUNDING_PROVIDER = {
	custom         : 'custom',
	github         : 'github',
	opencollective : 'opencollective',
	kofi           : 'kofi',
	polar          : 'polar',
	tidelift       : 'tidelift',
	patreon        : 'patreon',
} as const

const SOCIAL_PROVIDER = {
	custom         : 'custom',
	twitter        : 'twitter',
	instagram      : 'instagram',
	medium         : 'medium',
	opencollective : 'opencollective',
} as const

type Social = typeof SOCIAL_PROVIDER[keyof typeof SOCIAL_PROVIDER]
type Funding = typeof FUNDING_PROVIDER[keyof typeof FUNDING_PROVIDER]
const SOCIAL  = Object.values( SOCIAL_PROVIDER )
const FUNDING = Object.values( FUNDING_PROVIDER )

type FundingGH = {
	custom?          : string | string[]
	github?          : string | string[]
	open_collective? : string | string[]
	ko_fi?           : string | string[]
	polar?           : string | string[]
	tidelift?        : string | string[]
	patreon?         : string | string[]
}
export class GitHubUser extends GitHubSuper {

	schema = { res : z.object( {
		id          : z.string(),
		avatar      : z.string(),
		publicRepos : z.number(),
		followers   : z.number(),
		blog        : z.string().optional(),
		email       : z.string().optional(),
		name        : z.string().optional(),
		description : z.string().optional(),
		social      : z.array( z.object( {
			provider : z.enum( SOCIAL as [Social] ),
			url      : z.string(),
		} ) ).optional(),
		funding : z.array( z.object( {
			provider : z.enum( FUNDING as [Funding] ),
			url      : z.string(),
		} ) ).optional(),
		teams : z.array( z.object( {
			name    : z.string(),
			slug    : z.string(),
			desc    : z.string().optional(),
			members : z.array( z.object( {
				login    : z.string(),
				avatar   : z.string(),
				github   : z.string(),
				homepage : z.string(),
				name     : z.string().optional(),
				desc     : z.string().optional(),
				location : z.string().optional(),
			} ) ),
		} ) ).optional(),
	} ) }

	async getSocial(): Promise<UserRes['social'] | undefined> {

		try {

			const res = await this.gh.request( 'GET /users/{username}/social_accounts', {
				username : this.opts.user,
				headers  : this.opts.requestHeaders,
			} )

			if ( res.data ) return res.data.map( d => ( {
				provider : d.url.startsWith( 'https://opencollective.com/' )
					? 'opencollective'
					: d.url.startsWith( 'https://medium.com/' )
						? 'medium'
						: SOCIAL.includes( d.provider as Social ) ? d.provider as Social : 'custom',
				url : d.url,
			} ) )
			return undefined

		}
		catch ( _e ) {

			return undefined

		}

	}

	#setFundingUrl( data: FundingGH ): UserRes['funding'] {

		const transformPlatform = ( platform: string, accounts?: FundingGH[keyof FundingGH] ): UserRes['funding'] => {

			if ( !accounts ) return undefined

			if ( typeof accounts === 'string' ) accounts = [ accounts ]

			if ( platform === 'github' )
				return accounts.map( account => ( {
					provider : FUNDING_PROVIDER.github,
					url      : `https://github.com/sponsors/${account}`,
				} ) )
			else if ( platform === 'ko_fi' )
				return accounts.map( account => ( {
					provider : FUNDING_PROVIDER.kofi,
					url      : `https://ko-fi.com/${account}`,
				} ) )
			else if ( platform === 'tidelift' )
				return accounts.map( account => ( {
					provider : FUNDING_PROVIDER.tidelift,
					url      : `https://tidelift.com/subscription/pkg/${account.replace( '/', '-' )}`,
				} ) )
			else if ( platform === 'open_collective' )
				return accounts.map( account => ( {
					provider : FUNDING_PROVIDER.opencollective,
					url      : `https://opencollective.com/${account}`,
				} ) )
			else if ( platform === 'polar' )
				return accounts.map( account => ( {
					provider : FUNDING_PROVIDER.polar,
					url      : `https://polar.sh/${account}`,
				} ) )
			else if ( platform === 'patreon' )
				return accounts.map( account => ( {
					provider : FUNDING_PROVIDER.patreon,
					url      : `https://www.patreon.com/${account}`,
				} ) )
			else if ( platform === 'custom' )
				return accounts.map( account => ( {
					provider : 'custom',
					url      : account,
				} ) )
			else
				throw new Error( `Unknown platform ${platform}` )

		}

		if ( typeof data !== 'object' || !Object.keys( data ).length ) return undefined

		return Object.entries( data )
			.flatMap( ( [ k, v ] ) => transformPlatform( k, v ) )
			.filter( d => d !== undefined )

	}

	async getFunding() {

		try {

			const response = await this.gh.graphql( `
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        object(expression: "HEAD:FUNDING.yml") {
          ... on Blob {
            text
          }
        }
      }
    }
  `, {
				owner : this.opts.user,
				repo  : this.opts.userType === 'org' ? '.github' : this.opts.user,
			} )

			// @ts-ignore
			const fundingText = response.repository?.object?.text

			if ( !fundingText ) throw new Error( 'FUNDING.yml file not found or empty' )

			const fundingData = await getContent<FundingGH>( fundingText )

			if ( !fundingData || typeof fundingData === 'string' || !Object.keys( fundingData ).length ) return undefined
			const res = this.#setFundingUrl( fundingData )
			return res

		}
		catch ( error ) {

			console.warn( 'Error fetching funding data:', error )
			return undefined

		}

	}

	async getOrgTeams(): Promise<TeamsResponse | undefined> {

		try {

			const teamsResponse = await this.gh.request( 'GET /orgs/{org}/teams', {
				org     : this.opts.user,
				headers : this.opts.requestHeaders,
			} )

			const teams = teamsResponse.data

			const membersPromises = teams.map( async team => {

				const membersResponse = await this.gh.request( 'GET /orgs/{org}/teams/{team_slug}/members', {
					org       : this.opts.user,
					team_slug : team.slug,
					headers   : this.opts.requestHeaders,
				} )

				const membersInfo = membersResponse.data.map( async member => {

					const userInfoResponse = await this.gh.request( 'GET /users/{username}', {
						username : member.login,
						headers  : this.opts.requestHeaders,
					} )

					const userInfo = userInfoResponse.data
					let blog       = userInfo.blog || undefined
					if ( blog ) blog = await validateURL( blog )
					if ( !blog ) blog = userInfo.html_url

					return {
						login    : userInfo.login,
						avatar   : userInfo.avatar_url,
						github   : userInfo.html_url,
						homepage : blog,
						name     : userInfo.name || undefined,
						desc     : userInfo.bio || undefined,
						location : userInfo.location || undefined,
					}

				} )

				return {
					name    : team.name,
					slug    : team.slug,
					desc    : team.description || undefined,
					members : await Promise.all( membersInfo ),
				}

			} )

			return await Promise.all( membersPromises )

		}
		catch ( e ) {

			this.setError( {
				id   : this.ERROR_ID.GET_USER_TEAMS_DATA,
				data : { e },
			} )
			return undefined

		}

	}

	async get(): Promise<UserRes | undefined> {

		try {

			const response = ( this.opts.userType === 'org' )
				? await this.gh.request( 'GET /orgs/{org}', {
					org     : this.opts.user,
					headers : this.opts.requestHeaders,
				} )
				: await this.gh.request( 'GET /users/{username}', {
					username : this.opts.user,
					headers  : this.opts.requestHeaders,
				} )

			const data = response.data

			return {
				id          : data.login,
				blog        : data.blog || undefined,
				email       : data.email || undefined,
				name        : data.name || undefined,
				// @ts-ignore
				description : typeof data.description == 'string' ? data.description : undefined,
				avatar      : data.avatar_url,
				publicRepos : data.public_repos,
				followers   : data.followers,
				funding     : await this.getFunding(),
				social      : await this.getSocial(),
				teams       : this.opts.userType === 'org' ? await this.getOrgTeams() : undefined,

			}

		}
		catch ( e ) {

			this.setError( {
				id   : this.ERROR_ID.GET_USER_DATA,
				data : { e },
			} )

			return undefined

		}

	}

}
