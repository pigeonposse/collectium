
import type { CollectiumOpts } from '@collectium/core'

type GithubOpts = NonNullable<CollectiumOpts['github']>[number]
type Data = Pick<
	GithubOpts,
	'user' | 'branch' | 'token' | 'userType' | 'repos' | 'hook' | 'releases'
>
type ExtractObj<T> = T extends Record<string, unknown> ? T : never
type Zod = Parameters<NonNullable<ExtractObj<ExtractObj<GithubOpts['content']>[number]>['schema']>>[0]
type ConfigType = Zod.infer<ReturnType<typeof configSchema>>

const configSchema = ( z: Zod ) => z.object( { web : z.record(
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
) } ).optional()

export const setGithubPreset = <ID extends string = string>(
	data: Data & {
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

	const {
		id  = data.id || data.user,
		configPath,
		hook: _hook,
		...rest
	} = data

	const input = Array.from( new Set(
		( configPath
			? configPath
			: [ '.' + id ]
		)
			.map( p => p.replace( '.yml', '' ).replace( '.yaml', '' ) )
			.flatMap(
				p => [ `${p}.yml`, `${p}.yaml` ],
			),
	) )

	return {
		...opts,
		github : { [id] : {
			...rest,
			content : {
				'config' : {
					input  : input,
					schema : z => configSchema( z ),
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
			},

			hook : { afterRepo : ( { data } ) => {

				if ( !data.content ) data.content = {}

				if (
					!data.content.config
					&& data.content.package
					&& ( typeof data.content.package === 'object' && 'name' in data.content.package && typeof data.content.package.name === 'string' )
				) {

					const pkg      = data.content.package
					const homepage = 'homepage' in pkg && typeof pkg.homepage === 'string' ? pkg.homepage : undefined
					const desc     = 'description' in pkg && typeof pkg.description === 'string' ? pkg.description as string : undefined

					const config: ConfigType = { web : { [pkg.name as string] : {
						name    : pkg.name as string,
						type    : [ 'library' ],
						status  : 'active',
						version : 'version' in pkg ? pkg.version as string : undefined,
						desc,
						homepage,

						// docs     : z.string().url().optional(),
						// license  : z.string().url().optional(),
						// logo     : z.string().url().optional(),
						// banner   : z.string().url().optional(),
					} } }

					data.content = {
						...data.content,
						config : config,
					}
					if ( !data.license )
						data.license = { key: 'license' in pkg && typeof pkg.license === 'string' ? pkg.license  : undefined }
					if ( !data.homepage ) data.homepage = homepage
					if ( !data.desc ) data.desc = desc
					if ( !data.tags ) data.tags = 'keywords' in pkg ? pkg.keywords as string[] : undefined

				}

				return data

			} },

		} },
	}

}

export default setGithubPreset
