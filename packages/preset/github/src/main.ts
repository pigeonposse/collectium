
import type { CollectiumOpts } from '@collectium/core'

type GithubOpts = NonNullable<CollectiumOpts['github']>[number]
type Data = Pick<
	GithubOpts,
	'user' | 'branch' | 'token' | 'userType' | 'repos' | 'hook' | 'releases'
>
type ExtractObj<T> = T extends Record<string, unknown> ? T : never
type Zod = Parameters<NonNullable<ExtractObj<ExtractObj<GithubOpts['content']>[number]>['schema']>>[0]
type ConfigType = Zod.infer<ReturnType<typeof configSchema>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any

const configSchema = ( z: Zod ) => z.object( { web : z.record(
	z.string().describe( 'Project ID' ),
	z.object( {
		name : z.string().optional().describe( 'Project name.' ),
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
		] ) ).default( [ 'library' ] ).describe( 'Type of project.' ),
		status : z.enum( [
			'idea',
			'development',
			'coming-soon',
			'alpha',
			'beta',
			'active',
			'archived',
		] ).default( 'active' ).describe( 'Current project status.' ),
		version  : z.string().optional().describe( 'Project version.' ),
		desc     : z.string().optional().describe( 'Project description.' ),
		homepage : z.string().url().optional().describe( 'Homepage URL' ),
		docs     : z.string().url().optional().describe( 'Documentation URL.' ),
		license  : z.object( {
			name : z.string().optional().describe( 'License name.' ),
			url  : z.string().url().optional().describe( 'License URL.' ),
		} ).optional(),
		logo   : z.string().url().optional().describe( 'Logo URL.' ),
		banner : z.string().url().optional().describe( 'Banner URL.' ),
	} ).strict()
		.describe( 'Object with data for a specific project' ),
).describe( 'Object to add projects designed to be displayed on the web' ) } ).optional()

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
				'logo' : {
					input  : [ 'docs/public/logo.png', 'docs/logo.png' ],
					schema : z => z.string().optional(),
				},
				'banner' : {
					input  : [ 'docs/public/banner.png', 'docs/banner.png' ],
					schema : z => z.string().optional(),
				},
			},

			hook : { afterRepo : ( { data } ) => {

				if ( !data.content ) data.content = {}

				const setString      = ( v: Any, d?: string ) => v && typeof v === 'string' ? v : d
				const setStringArray = ( v: Any, d?: string[] ) => {

					const res = v && Array.isArray( v )
						? v.filter( c => typeof c === 'string' )
						: d
					return res && res.length ? res : undefined

				}

				if ( !data.content.config?.content
					&& ( setString( data.content.package?.content?.name ) || setString( data.content.composer?.content?.name ) )
				) {

					const pkg      = data.content.package?.content || {}
					const composer = data.content.composer?.content || {}

					const name     = ( setString( pkg.name ) || setString( composer.name ) ) as string
					const desc     = setString( pkg.description ) || setString( composer.description )
					const homepage = setString( pkg.homepage ) || setString( composer.homepage )

					const config: ConfigType = { web : { [name] : {
						name    : setString( pkg.extra?.productName, name ),
						type    : [ 'library' ],
						status  : 'active',
						version : setString( pkg.version ) || setString( composer.version ),
						desc,
						homepage,
						docs    : setString( pkg.extra?.docsURL ) || setString( pkg.extra?.docsUrl ),
						logo    : setString( data.content.logo?.url ),
						banner  : setString( data.content.banner?.url ),
					} } }
					const url                = setString( data.content.package?.url ) || setString( data.content.composer?.url )

					if ( url ) data.content = {
						...data.content,
						config : {
							url     : url,
							content : config,
						},
					}

					if ( !data.license ) data.license = { key: setString( pkg.license ) || setString( composer.license ) }
					if ( !data.homepage ) data.homepage = homepage
					if ( !data.desc ) data.desc = desc
					if ( !data.tags ) data.tags = setStringArray( pkg.keywords ) || setStringArray( composer.keywords )

				}

				return data

			} },

		} },
	}

}

export default setGithubPreset
