import { Collectium } from '@collectium/core'
import { argv }       from 'node:process'

import githubPreset from '../src/main'

const token      = argv[2]
const opts       = githubPreset( {
	user       : 'pigeonposse',
	branch     : 'main',
	userType   : 'org',
	token,
	configPath : [ 'pigeonposse' ].flatMap( p => [ `.${p}.yml`, `.${p}.yaml` ] ),
	repos      : [ 'collectium' ],
} )
const collectium = new Collectium( opts )

const data = await collectium.get()

console.dir( opts, { depth: Infinity } )
console.dir( data, { depth: Infinity } )
