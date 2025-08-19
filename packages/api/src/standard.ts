import { createAppFn } from './core'

/**
 * Creates an application that retrieves and validates data.
 *
 * @param   {object} data - The data collection object.
 * @returns {object}      The application with methods to access stored data.
 * @example
 * import createApp from '@collectium/api/standard'
 * const app = createApp();
 */

export const createApp = createAppFn( data => ( {
	all : {
		data     : async () => await data.collectium.get(),
		validate : undefined,
	},
	github : {
		data     : async () => await data.collectium.github.get(),
		validate : () => data.collectium.github ? true : false,
	},
	custom : {
		data     : async () => await data.collectium.custom.get(),
		validate : () => data.collectium.custom ? true : false,
	},
} ) )

export default createApp
