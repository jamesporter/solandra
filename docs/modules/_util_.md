> **[solandra](../README.md)**

[Globals](../README.md) / ["util"](_util_.md) /

# External module: "util"

## Index

### Functions

* [clamp](_util_.md#const-clamp)
* [isoTransform](_util_.md#const-isotransform)
* [scaler](_util_.md#const-scaler)

## Functions

### `Const` clamp

▸ **clamp**(`__namedParameters`: object, `n`: number): *number*

*Defined in [util.ts:1](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/util.ts#L1)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`from` | number |
`to` | number |

▪ **n**: *number*

**Returns:** *number*

___

### `Const` isoTransform

▸ **isoTransform**(`height`: number): *`(Anonymous function)`*

*Defined in [util.ts:28](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/util.ts#L28)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`height` | number | The height of the (vertical parts of) isometric grid cells |

**Returns:** *`(Anonymous function)`*

A function mapping from [x,y,z] to [x,y].

___

### `Const` scaler

▸ **scaler**(`__namedParameters`: object): *function*

*Defined in [util.ts:8](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/util.ts#L8)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`maxDomain` | number |
`maxRange` | number |
`minDomain` | number |
`minRange` | number |

**Returns:** *function*

▸ (`n`: number): *number*

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |