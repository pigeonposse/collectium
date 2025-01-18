/**
 * Backan server.
 * @description Vite config.
 * @see https://backan.pigeonposse.com/guide/server
 */

import { App } from 'backan'

import {
	version,
	name,
} from '../package.json'
import { AppFactory } from './app'

import type { Collectium } from '@collectium/core'

export const createApp = ( collectium: Collectium, opts?: ConstructorParameters<typeof App>[0] ) => {

	if ( !collectium ) throw Error( 'collectium instance param not exist' )

	const backanApp  = new App( {
		version,
		title       : name,
		description : `${name} API documentation`,
		contact     : {
			url  : 'https://pigeonposse.com',
			mail : 'angelo@mail.com',
		},
		...opts || {},
	} )
	const appFactory = new AppFactory( backanApp, collectium )
	appFactory.run()

	return appFactory.app

}
