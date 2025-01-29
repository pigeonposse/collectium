# `@collectium/api` - API documentation

## Functions

### createApp()

```ts
function createApp(data: CreateOpts): App<object>
```

Creates an application that retrieves and validates data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `CreateOpts` | The data collection object. |

#### Returns

`App`\<`object`\>

The application with methods to access stored data.

#### Example

```ts
import createApp from '@collectium/api/standard'
const app = createApp();
```

***

### createLocalApp()

```ts
function createLocalApp(data: CreateOpts & {
  opts: {
     loop: number;
     path: string;
    };
}): App<object>
```

Creates an application that periodically saves and retrieves JSON data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `CreateOpts` & \{ `opts`: \{ `loop`: `number`; `path`: `string`; \}; \} | The configuration object. |

#### Returns

`App`\<`object`\>

The application with methods to access stored data.

#### Throws

If the path is not provided.

#### Example

```ts
import createApp from '@collectium/api/local'
const app = createApp({ opts: { path: './data.json', loop: 300000 } });
```

***

### createSqliteApp()

```ts
function createSqliteApp(data: CreateOpts | CreateOpts & {
  opts: {
     loop: number;
     path: string;
    };
}): App<object>
```

Creates an application that synchronizes data with an SQLite database.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `CreateOpts` \| `CreateOpts` & \{ `opts`: \{ `loop`: `number`; `path`: `string`; \}; \} | The configuration object. |

#### Returns

`App`\<`object`\>

The application with methods to access stored data.

#### Throws

If the database path is not provided.

#### Example

```ts
import createApp from '@collectium/api/sqlite'
const app = createApp({ opts: { path: './database.db', loop: 300000 } });
```
