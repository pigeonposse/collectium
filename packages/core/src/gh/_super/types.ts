
import type {
	Response,
	ResponseVoid,
} from '../../_shared/types'
import type { SchemaFn } from '../../_super/main'
import type { RepoRes }  from '../../gh/repo/main'
import type { Octokit }  from '@octokit/core'

type Content = string | object | undefined
type Input = string | string[]

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
	 * - **true**: Active
	 * - **false**: Desactive
	 * - **'no-assets'**: Does not get 'assets' from releases
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
	/**
	 * Hook for your opts.
	 */
	hook?: {
		/**
		 * Hook for each repo file.
		 *
		 * Useful for getting/transforming data from file contents.
		 */
		onContent?: ( params: {
			/**
			 * Github Options
			 */
			opts    : GitHubOpts
			/**
			 * File ID
			 */
			id      : string
			/**
			 * input path
			 */
			path    : string
			/**
			 * URL Content
			 */
			url     : string | undefined
			/**
			 * File Content
			 */
			content : Content
		} ) => Response<Content | ResponseVoid>
		/**
		 * Hook for after getting repositories data
		 */
		afterRepo? : ( params: {
			/**
			 * Github Options
			 */
			opts : GitHubOpts
			/**
			 * Object with all the data of the repository obtained
			 *
			 * Useful for getting/transforming data from repository.
			 */
			data : RepoRes[number]
		} ) => Response<RepoRes[number] | ResponseVoid>
	}
	/**
	 * @default
	 * const requestHeaders = { 'X-GitHub-Api-Version': '2022-11-28' }
	 */
	requestHeaders? : NonNullable<Parameters<Octokit['request']>[1] >['headers']
}

