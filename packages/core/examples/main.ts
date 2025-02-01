import { argv } from 'node:process'

import { Collectium } from '../src/main'

const token = argv[2]

const collectium = new Collectium( {
	github : { test : {
		user     : 'pigeonposse',
		branch   : 'main',
		userType : 'org',
		token,
		repos    : [ 'bepp' ],
		content  : {
			package : {
				input  : 'package.json',
				schema : z => z.object( {} ).passthrough().optional(),
			},
			composer : {
				input  : 'composer.json',
				schema : z => z.object( {} ).passthrough().optional(),
			},
			readme : {
				input  : 'README.md',
				schema : z => z.string(),
			},
			logo : {
				input  : 'docs/public/logo.png',
				schema : z => z.string(),
			},
		},
	} },
	config : {
		skipError : true,
		skipWarn  : true,
	},
} )

const data = await collectium.get()

console.dir( data, { depth: Infinity } )
