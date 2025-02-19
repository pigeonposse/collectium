# `@collectium/preset-github` - API documentation

## Functions

### setGithubPreset()

```ts
function setGithubPreset<ID>(data: Data & {
  configPath: string[];
  customType: string[];
  id: ID;
 }, opts: Omit<CollectiumOpts, "github">): CollectiumOpts
```

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `ID` *extends* `string` | `string` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `Data` & \{ `configPath`: `string`[]; `customType`: `string`[]; `id`: `ID`; \} |
| `opts` | `Omit`\<`CollectiumOpts`, `"github"`\> |

#### Returns

`CollectiumOpts`

## References

### default

Renames and re-exports [setGithubPreset](#setgithubpreset)
