// import { Collectium } from '@collectium/core'
import { argv } from 'node:process'

import { Collectium } from '../../../core/src/main' // for dev
import githubPreset   from '../src/main'

const token = argv[2]
const opts  = githubPreset( {
	user       : 'pigeonposse',
	branch     : 'main',
	userType   : 'org',
	token,
	configPath : [ '.pigeonposse' ],
	repos      : [ 'collectium' ],

}, { config : {
	debug     : true,
	skipError : true,
	skipWarn  : true,
} } )

const collectium = new Collectium( opts )

const data = await collectium.get()

console.dir( data, { depth: Infinity } )
