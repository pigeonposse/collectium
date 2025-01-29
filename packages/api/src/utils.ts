import {
	mkdir,
	readFile,
	writeFile,
} from 'node:fs/promises'
import { dirname } from 'node:path'

export const ensureDir = async ( path: string ) => await mkdir( dirname( path ), { recursive: true } )
export const writeJSON = async <O extends object>( path: string, content: O ) => {

	await ensureDir( path )
	await writeFile( path, JSON.stringify( content, undefined, '\t' ) )

}
export const readJSON = async <O extends object>( path: string ): Promise<O> => {

	return JSON.parse( await readFile( path, 'utf-8' ) )

}
