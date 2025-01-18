/* eslint-disable camelcase */
// import { z } from 'zod'

import { validateURL } from '../../_shared/validate'
import { GitHubSuper } from '../_super/main'

import type { ZodInfer } from '../../_shared/validate'

export type UserRes = ZodInfer<GitHubUser['schema']['res']>
export type TeamsResponse = UserRes['teams']

export class GitHubUser extends GitHubSuper {

	schema = { res : this.z.object( {
		id          : this.z.string(),
		avatar      : this.z.string(),
		publicRepos : this.z.number(),
		followers   : this.z.number(),
		blog        : this.z.string().optional(),
		email       : this.z.string().optional(),
		name        : this.z.string().optional(),
		description : this.z.string().optional(),
		teams       : this.z.array( this.z.object( {
			name    : this.z.string(),
			slug    : this.z.string(),
			desc    : this.z.string().optional(),
			members : this.z.array( this.z.object( {
				login    : this.z.string(),
				avatar   : this.z.string(),
				github   : this.z.string(),
				homepage : this.z.string(),
				name     : this.z.string().optional(),
				desc     : this.z.string().optional(),
				location : this.z.string().optional(),
			} ) ),
		} ) ).optional(),
	} ) }

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

			return  await Promise.all( membersPromises )

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
