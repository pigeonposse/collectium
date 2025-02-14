
import {
	configSchema,
	configTags,
} from './config'

import type { ConfigType }     from './config'
import type { Data }           from './types'
import type { CollectiumOpts } from '@collectium/core'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any

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
		/**
		 * Add custom types in your Repo config
		 */
		customType? : string[]
	},
	opts: Omit<CollectiumOpts, 'github'> = { config : {
		skipError : true,
		skipWarn  : true,
	} },
): CollectiumOpts => {

	const {
		id  = data.id || data.user,
		configPath,
		customType,
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
					schema : z => configSchema( z, customType ),
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

			hook : {
				onContent : ( {
					path, content, url,
				} ) => {

					if ( path.endsWith( '.png' ) && content )
						return url

					return content

				},
				afterRepo : ( { data } ) => {

					if ( !data.content ) data.content = {}

					const setString      = ( v: Any, d?: string ) => v && typeof v === 'string' ? v : d
					const setBool        = ( v: Any, d?: boolean ) => typeof v === 'boolean' ? v : d
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
						const noConfig = setBool( pkg.extra?.config ) === false
						if ( noConfig ) return data

						const name     = ( setString( pkg.name ) || setString( composer.name ) ) as string
						const desc     = setString( pkg.description ) || setString( composer.description )
						const homepage = setString( pkg.homepage ) || setString( composer.homepage )
						const getTypes = (): string[] | undefined => {

							const types = setString( pkg.extra?.type ) ? [ setString( pkg.extra?.type ) ] : setStringArray( pkg.extra?.type )
							if ( !types ) return
							const validTypes = configTags( customType )
							const isVaLid    = types.every( v => v && validTypes.includes( v ) )
							if ( isVaLid ) return types.filter( d => typeof d === 'string' )

						}
						const config: ConfigType = { web : { [name] : {
							name      : setString( pkg.extra?.productName, name ),
							type      : getTypes() || [ 'library' ],
							status    : 'active',
							version   : setString( pkg.version ) || setString( composer.version ),
							desc,
							homepage,
							changelog : setString( pkg.extra?.changelogURL ) || setString( pkg.extra?.changelogUrl ),
							docs      : setString( pkg.extra?.docsURL ) || setString( pkg.extra?.docsUrl ),
							library   : setString( pkg.extra?.libraryURL ) || setString( pkg.extra?.libraryUrl ),
							container : setString( pkg.extra?.containerURL ) || setString( pkg.extra?.containerUrl ),
							services  : {
								npm       : setString( pkg.extra?.npmURL ) || setString( pkg.extra?.npmUrl ),
								jsr       : setString( pkg.extra?.jsrURL ) || setString( pkg.extra?.jsrUrl ),
								dockerhub : setString( pkg.extra?.dockerhubURL ) || setString( pkg.extra?.dockerhubUrl ),
							},
							logo   : setString( data.content.logo?.url ),
							banner : setString( data.content.banner?.url ),
						} } }

						const url = setString( data.content.package?.url ) || setString( data.content.composer?.url )

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

				},
			},

		} },
	}

}

export default setGithubPreset
