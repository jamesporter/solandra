> **[solandra](../README.md)**

[Globals](../README.md) / ["path"](../modules/_path_.md) / [SimplePath](_path_.simplepath.md) /

# Class: SimplePath

## Hierarchy

* **SimplePath**

## Implements

* [Traceable](../interfaces/_path_.traceable.md)

## Index

### Methods

* [addPoint](_path_.simplepath.md#addpoint)
* [chaiken](_path_.simplepath.md#chaiken)
* [close](_path_.simplepath.md#close)
* [move](_path_.simplepath.md#move)
* [traceIn](_path_.simplepath.md#tracein)
* [transformPoints](_path_.simplepath.md#transformpoints)
* [startAt](_path_.simplepath.md#static-startat)
* [withPoints](_path_.simplepath.md#static-withpoints)

## Methods

###  addPoint

▸ **addPoint**(`point`: [Point2D](../modules/_types_play_.md#point2d)): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:24](https://github.com/jamesporter/solandra/blob/57eddd7/src/lib/path.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_play_.md#point2d) |

**Returns:** *[SimplePath](_path_.simplepath.md)*

___

###  chaiken

▸ **chaiken**(`__namedParameters`: object): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:38](https://github.com/jamesporter/solandra/blob/57eddd7/src/lib/path.ts#L38)*

Smooth out path by adding more points to give curvy result

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`looped` | boolean | false |
`n` | number | 1 |

**Returns:** *[SimplePath](_path_.simplepath.md)*

___

###  close

▸ **close**(): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:29](https://github.com/jamesporter/solandra/blob/57eddd7/src/lib/path.ts#L29)*

**Returns:** *[SimplePath](_path_.simplepath.md)*

___

###  move

▸ **move**(`delta`: [Vector2D](../modules/_types_play_.md#vector2d)): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:72](https://github.com/jamesporter/solandra/blob/57eddd7/src/lib/path.ts#L72)*

Warning mutates

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`delta` | [Vector2D](../modules/_types_play_.md#vector2d) | Vector to move path by  |

**Returns:** *[SimplePath](_path_.simplepath.md)*

___

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:60](https://github.com/jamesporter/solandra/blob/57eddd7/src/lib/path.ts#L60)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*

___

###  transformPoints

▸ **transformPoints**(`transform`: function): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:81](https://github.com/jamesporter/solandra/blob/57eddd7/src/lib/path.ts#L81)*

Warning mutates

**Parameters:**

▪ **transform**: *function*

▸ (`point`: [Point2D](../modules/_types_play_.md#point2d)): *[Point2D](../modules/_types_play_.md#point2d)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_play_.md#point2d) |

**Returns:** *[SimplePath](_path_.simplepath.md)*

___

### `Static` startAt

▸ **startAt**(`point`: [Point2D](../modules/_types_play_.md#point2d)): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:16](https://github.com/jamesporter/solandra/blob/57eddd7/src/lib/path.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_play_.md#point2d) |

**Returns:** *[SimplePath](_path_.simplepath.md)*

___

### `Static` withPoints

▸ **withPoints**(`points`: [Point2D](../modules/_types_play_.md#point2d)[]): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:20](https://github.com/jamesporter/solandra/blob/57eddd7/src/lib/path.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`points` | [Point2D](../modules/_types_play_.md#point2d)[] |

**Returns:** *[SimplePath](_path_.simplepath.md)*