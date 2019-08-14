> **[solandra](../README.md)**

[Globals](../README.md) / ["path"](../modules/_path_.md) / [SimplePath](_path_.simplepath.md) /

# Class: SimplePath

## Hierarchy

* **SimplePath**

## Implements

* [Traceable](../interfaces/_path_.traceable.md)

## Index

### Accessors

* [centroid](_path_.simplepath.md#centroid)
* [reversed](_path_.simplepath.md#reversed)
* [segmented](_path_.simplepath.md#segmented)

### Methods

* [addPoint](_path_.simplepath.md#addpoint)
* [chaiken](_path_.simplepath.md#chaiken)
* [close](_path_.simplepath.md#close)
* [exploded](_path_.simplepath.md#exploded)
* [moved](_path_.simplepath.md#moved)
* [rotated](_path_.simplepath.md#rotated)
* [scaled](_path_.simplepath.md#scaled)
* [subdivide](_path_.simplepath.md#subdivide)
* [traceIn](_path_.simplepath.md#tracein)
* [transformPoints](_path_.simplepath.md#transformpoints)
* [transformed](_path_.simplepath.md#transformed)
* [withAppended](_path_.simplepath.md#withappended)
* [startAt](_path_.simplepath.md#static-startat)
* [withPoints](_path_.simplepath.md#static-withpoints)

## Accessors

###  centroid

• **get centroid**(): *[Point2D](../modules/_types_sol_.md#point2d)*

*Defined in [path.ts:94](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L94)*

**Returns:** *[Point2D](../modules/_types_sol_.md#point2d)*

___

###  reversed

• **get reversed**(): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:90](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L90)*

**Returns:** *[SimplePath](_path_.simplepath.md)*

___

###  segmented

• **get segmented**(): *[SimplePath](_path_.simplepath.md)[]*

*Defined in [path.ts:101](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L101)*

Split the path into triangular segments, around the centroid

**Returns:** *[SimplePath](_path_.simplepath.md)[]*

## Methods

###  addPoint

▸ **addPoint**(`point`: [Point2D](../modules/_types_sol_.md#point2d)): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:25](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) |

**Returns:** *[SimplePath](_path_.simplepath.md)*

___

###  chaiken

▸ **chaiken**(`__namedParameters`: object): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:39](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L39)*

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

*Defined in [path.ts:30](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L30)*

**Returns:** *[SimplePath](_path_.simplepath.md)*

___

###  exploded

▸ **exploded**(`config`: object): *[SimplePath](_path_.simplepath.md)[]*

*Defined in [path.ts:123](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L123)*

Split the path into triangular segments, around the centroid.
displaced by magnitude and scaled by scale

**Parameters:**

▪`Default value`  **config**: *object*=  {}

Name | Type |
------ | ------ |
`magnitude?` | undefined \| number |
`scale?` | undefined \| number |

**Returns:** *[SimplePath](_path_.simplepath.md)[]*

___

###  moved

▸ **moved**(`delta`: [Vector2D](../modules/_types_sol_.md#vector2d)): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:72](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L72)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`delta` | [Vector2D](../modules/_types_sol_.md#vector2d) | Vector to move path by  |

**Returns:** *[SimplePath](_path_.simplepath.md)*

___

###  rotated

▸ **rotated**(`angle`: number): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:151](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L151)*

**Parameters:**

Name | Type |
------ | ------ |
`angle` | number |

**Returns:** *[SimplePath](_path_.simplepath.md)*

___

###  scaled

▸ **scaled**(`scale`: number): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:76](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L76)*

**Parameters:**

Name | Type |
------ | ------ |
`scale` | number |

**Returns:** *[SimplePath](_path_.simplepath.md)*

___

###  subdivide

▸ **subdivide**(`config`: object): *[SimplePath](_path_.simplepath.md)[]*

*Defined in [path.ts:163](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L163)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`m` | number |
`n` | number |

**Returns:** *[SimplePath](_path_.simplepath.md)[]*

___

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:61](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L61)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*

___

###  transformPoints

▸ **transformPoints**(`transform`: function): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:85](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L85)*

Warning mutates

**Parameters:**

▪ **transform**: *function*

▸ (`point`: [Point2D](../modules/_types_sol_.md#point2d)): *[Point2D](../modules/_types_sol_.md#point2d)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) |

**Returns:** *[SimplePath](_path_.simplepath.md)*

___

###  transformed

▸ **transformed**(`transform`: function): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:143](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L143)*

**Parameters:**

▪ **transform**: *function*

▸ (`point`: [Point2D](../modules/_types_sol_.md#point2d)): *[Point2D](../modules/_types_sol_.md#point2d)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) |

**Returns:** *[SimplePath](_path_.simplepath.md)*

___

###  withAppended

▸ **withAppended**(`other`: [SimplePath](_path_.simplepath.md)): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:147](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L147)*

**Parameters:**

Name | Type |
------ | ------ |
`other` | [SimplePath](_path_.simplepath.md) |

**Returns:** *[SimplePath](_path_.simplepath.md)*

___

### `Static` startAt

▸ **startAt**(`point`: [Point2D](../modules/_types_sol_.md#point2d)): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:17](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) |

**Returns:** *[SimplePath](_path_.simplepath.md)*

___

### `Static` withPoints

▸ **withPoints**(`points`: [Point2D](../modules/_types_sol_.md#point2d)[]): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:21](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`points` | [Point2D](../modules/_types_sol_.md#point2d)[] |

**Returns:** *[SimplePath](_path_.simplepath.md)*