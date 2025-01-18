import {
	catchError,
	TypedError,
} from '../_shared/error'
import { z } from '../_shared/validate'

import type { CreateUppercaseKeyValueObject } from '../_shared/types'
import type { ZodAnyType }                    from '../_shared/validate'

export type CollectiumConfig = {
	debug?     : boolean
	skipError? : boolean
	skipWarn?  : boolean
}

export type SchemaFn = ( zod: typeof z ) => ZodAnyType | undefined

const ERROR_ID = { SCHEMA_VALIDATION: 'SCHEMA_VALIDATION' } as const
export class CollectiumSuperMininal  {

	/**
	 * Zod instance,
	 */
	z = z

	/**
	 * Confugration
	 */
	config

	constructor( value: { config?: CollectiumConfig } ) {

		if ( !value.config?.debug ) console.debug = () => {}
		if ( value.config?.skipWarn ) console.warn = () => {}

		this.config = value.config || {}

	}

}
export class CollectiumSuper<Opts, ErrorID extends string> extends CollectiumSuperMininal  {

	/**
	 * Controller for Fetch petitions.
	 * Use for abort or get the signal
	 */
	controller : AbortController

	/**
	 * Object with ERROR IDS
	 */
	ERROR_ID : CreateUppercaseKeyValueObject<ErrorID> & typeof ERROR_ID

	/**
	 * Error class
	 */
	Error

	/**
	 * Options
	 */
	opts

	constructor( value: {
		opts     : Opts
		config?  : CollectiumConfig
		ERROR_ID : CreateUppercaseKeyValueObject<ErrorID>
	} ) {

		super( { config: value.config } )

		this.opts     = value.opts
		this.ERROR_ID = {
			...value.ERROR_ID,
			...ERROR_ID,
		}

		this.controller = new AbortController()

		this.Error = class CollectiumError extends TypedError<
			ErrorID,
			{
				e      : unknown
				props? : Record<string, unknown>
			}
		> {}

	}

	protected async validateSchema<D = unknown>( schema: ZodAnyType, data: D ): Promise<D> {

		const [ error, res ] = await catchError( ( async () => schema.parse( data ) )() )
		// @ts-ignore
		if ( error ) throw new this.Error( this.ERROR_ID.SCHEMA_VALIDATION, { e: error } )
		return res

	}

	protected setError( value: {
		id   : ErrorID
		data : {
			e      : unknown
			props? : Record<string, unknown>
		}
	} ) {

		// this.controller.abort() // no abort
		if ( this.config?.skipError ) console.warn( value )
		else throw new this.Error( value.id, value.data )

	}

}

