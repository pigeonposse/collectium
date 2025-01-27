
import { core }        from '../../../.dovenv/core'
import setGithubPreset from '../../preset/github/src/main'
import { Checker }     from '../src/main'

const opts = setGithubPreset( {
	id         : 'pigeonposse',
	user       : 'pigeonposse',
	branch     : 'main',
	userType   : 'org',
	configPath : [ '.pigeonposse' ],
	repos      : [ 'collectium' ],

}, { config : {
	debug     : true,
	skipError : true,
	skipWarn  : true,
} } )

const check = new Checker( opts )

check.run( 'pigeonposse', { cwd: core.workspaceDir } )
