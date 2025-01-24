import { Collectium } from '@collectium/core'
import { argv }       from 'node:process'

import githubPreset from '../src/main'

const token = argv[2]

const collectium = new Collectium( githubPreset( {
	user       : 'pigeonposse',
	branch     : 'main',
	userType   : 'org',
	token,
	configPath : [ '.pigeonposse' ],
	repos      : [ 'collectium' ],
} ) )

const data = await collectium.get()

console.dir( data, { depth: Infinity } )
