import { Updater } from '@clippium/updater'

import {
	dim,
	bold,
	italic,
	green,
	cyan,
} from './print'

/**
 * Checks if a package needs to be updated.
 *
 * @param   {object}        opts         - options
 * @param   {string}        opts.name    - name of the package
 * @param   {string}        opts.version - current version of the package
 * @returns {Promise<void>}
 */
export const updater = async ( opts:{
	name    : string
	version : string
} ) => {

	const {
		name, version,
	} = opts
	const _updater = new Updater( {
		version,
		name,
	} )

	const data = await _updater.get()

	if ( !data ) return

	console.log( `
        
║ 📦 ${bold( 'Update available' )} ${dim( data.currentVersion )} → ${green( data.latestVersion )} ${italic( `(${data.type})` )}
║ Run ${cyan( data.packageManager + ' i ' + name )} to update
		
` )

}
