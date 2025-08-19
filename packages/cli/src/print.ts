import { styleText } from 'node:util'

import {
	BIN_NAME,
	description,
	HELP_URL,
	version,
} from './const'

export const dim = ( v:string ) => styleText( 'dim', v )
export const bold = ( v:string ) => styleText( 'bold', v )
export const italic = ( v:string ) => styleText( 'italic', v )
export const cyan = ( v:string ) => styleText( 'cyan', v )
export const green = ( v:string ) => styleText( 'green', v )

const desc  = ( v:string ) => styleText( 'dim', v )
const url   = ( v:string ) => styleText( 'magenta', styleText( 'italic', styleText( 'underline', v ) ) )
const title = ( v:string ) => styleText( 'bold', styleText( 'inverse', ' ' + v + ' ' ) )
const cmds  = ( v:string, o?: string ) => styleText( 'green', v + ( o ? ' ' + desc( o ) : '' ) )
const flag  = ( v:string ) => styleText( 'yellow', v )
const bin   = ( v:string ) => styleText( 'cyan', v )

export const successOut = ( v:string ) => styleText( 'green', `${bold( '✔️' )} ${desc( v )}` )
export const errorOut = ( v:string ) => styleText( 'red', `${bold( 'ｘ' )} ${desc( v )}` )
export const titleOut = ( v:string ) => `${bold( 'ℹ' )} ${title( v )}\n`
export const versionOut = () => `${bold( 'Version' )} ${desc( version )}`
export const helpOut = () => `${title( BIN_NAME )} ${desc( version )}

${description}

${bold( 'Usage:' )} ${bin( BIN_NAME )} ${cmds( '<command>' )} ${flag( '[...flags]' )} 

${bold( 'Commands:' )}

  ${cmds( 'check', '<id>' )}     ${desc( 'Check the configuration for the current working directory' )}
  ${cmds( 'run' )}            ${desc( `Run ${BIN_NAME}` )}
  ${cmds( 'config' )}         ${desc( 'Print configuration' )}

${bold( 'flags:' )}

  ${flag( '-o, --output' )}   ${desc( `print result in a output path. Used in run command.` )}
  ${flag( '--cwd' )}          ${desc( `Current working dir. Used in check command` )}
  ${flag( '-c, --config' )}   ${desc( `Path with [${BIN_NAME}] configuration` )}

${bold( 'General flags:' )}

  ${flag( '-h, --help' )}     ${desc( 'Print Help' )}
  ${flag( '-v, --version' )}  ${desc( 'Print Version' )}

${bold( 'Info:' )}            ${url( HELP_URL )}
`
