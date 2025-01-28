# `@collectium/check` - API documentation

## Classes

### Checker

Checker class to validate schemas against specified content files.
This class is designed to work with Zod schemas and supports dynamic content validation
from either a configuration object or a configuration file path.

#### Examples

```ts
// Example usage with a configuration file path:
import { Checker } from '@collectium/check';

const checker = new Checker("/path/to/config.js");
checker.run("config-file", { cwd: "/path/to/dir" });
```

```ts
// Example usage with an options object:
import { Checker } from '@collectium/check';

const opts = {
  github: [
    {
      content: {
        "config-file": {
          input: ["configs/**/*.json"],
          schema: (z) => z.object({
            name: z.string(),
            version: z.string(),
          }),
        },
      },
    },
  ],
};

const checker = new Checker(opts);
checker.run("config-file", { cwd: "/path/to/dir" });
```

#### Constructors

##### new Checker()

```ts
new Checker(opts: CheckOpts): Checker
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`CheckOpts`](#checkopts) |

###### Returns

[`Checker`](#checker)

#### Methods

##### run()

```ts
run(id: string, opts?: {
  cwd: string;
}): Promise<undefined>
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |
| `opts`? | `object` |
| `opts.cwd`? | `string` |

###### Returns

`Promise`\<`undefined`\>

## Type Aliases

### CheckOpts

```ts
type CheckOpts: CollectiumOpts | CollectiumOptsPath;
```
