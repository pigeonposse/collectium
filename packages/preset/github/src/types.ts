import type { CollectiumOpts } from '@collectium/core'

type ExtractObj<T> = T extends Record<string, unknown> ? T : never
type GithubOpts = NonNullable<CollectiumOpts['github']>[number]

export type Data = Pick<
	GithubOpts,
	'user' | 'branch' | 'token' | 'userType' | 'repos' | 'hook' | 'releases'
>

export type Zod = Parameters<NonNullable<ExtractObj<ExtractObj<GithubOpts['content']>[number]>['schema']>>[0]
