import {
	mkdir,
	writeFile,
} from 'node:fs/promises'
import { dirname }   from 'node:path'
import { exit }      from 'node:process'
import { styleText } from 'node:util'

const bold = ( v:string ) => styleText( 'bold', v )
const desc = ( v:string ) => styleText( 'dim', v )

export const titleOut = ( v:string ) => '\n✦ ' + styleText( 'underline', bold( v ) )
export const infoOut = ( t:string, m?:string ) => styleText( 'cyan', '✦ ' + t + ( m ? desc( ' ' + m ) : '' ) )
export const successOut = ( t:string, m?:string ) => styleText( 'green', '✓ ' + t + ( m ? desc( ' ' + m ) : '' ) )
export const errorOut = ( v:string ) => styleText( 'red', `${'ｘ'} ${desc( v )}` )
export const boldOut = bold

export const ensureDir = async ( path: string ) => await mkdir( dirname( path ), { recursive: true } )
export const writeJSON = async <O extends object>( path: string, content: O ) => {

	await ensureDir( path )
	await writeFile( path, JSON.stringify( content, undefined, '\t' ) )

}

export const fnConstructor = async ( title: string, fn: () => Promise<void>, error = false ) => {

	console.log( titleOut( title ) )
	try {

		await fn()

	}
	catch ( e ) {

		if ( e instanceof Error )
			console.error( errorOut( e.message ) )
		console.error( e )
		if ( error ) exit()

	}

}
