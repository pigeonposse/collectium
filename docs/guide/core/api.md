# `@collectium/core` - API documentation

## Classes

### Collectium

Create a Collectium instance

#### See

https://collectium.pigeonposse.com/guide/core

#### Example

```ts
import { argv } from 'node:process';

// Retrieve the GitHub token from the command line arguments
const token = argv[2];

// Initialize a new Collectium instance
const collectium = new Collectium({
  github: {
    test: {
      user: 'pigeonposse',  // GitHub username or organization
      branch: 'main',       // Target branch
      userType: 'org',      // User type: 'org' for organization, 'user' for individual
      token,                // Authentication token for GitHub
    },
  },
  config: {
    skipError: true, // Skip errors during execution
    skipWarn: true,  // Skip warnings during execution
  },
});

// Fetch data using the Collectium instance
const data = await collectium.get();

// Log the retrieved data to the console with full depth
console.dir(data, { depth: Infinity });
```

#### Extends

- `CollectiumSuperMininal`

#### Constructors

##### new Collectium()

```ts
new Collectium(opts: CollectiumOpts): Collectium
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`CollectiumOpts`](#collectiumopts) |

###### Returns

[`Collectium`](#collectium)

###### Overrides

`CollectiumSuperMininal.constructor`

#### Methods

##### get()

```ts
get(): Promise<CollectiumRes>
```

###### Returns

`Promise`\<[`CollectiumRes`](#collectiumres)\>

#### Properties

| Property | Modifier | Type | Default value | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `config` | `public` | `CollectiumConfig` | `undefined` | Confugration | `CollectiumSuperMininal.config` |
| `custom` | `public` | `Custom` | `undefined` | - | - |
| `github` | `public` | `GitHub` | `undefined` | - | - |
| `opts` | `public` | [`CollectiumOpts`](#collectiumopts) | `undefined` | - | - |
| `schema` | `public` | \{ `res`: `ZodObject`\<\{ `custom`: `ZodOptional`\<`ZodObject`\<\{\}, `"strip"`, `ZodTypeAny`, \{\}, \{\}\>\>; `github`: `ZodOptional`\<`ZodObject`\<\{ `data`: `ZodRecord`\<`ZodString`, `ZodObject`\<\{ `repo`: `ZodOptional`\<`ZodArray`\<..., ...\>\>; `user`: `ZodOptional`\<`ZodObject`\<..., ..., ..., ..., ...\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `repo`: ...[]; `user`: \{ `avatar`: ...; `blog`: ...; `description`: ...; `email`: ...; `followers`: ...; `funding`: ...; `id`: ...; `name`: ...; `publicRepos`: ...; `social`: ...; `teams`: ...; \}; \}, \{ `repo`: ...[]; `user`: \{ `avatar`: ...; `blog`: ...; `description`: ...; `email`: ...; `followers`: ...; `funding`: ...; `id`: ...; `name`: ...; `publicRepos`: ...; `social`: ...; `teams`: ...; \}; \}\>\>; `rate`: `ZodUnion`\<[`ZodObject`\<\{ `limit`: `ZodNumber`; `remaining`: `ZodNumber`; `reset`: `ZodNumber`; `used`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `limit`: `number`; `remaining`: `number`; `reset`: `number`; `used`: `number`; \}, \{ `limit`: `number`; `remaining`: `number`; `reset`: `number`; `used`: `number`; \}\>, `ZodLiteral`\<`false`\>]\>; \}, `"strip"`, `ZodTypeAny`, \{ `data`: `Record`\<`string`, \{ `repo`: \{ `content`: ...; `createdAt`: ...; `defaultBranch`: ...; `desc`: ...; `forks`: ...; `homepage`: ...; `id`: ...; `isArchived`: ...; `isDisabled`: ...; `isFork`: ...; `isPinned`: ...; `isPrivate`: ...; `issues`: ...; `isTemplate`: ...; `language`: ...; `license`: ...; `releases`: ...; `size`: ...; `stargazers`: ...; `tags`: ...; `updatedAt`: ...; `url`: ...; `watchers`: ...; \}[]; `user`: \{ `avatar`: `string`; `blog`: ... \| ...; `description`: ... \| ...; `email`: ... \| ...; `followers`: `number`; `funding`: ... \| ...; `id`: `string`; `name`: ... \| ...; `publicRepos`: `number`; `social`: ... \| ...; `teams`: ... \| ...; \}; \}\>; `rate`: `false` \| \{ `limit`: `number`; `remaining`: `number`; `reset`: `number`; `used`: `number`; \}; \}, \{ `data`: `Record`\<`string`, \{ `repo`: \{ `content`: ...; `createdAt`: ...; `defaultBranch`: ...; `desc`: ...; `forks`: ...; `homepage`: ...; `id`: ...; `isArchived`: ...; `isDisabled`: ...; `isFork`: ...; `isPinned`: ...; `isPrivate`: ...; `issues`: ...; `isTemplate`: ...; `language`: ...; `license`: ...; `releases`: ...; `size`: ...; `stargazers`: ...; `tags`: ...; `updatedAt`: ...; `url`: ...; `watchers`: ...; \}[]; `user`: \{ `avatar`: `string`; `blog`: ... \| ...; `description`: ... \| ...; `email`: ... \| ...; `followers`: `number`; `funding`: ... \| ...; `id`: `string`; `name`: ... \| ...; `publicRepos`: `number`; `social`: ... \| ...; `teams`: ... \| ...; \}; \}\>; `rate`: `false` \| \{ `limit`: `number`; `remaining`: `number`; `reset`: `number`; `used`: `number`; \}; \}\>\>; `timeout`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `custom`: \{\}; `github`: \{ `data`: `Record`\<`string`, \{ `repo`: \{ `content`: ... \| ... \| ...; `createdAt`: ... \| ...; `defaultBranch`: ... \| ...; `desc`: ... \| ...; `forks`: `number`; `homepage`: ... \| ...; `id`: `string`; `isArchived`: `boolean`; `isDisabled`: `boolean`; `isFork`: `boolean`; `isPinned`: `boolean`; `isPrivate`: `boolean`; `issues`: `number`; `isTemplate`: `boolean`; `language`: ... \| ...; `license`: ... \| ...; `releases`: ... \| ...; `size`: ... \| ...; `stargazers`: `number`; `tags`: ... \| ...; `updatedAt`: ... \| ...; `url`: `string`; `watchers`: `number`; \}[]; `user`: \{ `avatar`: `string`; `blog`: `string`; `description`: `string`; `email`: `string`; `followers`: `number`; `funding`: \{ `custom`: ...; `github`: ...; `ko_fi`: ...; `open_collective`: ...; `patreon`: ...; `polar`: ...; `tidelift`: ...; \}; `id`: `string`; `name`: `string`; `publicRepos`: `number`; `social`: ...[]; `teams`: ...[]; \}; \}\>; `rate`: `false` \| \{ `limit`: `number`; `remaining`: `number`; `reset`: `number`; `used`: `number`; \}; \}; `timeout`: `number`; \}, \{ `custom`: \{\}; `github`: \{ `data`: `Record`\<`string`, \{ `repo`: \{ `content`: ... \| ... \| ...; `createdAt`: ... \| ...; `defaultBranch`: ... \| ...; `desc`: ... \| ...; `forks`: `number`; `homepage`: ... \| ...; `id`: `string`; `isArchived`: `boolean`; `isDisabled`: `boolean`; `isFork`: `boolean`; `isPinned`: `boolean`; `isPrivate`: `boolean`; `issues`: `number`; `isTemplate`: `boolean`; `language`: ... \| ...; `license`: ... \| ...; `releases`: ... \| ...; `size`: ... \| ...; `stargazers`: `number`; `tags`: ... \| ...; `updatedAt`: ... \| ...; `url`: `string`; `watchers`: `number`; \}[]; `user`: \{ `avatar`: `string`; `blog`: `string`; `description`: `string`; `email`: `string`; `followers`: `number`; `funding`: \{ `custom`: ...; `github`: ...; `ko_fi`: ...; `open_collective`: ...; `patreon`: ...; `polar`: ...; `tidelift`: ...; \}; `id`: `string`; `name`: `string`; `publicRepos`: `number`; `social`: ...[]; `teams`: ...[]; \}; \}\>; `rate`: `false` \| \{ `limit`: `number`; `remaining`: `number`; `reset`: `number`; `used`: `number`; \}; \}; `timeout`: `number`; \}\>; \} | `undefined` | - | - |
| `schema.res` | `public` | `ZodObject`\<\{ `custom`: `ZodOptional`\<`ZodObject`\<\{\}, `"strip"`, `ZodTypeAny`, \{\}, \{\}\>\>; `github`: `ZodOptional`\<`ZodObject`\<\{ `data`: `ZodRecord`\<`ZodString`, `ZodObject`\<\{ `repo`: `ZodOptional`\<`ZodArray`\<..., ...\>\>; `user`: `ZodOptional`\<`ZodObject`\<..., ..., ..., ..., ...\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `repo`: ...[]; `user`: \{ `avatar`: ...; `blog`: ...; `description`: ...; `email`: ...; `followers`: ...; `funding`: ...; `id`: ...; `name`: ...; `publicRepos`: ...; `social`: ...; `teams`: ...; \}; \}, \{ `repo`: ...[]; `user`: \{ `avatar`: ...; `blog`: ...; `description`: ...; `email`: ...; `followers`: ...; `funding`: ...; `id`: ...; `name`: ...; `publicRepos`: ...; `social`: ...; `teams`: ...; \}; \}\>\>; `rate`: `ZodUnion`\<[`ZodObject`\<\{ `limit`: `ZodNumber`; `remaining`: `ZodNumber`; `reset`: `ZodNumber`; `used`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `limit`: `number`; `remaining`: `number`; `reset`: `number`; `used`: `number`; \}, \{ `limit`: `number`; `remaining`: `number`; `reset`: `number`; `used`: `number`; \}\>, `ZodLiteral`\<`false`\>]\>; \}, `"strip"`, `ZodTypeAny`, \{ `data`: `Record`\<`string`, \{ `repo`: \{ `content`: ...; `createdAt`: ...; `defaultBranch`: ...; `desc`: ...; `forks`: ...; `homepage`: ...; `id`: ...; `isArchived`: ...; `isDisabled`: ...; `isFork`: ...; `isPinned`: ...; `isPrivate`: ...; `issues`: ...; `isTemplate`: ...; `language`: ...; `license`: ...; `releases`: ...; `size`: ...; `stargazers`: ...; `tags`: ...; `updatedAt`: ...; `url`: ...; `watchers`: ...; \}[]; `user`: \{ `avatar`: `string`; `blog`: ... \| ...; `description`: ... \| ...; `email`: ... \| ...; `followers`: `number`; `funding`: ... \| ...; `id`: `string`; `name`: ... \| ...; `publicRepos`: `number`; `social`: ... \| ...; `teams`: ... \| ...; \}; \}\>; `rate`: `false` \| \{ `limit`: `number`; `remaining`: `number`; `reset`: `number`; `used`: `number`; \}; \}, \{ `data`: `Record`\<`string`, \{ `repo`: \{ `content`: ...; `createdAt`: ...; `defaultBranch`: ...; `desc`: ...; `forks`: ...; `homepage`: ...; `id`: ...; `isArchived`: ...; `isDisabled`: ...; `isFork`: ...; `isPinned`: ...; `isPrivate`: ...; `issues`: ...; `isTemplate`: ...; `language`: ...; `license`: ...; `releases`: ...; `size`: ...; `stargazers`: ...; `tags`: ...; `updatedAt`: ...; `url`: ...; `watchers`: ...; \}[]; `user`: \{ `avatar`: `string`; `blog`: ... \| ...; `description`: ... \| ...; `email`: ... \| ...; `followers`: `number`; `funding`: ... \| ...; `id`: `string`; `name`: ... \| ...; `publicRepos`: `number`; `social`: ... \| ...; `teams`: ... \| ...; \}; \}\>; `rate`: `false` \| \{ `limit`: `number`; `remaining`: `number`; `reset`: `number`; `used`: `number`; \}; \}\>\>; `timeout`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `custom`: \{\}; `github`: \{ `data`: `Record`\<`string`, \{ `repo`: \{ `content`: ... \| ... \| ...; `createdAt`: ... \| ...; `defaultBranch`: ... \| ...; `desc`: ... \| ...; `forks`: `number`; `homepage`: ... \| ...; `id`: `string`; `isArchived`: `boolean`; `isDisabled`: `boolean`; `isFork`: `boolean`; `isPinned`: `boolean`; `isPrivate`: `boolean`; `issues`: `number`; `isTemplate`: `boolean`; `language`: ... \| ...; `license`: ... \| ...; `releases`: ... \| ...; `size`: ... \| ...; `stargazers`: `number`; `tags`: ... \| ...; `updatedAt`: ... \| ...; `url`: `string`; `watchers`: `number`; \}[]; `user`: \{ `avatar`: `string`; `blog`: `string`; `description`: `string`; `email`: `string`; `followers`: `number`; `funding`: \{ `custom`: ...; `github`: ...; `ko_fi`: ...; `open_collective`: ...; `patreon`: ...; `polar`: ...; `tidelift`: ...; \}; `id`: `string`; `name`: `string`; `publicRepos`: `number`; `social`: ...[]; `teams`: ...[]; \}; \}\>; `rate`: `false` \| \{ `limit`: `number`; `remaining`: `number`; `reset`: `number`; `used`: `number`; \}; \}; `timeout`: `number`; \}, \{ `custom`: \{\}; `github`: \{ `data`: `Record`\<`string`, \{ `repo`: \{ `content`: ... \| ... \| ...; `createdAt`: ... \| ...; `defaultBranch`: ... \| ...; `desc`: ... \| ...; `forks`: `number`; `homepage`: ... \| ...; `id`: `string`; `isArchived`: `boolean`; `isDisabled`: `boolean`; `isFork`: `boolean`; `isPinned`: `boolean`; `isPrivate`: `boolean`; `issues`: `number`; `isTemplate`: `boolean`; `language`: ... \| ...; `license`: ... \| ...; `releases`: ... \| ...; `size`: ... \| ...; `stargazers`: `number`; `tags`: ... \| ...; `updatedAt`: ... \| ...; `url`: `string`; `watchers`: `number`; \}[]; `user`: \{ `avatar`: `string`; `blog`: `string`; `description`: `string`; `email`: `string`; `followers`: `number`; `funding`: \{ `custom`: ...; `github`: ...; `ko_fi`: ...; `open_collective`: ...; `patreon`: ...; `polar`: ...; `tidelift`: ...; \}; `id`: `string`; `name`: `string`; `publicRepos`: `number`; `social`: ...[]; `teams`: ...[]; \}; \}\>; `rate`: `false` \| \{ `limit`: `number`; `remaining`: `number`; `reset`: `number`; `used`: `number`; \}; \}; `timeout`: `number`; \}\> | `undefined` | - | - |
| `z` | `public` | `__module` | `z` | Wrapped Zod instance with restricted methods | `CollectiumSuperMininal.z` |

## Functions

### defineConfig()

```ts
function defineConfig(v: CollectiumOpts): CollectiumOpts
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | [`CollectiumOpts`](#collectiumopts) |

#### Returns

[`CollectiumOpts`](#collectiumopts)

## Type Aliases

### CollectiumOpts

```ts
type CollectiumOpts: {
  config: CollectiumConfig;
  custom: CustomOpts;
  github: GitHubOpts;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `config`? | `CollectiumConfig` | Global Configuration |
| `custom`? | `CustomOpts` | Custom options |
| `github`? | `GitHubOpts` | Github options |

***

### CollectiumRes

```ts
type CollectiumRes: {
  custom: Awaited<ReturnType<Custom["get"]>>;
  github: Awaited<ReturnType<GitHub["get"]>>;
  timeout: number;
};
```

#### Type declaration

| Name | Type | Description |
| ------ | ------ | ------ |
| `custom`? | `Awaited`\<`ReturnType`\<`Custom`\[`"get"`\]\>\> | - |
| `github`? | `Awaited`\<`ReturnType`\<`GitHub`\[`"get"`\]\>\> | - |
| `timeout` | `number` | Execution time in miliseconds |
