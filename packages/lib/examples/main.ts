import { argv } from 'node:process'

import { Collectium } from '../src/main'

const token = argv[2]

const collectium = new Collectium( {
	github : { test : {
		user     : 'pigeonposse',
		branch   : 'main',
		userType : 'org',
		token,
		// repos    : [ '.github' ],
	} },
	config : {
		skipError : true,
		skipWarn  : true,
	},
} )

const data = await collectium.get()

console.dir( data, { depth: Infinity } )
