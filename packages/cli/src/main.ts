
import { Checker }    from '@collectium/check'
import { Collectium } from '@collectium/core'
import { writeFile }  from 'node:fs/promises'
import { join }       from 'node:path'
import { cwd }        from 'node:process'

import { getConfig } from './config'
import {
	errorOut,
	helpOut,
	successOut,
	titleOut,
	versionOut,
} from './print'
import {
	existsCmd,
	existsFlag,
	getCMD,
	getFlagValue,
} from './process'

type Opts = Collectium['opts']

const CMD    = {
	CHECK  : existsCmd( 'check' ),
	RUN    : existsCmd( 'run' ),
	CONFIG : existsCmd( 'config' ),
}
const OPTION = {
	HELP    : existsFlag( 'help' ) || existsFlag( 'h' ),
	VERSION : existsFlag( 'version' ) || existsFlag( 'v' ),
	CONFIG  : getFlagValue( 'config' ) || getFlagValue( 'c' ),
	CWD     : getFlagValue( 'cwd' ),
	OUTPUT  : getFlagValue( 'output' ) || getFlagValue( 'o' ),
}

const run = async () => {

	try {

		if ( OPTION.HELP ) console.log( helpOut() )
		else if ( OPTION.VERSION ) console.log( versionOut() )
		else if ( OPTION.CONFIG ) {

			const config = await getConfig( OPTION.CONFIG ) as Opts

			if ( CMD.CHECK ) {

				console.log( titleOut( 'checking' ) )

				const id = getCMD( 'check' )
				if ( !id ) throw Error( 'Command need a value. Example: $0 check <id>' )

				const check = new Checker( config  )

				await check.run( id, { cwd: OPTION.CWD } )

			}
			else if ( CMD.CONFIG ) {

				console.log( titleOut( 'Configuration' ) )
				console.dir( config, { depth: Infinity } )

			}
			else if ( CMD.RUN ) {

				console.log( titleOut( 'Data' ) )
				const collectium = new Collectium( config )
				const data       = await collectium.get()

				console.dir( data, { depth: Infinity } )

				if ( OPTION.OUTPUT ) {

					const output = join( OPTION.CWD || cwd(), OPTION.OUTPUT.endsWith( '.json' ) ? OPTION.OUTPUT : OPTION.OUTPUT + '.json' )
					await writeFile(
						output,
						JSON.stringify( data, undefined, '\t' ),
					)
					console.log( '\n', successOut( 'Response in: ' + output ) )

				}

			}
			else console.error( helpOut() )

		}
		else {

			console.error( helpOut() )
			throw new Error( 'You need to add --config flag' )

		}

	}
	catch ( e ) {

		console.error( e instanceof Error ? errorOut( e.message ) : e )

	}

}

run()
