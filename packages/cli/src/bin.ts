#!/usr/bin/env node
import {
	name,
	version,
} from './const'
import {
	run,
	updater,
}  from './index'

export const cli = async () => {

	await run()
	await updater( {
		name,
		version,
	} )

}

cli()
