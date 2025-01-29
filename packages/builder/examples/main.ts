import { createApp }   from '@collectium/api/standard'
import { Collectium }  from '@collectium/core'
import setGithubPreset from '@collectium/preset-github'

import build from '../src/main'

const collectium = new Collectium( setGithubPreset( {
	user       : 'pigeonposse',
	branch     : 'main',
	userType   : 'org',
	configPath : [ '.pigeonposse' ],
	repos      : [ 'collectium' ],

} ) )

const app = createApp( { collectium } )
await build( {
	schema : { input: collectium },
	api    : { input: app },
} )
