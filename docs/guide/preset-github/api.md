# `@collectium/preset-github` - API documentation

## Functions

### setGithubPreset()

```ts
function setGithubPreset(data: Pick<GitHubOpts$1, 
  | "user"
  | "branch"
  | "token"
  | "userType"
  | "configPath">, opts: Omit<CollectiumOpts, "github">): CollectiumOpts
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `Pick`\<`GitHubOpts$1`, \| `"user"` \| `"branch"` \| `"token"` \| `"userType"` \| `"configPath"`\> |
| `opts` | `Omit`\<`CollectiumOpts`, `"github"`\> |

#### Returns

`CollectiumOpts`

## References

### default

Renames and re-exports [setGithubPreset](#setgithubpreset)
