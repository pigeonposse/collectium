/* eslint-disable @stylistic/object-curly-newline */
import { Route } from 'backan'
import { App }   from 'backan'

import {
	version,
	name,
} from '../package.json'

import type { Collectium } from '@collectium/core'

type Routes<Opts> = ( data:{
	collectium : Collectium
	opts       : Opts
} ) => {
	all: {
		data      : Collectium['get']
		validate? : () => boolean
	}
	github: {
		data      : Collectium['github']['get']
		validate? : () => boolean
	}
	custom: {
		data      : Collectium['custom']['get']
		validate? : () => boolean
	}
}

class AppCore<Env extends object, Opts> {

	#route

	constructor(
		public app: App<Env>,
		protected collectium: Collectium,
		routes: Routes<Opts>,
		opts: Opts,
	) {

		this.#route = routes( {
			collectium : this.collectium,
			opts       : opts,
		} )

	}

	#addAllRoute() {

		const exists = this.#route.all.validate ? this.#route.all.validate() : true
		if ( !exists ) return
		const route = new Route<Env, 'all'>( { path: 'all' } )

		route.add(
			{
				method    : 'get',
				path      : '/',
				summary   : 'Get all data',
				responses : {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					200 : route.response.responseJSONSuccess( this.collectium.schema.res as any ),
					400 : route.response.responseJSONError400,
					500 : route.response.responseJSONError500,
				},
			},
			async c => {

				try {

					const data = await this.#route.all.data( )
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

		const exists = this.#route.github.validate ? this.#route.github.validate() : true
		if ( !exists ) return

		const route = new Route<Env, 'github'>( { path: 'github'  } )

		route.add(
			{
				method    : 'get',
				path      : '/',
				summary   : 'Get GitHub data',
				responses : {
					200 : route.response.responseJSONSuccess( this.collectium.github.schema.res ),
					400 : route.response.responseJSONError400,
					500 : route.response.responseJSONError500,
				},
			},
			async c => {

				try {

					const data = await this.#route.github.data( )
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

		const exists = this.#route.custom.validate ? this.#route.custom.validate() : true
		if ( !exists ) return

		const route = new Route<Env, 'custom'>( { path: 'custom' } )

		route.add(
			{
				method    : 'get',
				path      : '/',
				summary   : 'Get custom data',
				responses : {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					200 : route.response.responseJSONSuccess( this.collectium.custom.schema.res as any ),
					400 : route.response.responseJSONError400,
					500 : route.response.responseJSONError500,
				},
			},
			async c => {

				try {

					const data = await this.#route.custom.data( )

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

type CreateOpts =  {
	/** Collectium instance */
	collectium : Collectium
	/** App Options */
	appOpts?   : ConstructorParameters<typeof App>[0]
}

export const createAppFn = <Opts = undefined>( routes: Routes<Opts>, description = `${name} API documentation` ) => (
	data: Opts extends undefined ?
		CreateOpts : CreateOpts & {
			/** Options */
			opts : Opts
		},
) => {

	if ( !data.collectium ) throw Error( 'collectium instance param not exist' )

	const backanApp = new App( {
		version,
		title   : name,
		description,
		contact : {
			url  : 'https://pigeonposse.com',
			mail : 'angelo@pigeonposse.com',
		},
		...data.appOpts || {},
	} )

	const appFactory = new AppCore(
		backanApp,
		data.collectium,
		routes,
		// @ts-ignore
		data.opts || undefined,
	)

	appFactory.run()

	return appFactory.app

}
