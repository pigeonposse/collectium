import type { Response } from '../../_shared/types'
import type { SchemaFn } from '../../_super/main'
import type { Octokit }  from '@octokit/core'

type Content = string | object | undefined
type Input = string | string[]
type ContentAll = { [key in string]: Content }

export type GitHubOpts = {
	/**
	 * User ID or Organization ID of GitHub
	 */
	user      : string
	/**
	 * GitHub token for get information
	 */
	token?    : string
	/**
	 * @default "user"
	 */
	userType? : 'user' | 'org'
	/**
	 * @default
	 * "main"
	 */
	branch?   : string
	/**
	 * List the IDs/patters of repositories to get
	 * @default
	 * ['*'] // all repos
	 * @example ["!.github"] // all less ".github" repo
	 * @example ["wordpress-*"] // only repos started with "wordpress-""
	 */
	repos?    : string[]
	/**
	 * List release repositories.
	 * Opts:
	 * - true: Active
	 * - false: Desactive
	 * - 'no-assets': Does not get 'assets' from releases
	 * @default false
	 */
	releases? : boolean | 'no-assets'
	/**
	 * Get repository content data.
	 * @default
	 * {
	 *   package: 'package.json',
	 * }
	 */
	content?        : Record<string, {
		/**
		 * Input path
		 */
		input   : Input
		/**
		 * Zod Schema for the input
		 */
		schema? : SchemaFn
	} | Input>
	// /**
	//  * Configuration file path(s) without extension for get repo information.
	//  *
	//  * Default value provides: [`.${this.user}.yml`,`.${this.user}.yaml`]
	//  * @default
	//  * [`.${this.user}`]
	//  */
	// configPath?   : string[]
	// /**
	//  * Zod Schema for your configuration file.
	//  * @default
	//  * (z) => z.object({}).passthrough()
	//  */
	// configSchema? : SchemaFn
	// /**
	//  * Get or transform data of repo files.
	//  */
	// onFile?        : ( opts: {
	// 	/**
	// 	 * Github username
	// 	 */
	// 	user     : string
	// 	/**
	// 	 * Current Github repo
	// 	 */
	// 	repo     : string
	// 	/**
	// 	 * Current Github branch
	// 	 */
	// 	branch   : string
	// 	/**
	// 	 * If current file is the config path
	// 	 */
	// 	isConfig : boolean
	// 	/**
	// 	 * File ID
	// 	 */
	// 	id       : string
	// 	/**
	// 	 * input path
	// 	 */
	// 	path     : string
	// 	/**
	// 	 * File Content
	// 	 */
	// 	content  : Content
	// } ) => Response<Content>
	hook?: {
		/**
		 * Get or transform content data of files.
		 */
		after: ( data: {
			/** Github Options */
			opts    : Readonly<GitHubOpts>
			/**
			 * File ID
			 */
			id      : string
			/**
			 * input path
			 */
			path    : string
			/**
			 * File Content
			 */
			content : Content
		} ) => Response<Content>
		/**
		 * Hook for after get all repos
		 */
		afterAll : <C extends ContentAll>( data: {
			/** Github Options */
			opts    : Readonly<GitHubOpts>
			/** Content */
			content : C
		} ) => Response<C>
	}
	/**
	 * @default
	 * const requestHeaders = { 'X-GitHub-Api-Version': '2022-11-28' }
	 */
	requestHeaders? : NonNullable<Parameters<Octokit['request']>[1] >['headers']
}

