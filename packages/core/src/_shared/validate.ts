import { z } from '@hono/zod-openapi'

import type { Any } from './types'

export { z }
export type ZodAnyType = z.ZodType<Any, Any, Any>
export type ZodSchemaFor<T> = z.ZodType<T, z.ZodTypeDef, T>
export type Zod = typeof z
export type ZodInfer<T extends ZodAnyType> = z.infer<T>

/**
 * Checks if an image URL exists.
 * @param {string} url - The image URL to check.
 * @returns {Promise<boolean>} - Returns a boolean indicating if the image exists.
 */
export const existsImageURL = async ( url: string ): Promise<boolean> => {

	try {

		const response = await fetch( url, { method: 'HEAD' } )
		if ( !response.ok ) return false

		const contentType = response.headers.get( 'Content-Type' )
		const res         = contentType && contentType.startsWith( 'image/' )

		if ( typeof res === 'boolean' ) return res
		return false

	}
	catch ( _e ) {

		return false

	}

}

/**
 * Checks if a URL is valid (exists).
 * @param {string} url - The URL to check.
 * @returns {Promise<boolean>} - Returns a boolean indicating if the URL is valid.
 */
export const existsURL = async ( url: string ): Promise<boolean> => {

	try {

		const response = await fetch( url, { method: 'HEAD' } )
		return response.ok

	}
	catch ( _e ) {

		return false

	}

}

/**
 * Ensures that a URL has the 'https://' prefix.
 * @param {string} value - The URL to verify.
 * @returns {Promise<string | undefined>} - Returns the URL with the 'https://' prefix or undefined if not valid.
 */
export const validateURL = async ( value: string ): Promise<string | undefined> => {

	const exists = await existsURL( value )
	if ( !exists ) return undefined
	return value && !( value.startsWith( 'https://' ) || value.startsWith( 'http://' ) )
		? 'https://' + value
		: value

}

/**
 * Checks if an image URL exists and returns the URL if valid.
 * @param {string} value - The image URL to check.
 * @returns {Promise<string | undefined>} - Returns the URL if the image exists or undefined if not.
 */
export const validateImageURL = async ( value: string ): Promise<string | undefined> => {

	const exists = await existsImageURL( value )
	if ( !exists ) return undefined
	return value

}

