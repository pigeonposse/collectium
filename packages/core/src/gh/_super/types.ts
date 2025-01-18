import type { Response } from '../../_shared/types'
import type { SchemaFn } from '../../_super/main'
import type { Octokit }  from '@octokit/core'

type Content = string | object | undefined
export type GitHubOpts = {
	/**
	 * User ID or Organization ID of GitHub
	 */
	user          : string
	/**
	 * GitHub token for get information
	 */
	token?        : string
	/**
	 * @default "user"
	 */
	userType?     : 'user' | 'org'
	/**
	 * @default
	 * const branch = "main"
	 */
	branch?       : string
	/**
	 * List the IDs of repositories to ignore
	 */
	ignoreRepo?   : string[]
	/**
	 * Configuration file path(s) without extension for get repo information.
	 *
	 * Default value provides: [`.${this.user}.yml`,`.${this.user}.yaml`]
	 * @default
	 * const configPath = [`.${this.user}`]
	 */
	configPath?   : string[]
	/**
	 * Zod Schema for your configuration file.
	 * @default
	 * const configSchema = (z) => z.object({}).passthrough()
	 */
	configSchema? : SchemaFn
	/**
	 * Repo files to get data.
	 * @default
	 * const files = {pkg: 'package.json' }
	 */
	files?        : Record<string, {
		/**
		 * Input path
		 */
		input   : string
		/**
		 * Schema for the input
		 */
		schema? : SchemaFn
	} | string>
	/**
	 * Get or transform data of repo files.
	 */
	onFile?        : ( opts: {
		/**
		 * Github username
		 */
		user     : string
		/**
		 * Current Github repo
		 */
		repo     : string
		/**
		 * Current Github branch
		 */
		branch   : string
		/**
		 * If current file is the config path
		 */
		isConfig : boolean
		/**
		 * File ID
		 */
		id       : string
		/**
		 * input path
		 */
		path     : string
		/**
		 * File Content
		 */
		content  : Content
	} ) => Response<Content>
	/**
	 * Ignore repo errors.
	 * If true, the error when getting data from the repository is ignored and undefined is returned
	 * @default false
	 */
	skipError?      : boolean
	/**
	 * @default
	 * const requestHeaders = { 'X-GitHub-Api-Version': '2022-11-28' }
	 */
	requestHeaders? : NonNullable<Parameters<Octokit['request']>[1] >['headers']
}

