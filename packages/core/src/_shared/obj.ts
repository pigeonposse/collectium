type ObjectMapFn<T, U> = ( value: T[keyof T], key: keyof T ) => U

export const objectMap = <T extends object, U> (
	obj: T,
	mapFn: ObjectMapFn<T, U>,
): { [K in keyof T]: U }  => {

	return Object.fromEntries(
		Object.entries( obj ).map( ( [ key, value ] ) => [ key, mapFn( value, key as keyof T ) ] ),
	) as { [K in keyof T]: U }

}
