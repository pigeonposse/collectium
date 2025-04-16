import { defineConfig } from '@dovenv/core'
import {
	getSidebar,
	pigeonposseMonorepoTheme,
	Predocs,
} from '@dovenv/theme-pigeonposse'

import { core } from './core.js'

const ICON = {
	LIB      : '📚',
	BIN      : '🔢',
	CLI      : '🔢',
	REST_API : '🌐',
	START    : '🏁',
	API      : '📖',
	EXAMPLES : '💡',
	PRESET   : '💾',
	CORE     : '🌞',
	BUILDER  : '📦',
	CHECKER  : '✅',
}

export default defineConfig(
	pigeonposseMonorepoTheme( {
		core,
		docs : async utils => {

			const sidebar = await getSidebar( {
				utils,
				opts : { emojis : {
					check   : ICON.CHECKER,
					builder : ICON.BUILDER,
					lib     : ICON.LIB,
				} },
			} )

			return {
				llms      : { hostname: utils.pkg.extra?.docsURL },
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
				desc  : ICON.BUILDER + ' All or some packages',
			},
			{
				value : 'core',
				desc  : ICON.CORE + ' Core package',
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
		fn   : async ( { utils } ) => {

			const predocs = new Predocs( {
				opts : {
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
								link    : '/guide/lib',
							},
							{
								title   : 'REST API',
								icon    : ICON.REST_API,
								details : 'Check the Rest API documentation',
								link    : '/guide/api',
							},
							{
								title   : 'Presets',
								icon    : ICON.PRESET,
								details : 'Check the Library presets',
								link    : '/guide/preset',
							},
						] },
					},
					guideSection : { none : [
						'config',
						'plugin',
						'theme',
					] },
				},
				utils,
			} )

			await predocs.run()

		},
	} } },
)
