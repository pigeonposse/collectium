import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( [
	{
		sourcemap   : false,
		declaration : true,
		failOnWarn  : true,
		rollup      : { esbuild : {
			minify : true,
			target : 'node20',
		} },
		externals : [ 'zod' ],
	},
] )
