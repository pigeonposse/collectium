import { Route } from 'backan'

import type { Collectium } from '@collectium/core'
import type { App }        from 'backan'

export class AppFactory<Env extends object> {

	constructor( public app: App<Env>, protected collectium: Collectium ) {}

	#addAllRoute() {

		const route = new Route<Env, 'all'>( { path: 'all' } )

		route.add(
			{
				method    : 'get',
				path      : '/',
				summary   : 'Get all data',
				responses : {
					200 : route.response.responseJSONSuccess( this.collectium.schema.res ),
					400 : route.response.responseJSONError400,
					500 : route.response.responseJSONError500,
				},
			},
			async c => {

				try {

					const data = await this.collectium.get()
					return route.response.addSuccessResponse( c, data )

				}
				catch ( e ) {

					return route.response.add500Error( c, e )

				}

			},
		)

		this.app.addRoute( route )

	}

	#addGitHubRoute() {

		const github = this.collectium.github
		if ( !github ) return

		const route = new Route<Env, 'github'>( { path: 'github'  } )

		route.add(
			{
				method    : 'get',
				path      : '/',
				summary   : 'Get GitHub data',
				responses : {
					200 : route.response.responseJSONSuccess( github.schema.res ),
					400 : route.response.responseJSONError400,
					500 : route.response.responseJSONError500,
				},
			},
			async c => {

				try {

					const data = await github.get()
					return route.response.addSuccessResponse( c, data )

				}
				catch ( e ) {

					return route.response.add500Error( c, e )

				}

			},
		)

		this.app.addRoute( route )

	}

	#addCustomRoute() {

		const custom = this.collectium.custom
		if ( !custom ) return

		const route = new Route<Env, 'custom'>( { path: 'custom' } )

		route.add(
			{
				method    : 'get',
				path      : '/',
				summary   : 'Get custom data',
				responses : {
					200 : route.response.responseJSONSuccess( custom.schema.res ),
					400 : route.response.responseJSONError400,
					500 : route.response.responseJSONError500,
				},
			},
			async c => {

				try {

					const data = await custom.get()
					return route.response.addSuccessResponse( c, data || {} )

				}
				catch ( e ) {

					return route.response.add500Error( c, e )

				}

			},
		)

		this.app.addRoute( route )

	}

	public run(): App<Env> {

		this.#addAllRoute()
		this.#addGitHubRoute()
		this.#addCustomRoute()

		// console.log( this.app )
		return this.app

	}

}
