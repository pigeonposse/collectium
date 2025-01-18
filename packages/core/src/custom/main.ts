
import { catchError }      from '../_shared/error'
import { getContent }      from '../_shared/string'
import { CollectiumSuper } from '../_super/main'

import type { Response }   from '../_shared/types'
import type { ZodAnyType } from '../_shared/validate'
import type { SchemaFn }   from '../_super/main'

type CustomContent = string | object

export type CustomOpts = { [key in string]: {
	url        : string
	fetchOpts? : RequestInit
	schema?    : SchemaFn
	on?        : ( content: CustomContent ) => Response<ZodAnyType>
} }

const ERROR_ID = { GET_CUSTOM: 'GET_CUSTOM' } as const
type ErrorID = typeof ERROR_ID[keyof typeof ERROR_ID]

export class Custom extends CollectiumSuper<CustomOpts, ErrorID> {

	schema

	constructor( opts: CustomOpts, config?:Custom['config'] ) {

		super( {
			opts,
			config,
			ERROR_ID : ERROR_ID,
		} )

		const schema: {
			[key in keyof CustomOpts]: ZodAnyType
		} = {}

		for ( const key in this.opts ) {

			schema[key] = this.opts[key].schema?.( this.z ) || this.z.any()

		}

		this.schema = { res: this.z.object( schema ) }

	}

	async #fn() {

		const res: { [key in string ]:CustomContent } = {}

		for ( const key in this.opts ) {

			const opt      = this.opts[key]
			const response = await fetch( opt.url, opt.fetchOpts )

			let data: CustomContent = await response.text()
			data                    = await getContent( data )

			const onRes = await opt.on?.( data )
			if ( onRes ) data = onRes

			const schema = opt.schema?.( this.z )
			if ( schema ) await this.validateSchema( schema, data )

			res[key] = data

		}
		return res

	}

	async get() {

		const [ e, res ] = await catchError( this.#fn() )
		if ( e ) this.setError( {
			id   : this.ERROR_ID.GET_CUSTOM,
			data : { e },
		} )
		return res

	}

}
