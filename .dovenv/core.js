import { getWorkspaceConfig } from '@dovenv/theme-pigeonposse'

export const core = await getWorkspaceConfig( {
	metaURL      : import.meta.url,
	path         : '../',
	packagesPath : './packages',
	corePath     : './packages/lib',
} )
