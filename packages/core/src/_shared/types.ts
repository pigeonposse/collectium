
export type RequiredTypes<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>
export type Response<V> = V | Promise<V>
export type ResponseVoid = undefined | void
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any

export type UppercaseKeyValueObject<T extends Record<string, string>> = {
	[K in keyof T]: K extends string
		? K extends Uppercase<K>
			? T[K] extends K
				? K
				: never
			: never
		: never;
}
export type CreateUppercaseKeyValueObject<T extends string> = {
	readonly [K in Uppercase<T>]: K;
}
