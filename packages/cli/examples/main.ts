
import setGithubPreset from '../../preset/github/src/main'

export default setGithubPreset( {
	id         : 'pigeonposse',
	user       : 'pigeonposse',
	branch     : 'main',
	userType   : 'org',
	configPath : [ '.pigeonposse' ],
	repos      : [ 'collectium' ],

}, { config : {
	debug     : false,
	skipError : true,
	skipWarn  : true,
} } )

// const config = opts.github?.['pigeonposse']['content'] as ConstructorParameters<typeof Checker>[0]
// const check  = new Checker( config )

// check.run( core.workspaceDir )
