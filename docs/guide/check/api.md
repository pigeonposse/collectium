# `@collectium/check` - API documentation

## Classes

### Checker

#### Constructors

##### new Checker()

```ts
new Checker(opts: CollectiumOpts): Checker
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | `CollectiumOpts` |

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
