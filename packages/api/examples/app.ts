import { Collectium } from '@collectium/core'
import { argv }       from 'node:process'

const token = argv[2]
import { createApp } from '../src/main'

const collectium = new Collectium(  {
	github : { collective : {
		user       : 'pigeonposse',
		branch     : 'main',
		userType   : 'org',
		token,
		configPath : [ '.pigeonposse' ],
	} },
	config : {
		skipError : true,
		skipWarn  : true,
	},
} )

const app = createApp( collectium )
// console.log( app.getOpenApiObject() )

export default app
