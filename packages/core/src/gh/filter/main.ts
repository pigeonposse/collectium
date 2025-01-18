
const DATE_TYPE = {
	ASC  : 'asc',
	DESC : 'desc',
} as const

const STRING_TYPE = {
	ATOZ : 'atoz',
	ZTOA : 'ztoa',
} as const

const NUMBER_TYPE = {
	MIN : 'min',
	MAX : 'max',
} as const

const SORT_TYPE = {
	DATE_ASC    : `date-${DATE_TYPE.ASC}`,
	DATE_DESC   : `date-${DATE_TYPE.DESC}`,
	STRING_ATOZ : `string-${STRING_TYPE.ATOZ}`,
	STRING_ZTOA : `string-${STRING_TYPE.ZTOA}`,
	NUMBER_MIN  : `number-${NUMBER_TYPE.MIN}`,
	NUMBER_MAX  : `number-${NUMBER_TYPE.MAX}`,
} as const

export type SortDateType = typeof DATE_TYPE[keyof typeof DATE_TYPE]
export type SortStringType = typeof STRING_TYPE[keyof typeof STRING_TYPE]
export type SortNumberType = typeof NUMBER_TYPE[keyof typeof NUMBER_TYPE]
export type SortType = typeof SORT_TYPE[keyof typeof SORT_TYPE]

export type SortValue = Record<string, unknown>[]
export type SortOpts<V extends SortValue> = {
	stringKey : keyof V
	dateKey   : keyof V
	numKey    : keyof V
}

export class Sort<V extends SortValue = SortValue> {

	constructor( public value: V ) {}

	consts = {
		SORT_TYPE,
		DATE_TYPE,
		NUMBER_TYPE,
		STRING_TYPE,
	}

	byDate( key: keyof V, order: SortDateType = DATE_TYPE.ASC ): V {

		this.value.sort( ( a, b ) => {

			if (
				!a
				|| !b
				|| !( key in a )
				|| !( key in b )
				|| ( typeof b[key as string] !== 'string' )
				|| typeof a[key as string] !== 'string'
			) return 0

			// @ts-ignore
			const aK = a[key]
			// @ts-ignore
			const bK = a[key]

			if ( !aK || !bK ) return 0

			const dateA = new Date( aK )
			const dateB = new Date( bK )

			const comparison = dateB.getTime() - dateA.getTime()

			return order === 'asc' ? -comparison : comparison

		} )

		return this.value

	}

	byString( key: keyof V, order: SortStringType = STRING_TYPE.ATOZ ): V {

		this.value.sort( ( a, b ) => {

			if (
				!a
				|| !b
				|| !( key in a )
				|| !( key in b )
				|| typeof b[key as string] !== 'string'
				|| typeof a[key as string] !== 'string'
			) return 0

			// @ts-ignore
			const aK = a[key]
			// @ts-ignore
			const bK = b[key]

			const comparison = aK.localeCompare( bK )

			return order === 'atoz' ? comparison : -comparison

		} )
		return this.value

	}

	byNumber( key: keyof V, order: SortNumberType = NUMBER_TYPE.MAX ) {

		this.value.sort( ( a, b ) => {

			// @ts-ignore
			const aK = a[key]
			// @ts-ignore
			const bK = b[key]

			if ( aK == null || bK == null ) return 0

			return order === 'min' ? aK - bK : bK - aK

		} )
		return this.value

	}

	/**
	 * Sorts the value array based on the given sort type and options.
	 * @template V
	 * @param {SortType} type - The sort type from SORT_TYPE.
	 * @param { SortOpts<V>} opts - The sort options containing the keys for sorting.
	 * @returns {V} The sorted value array.
	 */
	by( type: SortType, opts: SortOpts<V> ): V {

		const { SORT_TYPE } = this.consts

		if ( type === SORT_TYPE.STRING_ATOZ ) return this.byString( opts.stringKey, STRING_TYPE.ATOZ )
		else if ( type === SORT_TYPE.STRING_ZTOA ) return this.byString( opts.stringKey, STRING_TYPE.ZTOA )
		else if ( type === SORT_TYPE.NUMBER_MAX ) return this.byNumber( opts.numKey, NUMBER_TYPE.MAX )
		else if ( type === SORT_TYPE.NUMBER_MIN ) return this.byNumber( opts.numKey, NUMBER_TYPE.MIN )
		else if ( type === SORT_TYPE.DATE_ASC ) return this.byDate( opts.dateKey, DATE_TYPE.ASC )
		else if ( type === SORT_TYPE.DATE_DESC ) return this.byDate( opts.dateKey, DATE_TYPE.DESC )

		return this.value

	}

}
