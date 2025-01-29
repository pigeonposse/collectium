# `@collectium/builder` - API documentation

## Functions

### build()

```ts
function build(data: BuildParams): Promise<void>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`BuildParams`](#buildparams) |

#### Returns

`Promise`\<`void`\>

***

### buildApi()

```ts
function buildApi(__namedParameters: BuildApiParams): Promise<void>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | [`BuildApiParams`](#buildapiparams) |

#### Returns

`Promise`\<`void`\>

***

### buildSchema()

```ts
function buildSchema(__namedParameters: BuildSchemaParams): Promise<void>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | [`BuildSchemaParams`](#buildschemaparams) |

#### Returns

`Promise`\<`void`\>

## Type Aliases

### BuildApiParams

```ts
type BuildApiParams: {
  input: Awaited<ReturnType<typeof createApp>>;
  opts: {
     dts: boolean;
     md: boolean;
     schema: boolean;
    };
  output: string;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `input` | `Awaited`\<`ReturnType`\<*typeof* `createApp`\>\> | Collectium Api App |
| `opts`? | \{ `dts`: `boolean`; `md`: `boolean`; `schema`: `boolean`; \} | - |
| `opts.dts`? | `boolean` | Build openapi Definition ts file **Default** `true` |
| `opts.md`? | `boolean` | Build markdown documentation file **Default** `false` |
| `opts.schema`? | `boolean` | Build openapi schema **Default** `true` |
| `output`? | `string` | Output dir **Default** `'build/api'` |

***

### BuildBinParams

```ts
type BuildBinParams: {
  input: string;
  opts: Omit<Parameters<typeof build>[0], "input" | "output">;
  output: string;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | Api App path |
| `opts`? | `Omit`\<`Parameters`\<*typeof* `build`\>\[`0`\], `"input"` \| `"output"`\> | - |
| `output`? | `string` | Output dir |

***

### BuildParams

```ts
type BuildParams: {
  api: Omit<BuildApiParams, "output">;
  bin: Omit<BuildBinParams, "output">;
  output: string;
  schema: Omit<BuildSchemaParams, "output">;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `api`? | `Omit`\<[`BuildApiParams`](#buildapiparams), `"output"`\> | - |
| `bin`? | `Omit`\<[`BuildBinParams`](#buildbinparams), `"output"`\> | - |
| `output`? | `string` | Output dir **Default** `'./build'` |
| `schema`? | `Omit`\<[`BuildSchemaParams`](#buildschemaparams), `"output"`\> | - |

***

### BuildSchemaParams

```ts
type BuildSchemaParams: {
  input: Collectium;
  output: string;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `input` | `Collectium` | - |
| `output`? | `string` | Output dir **Default** `'build/schema'` |

## References

### default

Renames and re-exports [build](#build)
