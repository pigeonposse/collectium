import { Collectium } from '@collectium/core'
import { argv }       from 'node:process'

const token = argv[2]

import createLocalApp  from '../src/local'
import createSqliteApp from '../src/sqlite'
import createApp       from '../src/standard'

const collectium = new Collectium(  {
	github : { collective : {
		user     : 'pigeonposse',
		branch   : 'main',
		userType : 'org',
		token,
	} },
	config : {
		skipError : true,
		skipWarn  : true,
	},
} )

const app = argv.includes( 'local' )
	? createLocalApp( {
		collectium,
		opts : { path: './build/test.json' },
	} )
	: argv.includes( 'db' )
		? createSqliteApp( {
			collectium,
			opts : { path: './build/test.db' },
		} )
		: createApp( { collectium } )

export default app
