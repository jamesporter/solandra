> **[solandra](../README.md)**

[Globals](../README.md) / ["util"](_util_.md) /

# External module: "util"

## Index

### Functions

* [centroid](_util_.md#const-centroid)
* [clamp](_util_.md#const-clamp)
* [isoTransform](_util_.md#const-isotransform)
* [scaler](_util_.md#const-scaler)

## Functions

### `Const` centroid

▸ **centroid**(`points`: [Point2D](_types_sol_.md#point2d)[]): *[Point2D](_types_sol_.md#point2d)*

*Defined in [util.ts:38](https://github.com/jamesporter/solandra/blob/511cfc3/src/lib/util.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`points` | [Point2D](_types_sol_.md#point2d)[] |

**Returns:** *[Point2D](_types_sol_.md#point2d)*

___

### `Const` clamp

▸ **clamp**(`__namedParameters`: object, `n`: number): *number*

*Defined in [util.ts:3](https://github.com/jamesporter/solandra/blob/511cfc3/src/lib/util.ts#L3)*

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

*Defined in [util.ts:30](https://github.com/jamesporter/solandra/blob/511cfc3/src/lib/util.ts#L30)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`height` | number | The height of the (vertical parts of) isometric grid cells |

**Returns:** *`(Anonymous function)`*

A function mapping from [x,y,z] to [x,y].

___

### `Const` scaler

▸ **scaler**(`__namedParameters`: object): *function*

*Defined in [util.ts:10](https://github.com/jamesporter/solandra/blob/511cfc3/src/lib/util.ts#L10)*

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