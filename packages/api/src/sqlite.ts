import { DatabaseSync } from 'node:sqlite'

import { createAppFn } from './core'

/**
 * Creates an application that synchronizes data with an SQLite database.
 * @param {object} [data] - The configuration object.
 * @param {object} [data.opts] - The options for the application.
 * @param {string} [data.opts.path=':memory:'] - Path to the SQLite database file.
 * @param {number} [data.opts.loop=600000] - Time interval in milliseconds for saving data.
 * @throws {Error} If the database path is not provided.
 * @returns {object} The application with methods to access stored data.
 * @example
 * import createApp from '@collectium/api/sqlite'
 * const app = createApp({ opts: { path: './database.db', loop: 300000 } });
 */
export const createApp = createAppFn<{
	/**
	 * SQLITE file path
	 * @default ':memory:'
	 */
	path? : string
	/**
	 * Save interval in milliseconds
	 * @default 600000 // 10 min
	 */
	loop? : number
} | undefined>( data => {

	const path = data.opts?.path || ':memory:'
	const loop = data.opts?.loop || 600000

	if ( !path ) throw new Error( 'Database path is required' )

	const db = new DatabaseSync( path )

	db.exec( `
    CREATE TABLE IF NOT EXISTS app_data (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  ` )

	const loadData = async () => {

		try {

			const content = JSON.stringify( await data.collectium.get() )
			const insert  = db.prepare(
				'INSERT OR REPLACE INTO app_data (key, value) VALUES (?, ?)',
			)

			db.exec( 'BEGIN TRANSACTION' )
			insert.run( 'all_data', content )
			db.exec( 'COMMIT' )

			console.log( `Data successfully added to ${path}` )

		}
		catch ( error ) {

			db.exec( 'ROLLBACK' )
			console.error( 'Error saving data:', error )

		}

	}
	loadData()
	setInterval( loadData, loop )

	return {
		all : {
			data : async () => {

				const row = db.prepare( 'SELECT value FROM app_data WHERE key = ?' ).get( 'all_data' )
				if ( !row ) throw new Error( 'No data found' )
				// @ts-ignore
				return JSON.parse( row.value )

			},
			validate : undefined,
		},
		github : {
			data : async () => {

				// @ts-ignore
				const allData = await ( await db.prepare( 'SELECT value FROM app_data WHERE key = ?' ).get( 'all_data' ) )?.value
				if ( !allData ) throw new Error( 'GitHub data not found' )
				return JSON.parse( allData ).github

			},
			validate : () => Boolean( data.collectium.github ),
		},
		custom : {
			data : async () => {

				// @ts-ignore
				const allData = await ( await db.prepare( 'SELECT value FROM app_data WHERE key = ?' ).get( 'all_data' ) )?.value
				if ( !allData ) throw new Error( 'Custom data not found' )
				return JSON.parse( allData ).custom

			},
			validate : () => Boolean( data.collectium.custom ),
		},
	}

} )

export default createApp
