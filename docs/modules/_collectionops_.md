> **[solandra](../README.md)**

[Globals](../README.md) / ["collectionOps"](_collectionops_.md) /

# External module: "collectionOps"

## Index

### Functions

* [arrayOf](_collectionops_.md#arrayof)
* [pairWise](_collectionops_.md#pairwise)
* [sum](_collectionops_.md#sum)
* [tripleWise](_collectionops_.md#triplewise)
* [zip2](_collectionops_.md#zip2)

## Functions

###  arrayOf

▸ **arrayOf**<**T**>(`n`: number, `init`: function): *`T`[]*

*Defined in [collectionOps.ts:35](https://github.com/jamesporter/solandra/blob/511cfc3/src/lib/collectionOps.ts#L35)*

**Type parameters:**

▪ **T**

**Parameters:**

▪ **n**: *number*

▪ **init**: *function*

▸ (): *`T`*

**Returns:** *`T`[]*

___

###  pairWise

▸ **pairWise**<**T**>(`items`: `T`[]): *[`T`, `T`][]*

*Defined in [collectionOps.ts:1](https://github.com/jamesporter/solandra/blob/511cfc3/src/lib/collectionOps.ts#L1)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`items` | `T`[] |

**Returns:** *[`T`, `T`][]*

___

###  sum

▸ **sum**(`numbers`: number[]): *number*

*Defined in [collectionOps.ts:31](https://github.com/jamesporter/solandra/blob/511cfc3/src/lib/collectionOps.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`numbers` | number[] |

**Returns:** *number*

___

###  tripleWise

▸ **tripleWise**<**T**>(`items`: `T`[], `looped?`: undefined | false | true): *[`T`, `T`, `T`][]*

*Defined in [collectionOps.ts:10](https://github.com/jamesporter/solandra/blob/511cfc3/src/lib/collectionOps.ts#L10)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`items` | `T`[] |
`looped?` | undefined \| false \| true |

**Returns:** *[`T`, `T`, `T`][]*

___

###  zip2

▸ **zip2**<**T**, **S**>(`items`: `T`[], `other`: `S`[]): *[`T`, `S`][]*

*Defined in [collectionOps.ts:23](https://github.com/jamesporter/solandra/blob/511cfc3/src/lib/collectionOps.ts#L23)*

**Type parameters:**

▪ **T**

▪ **S**

**Parameters:**

Name | Type |
------ | ------ |
`items` | `T`[] |
`other` | `S`[] |

**Returns:** *[`T`, `S`][]*