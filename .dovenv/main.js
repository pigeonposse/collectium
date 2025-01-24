import { defineConfig } from '@dovenv/core'
import {
	getSidebar,
	getWorkspaceConfig,
	pigeonposseMonorepoTheme,
	Predocs,
} from '@dovenv/theme-pigeonposse'

const core = await getWorkspaceConfig( {
	metaURL      : import.meta.url,
	path         : '../',
	packagesPath : './packages',
	corePath     : './packages/core',
} )
const ICON = {
	LIB      : '📚',
	BIN      : '🔢',
	CLI      : '🔢',
	REST_API : '🌐',
	START    : '🏁',
	API      : '📖',
	EXAMPLES : '💡',
	CORE     : '☀️',
}
export default defineConfig(
	pigeonposseMonorepoTheme( {
		core,
		// lint : { staged: { '*.{js,cjs,mjs,jsx,ts,cts,mts,tsx,json}': 'dovenv lint eslint --fix' } },
		docs : async config => {

			const sidebar = await getSidebar( config )

			return {
				vitepress : {
					ignoreDeadLinks : true,
					themeConfig     : { outline: { level: [ 2, 3 ] } },
					// vite            : { build: { chunkSizeWarningLimit: 1000 } },
				},
				sidebar : {
					'/guide/'       : sidebar,
					'/todo/'        : sidebar,
					'/contributors' : sidebar,
				},
				autoSidebar : {
					intro     : false,
					reference : false,
				},
				version : core.corePkg.version,
				pwa     : { manifest : { icons : [
					{
						src   : 'pwa-64x64.png',
						sizes : '64x64',
						type  : 'image/png',
					},
					{
						src   : 'pwa-192x192.png',
						sizes : '192x192',
						type  : 'image/png',
					},
					{
						src   : 'pwa-512x512.png',
						sizes : '512x512',
						type  : 'image/png',
					},
					{
						src     : 'maskable-icon-512x512.png',
						sizes   : '512x512',
						type    : 'image/png',
						purpose : 'maskable',
					},
				] } },
			}

		},
		repo : { commit : { scopes : [
			{
				value : 'packages',
				desc  : '📦 All or some packages',
			},
			{
				value : 'core',
				desc  : '☀️ Core package',
			},
			{
				value : 'env',
				desc  : 'Only dev environment',
			},
			{
				value : 'all',
				desc  : 'env, packages etc',
			},
		] } },
	} ),
	{ custom : { predocs : {
		desc : 'Build env documentation',
		fn   : async ( { config } ) => {

			const predocs = new Predocs( {
				index : {
					noFeatures : true,
					custom     : { features : [
						{
							title   : 'Get started',
							icon    : ICON.START,
							details : 'Start your project now',
							link    : '/guide',
						},
						{
							title   : 'Library',
							icon    : ICON.LIB,
							details : 'Check the documentation',
							link    : '/guide/core',
						},
						{
							title   : 'REST API',
							icon    : ICON.REST_API,
							details : 'Check the Rest API documentation',
							link    : '/guide/api',
						},
					] },
				},
				guideSection : { none : [
					'config',
					'plugin',
					'theme',
				] },
			}, config )

			await predocs.run()

		},
	} } },
)
