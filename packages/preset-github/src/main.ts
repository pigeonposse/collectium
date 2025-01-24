
import type { CollectiumOpts } from '@collectium/core'

export const setGithubPreset = <ID extends string = string>(

	data: Pick<NonNullable<CollectiumOpts['github']>[number], 'user' | 'branch' | 'token' | 'userType' | 'repos' > & {
		/**
		 * key ID of the reponse
		 * @default data.user
		 */
		id?         : ID
		/**
		 * Configuration file path(s) without extension for get repo information.
		 *
		 * The default value provides: [`.${this.id || this.user}.yml`,`.${{this.id || this.user}.yaml`]
		 * @default
		 * [`.${this.id || this.user}`]
		 */
		configPath? : string[]
	},
	opts: Omit<CollectiumOpts, 'github'> = { config : {
		skipError : true,
		skipWarn  : true,
	} },
): CollectiumOpts => {

	const id =  data.id || data.user

	return {
		...opts,
		github : { [id] : {
			...data,
			...{ content : {
				'config' : {
					input : ( data.configPath
						? data.configPath
						: [ '.' + id ] ).flatMap( p => [ `${p}.yml`, `${p}.yaml` ] ),
					schema : z => z.object( { web : z.record(
						z.string(),
						z.object( {
							name : z.string().optional(),
							type : z.array( z.enum( [
								'library',
								'cli',
								'api',
								'api-rest',
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
				'package' : {
					input  : 'package.json',
					schema : z => z.object( {} ).passthrough().optional(),
				},
				'readme' : {
					input  : 'README.md',
					schema : z => z.string(),
				},
				'composer' : {
					input  : 'composer.json',
					schema : z => z.object( {} ).passthrough().optional(),
				},
				'security' : {
					input  : 'SECURITY.md',
					schema : z => z.string().optional(),
				},
				'contributting' : {
					input  : 'CONTRIBUTING.md',
					schema : z => z.string().optional(),
				},
				'support' : {
					input  : 'SUPPORT.md',
					schema : z => z.string().optional(),
				},
				'code-of-conduct' : {
					input  : 'CODE_OF_CONDUCT.md',
					schema : z => z.string().optional(),
				},
			} },
		} },
	}

}

export default setGithubPreset
