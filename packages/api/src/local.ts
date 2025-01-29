
import { createAppFn } from './core'
import {
	readJSON,
	writeJSON,
} from './utils'

/**
 * Creates an application that periodically saves and retrieves JSON data.
 * @param {object} data - The configuration object.
 * @param {object} data.opts - The options for the application.
 * @param {string} data.opts.path - Path to the file where data will be stored.
 * @param {number} [data.opts.loop=600000] - Time interval in milliseconds (default: 10 minutes).
 * @throws {Error} If the path is not provided.
 * @returns {object} The application with methods to access stored data.
 * @example
 * import createApp from '@collectium/api/local'
 * const app = createApp({ opts: { path: './data.json', loop: 300000 } });
 */
export const createApp = createAppFn<{
	/**
	 * Path to file for store the data
	 */
	path  : string
	/**
	 * Time loop in miliseconds
	 * @default 600000 // 10 mins
	 */
	loop? : number
}>( data => {

	const path = data.opts.path
	const loop = data.opts.loop || 600000
	if ( !path ) throw Error( 'Path does not exist' )

	const loadData = async () => {

		const content = await data.collectium.get( )

		await writeJSON( path, content )
		console.log( 'Data succesfully added to ' + path )

	}

	loadData()
	setInterval( loadData, loop )

	return  {
		all : {
			data : async () => {

				return await readJSON( path )

			},
			validate : undefined,
		},
		github : {
			data : async () => {

				const content = await readJSON( path )
				// @ts-ignore
				return content.github

			},
			validate : () => data.collectium.github ? true : false,
		},
		custom : {
			data : async () => {

				const content = await readJSON( path )
				// @ts-ignore
				return content.custom

			},
			validate : () => data.collectium.custom ? true : false,
		},
	}

} )

export default createApp
