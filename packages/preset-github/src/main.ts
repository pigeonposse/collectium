
import type { CollectiumOpts } from '@collectium/core'

export const setGithubPreset = (
	data: Pick<NonNullable<CollectiumOpts['github']>[number], 'user' | 'branch' | 'token' | 'userType' | 'configPath' >,
	opts: Omit<CollectiumOpts, 'github'> = { config : {
		skipError : true,
		skipWarn  : true,
	} },
): CollectiumOpts => ( {
	...opts,
	github : { collectium : {
		...data,
		...{
			// ignoreRepo : [ '.github' ],
			configPath : data.configPath
				? data.configPath
				: [ '.dovenv/collectium', '.collectium' ],
			files : {
				package : {
					input  : 'package.json',
					schema : z => z.object( {} ).passthrough().optional(),
				},
				readme : {
					input  : 'README.md',
					schema : z => z.string(),
				},
				composer : {
					input  : 'composer.json',
					schema : z => z.object( {} ).passthrough().optional(),
				},
			},
			configSchema : z => z.object( { web : z.record(
				z.string(),
				z.object( {
					name : z.string().optional(),
					type : z.array( z.enum( [
						'library',
						'cli',
						'web',
						'pwa',
						'bin',
						// game
						'browser-game',
						// plugin
						'plugin',
						'wp-plugin',
						'mautic-plugin',
						// theme
						'theme',
						'wp-theme',
						'mautic-theme',
						// browser
						'browser-extension',
						'chrome-extension',
						'chromium-extension',
						'firefox-extension',
						'safari-extension',
						'edge-extension',
						'brave-extension',
						'opera-extension',
						'operagx-extension',
						'yandex-extension',
						// desktop
						'desktop-app',
						'macos-app',
						'linux-app',
						'windows-app',
						// mobile
						'mobile-app',
						'ios-app',
						'android-app',
						// general
						'software',
					] ) ).default( [ 'library' ] ),
					status : z.enum( [
						'idea',
						'development',
						'coming-soon',
						'alpha',
						'beta',
						'active',
						'archived',
					] ).default( 'active' ),
					tags     : z.array( z.string() ).optional(),
					version  : z.string().optional(),
					desc     : z.string().optional(),
					homepage : z.string().url().optional(),
					docs     : z.string().url().optional(),
					license  : z.string().url().optional(),
					logo     : z.string().url().optional(),
					banner   : z.string().url().optional(),
				} ),
			) } ),
		},
	} },
} )

export default setGithubPreset
