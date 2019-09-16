> **[solandra](../README.md)**

[Globals](../README.md) / ["paths/SimplePath"](../modules/_paths_simplepath_.md) / [SimplePath](_paths_simplepath_.simplepath.md) /

# Class: SimplePath

## Hierarchy

* **SimplePath**

## Implements

* [Traceable](../interfaces/_paths_index_.traceable.md)

## Index

### Constructors

* [constructor](_paths_simplepath_.simplepath.md#constructor)

### Properties

* [points](_paths_simplepath_.simplepath.md#points)

### Accessors

* [centroid](_paths_simplepath_.simplepath.md#centroid)
* [edges](_paths_simplepath_.simplepath.md#edges)
* [reversed](_paths_simplepath_.simplepath.md#reversed)
* [segmented](_paths_simplepath_.simplepath.md#segmented)

### Methods

* [addPoint](_paths_simplepath_.simplepath.md#addpoint)
* [chaiken](_paths_simplepath_.simplepath.md#chaiken)
* [close](_paths_simplepath_.simplepath.md#close)
* [curvify](_paths_simplepath_.simplepath.md#curvify)
* [exploded](_paths_simplepath_.simplepath.md#exploded)
* [moved](_paths_simplepath_.simplepath.md#moved)
* [rotated](_paths_simplepath_.simplepath.md#rotated)
* [scaled](_paths_simplepath_.simplepath.md#scaled)
* [subdivide](_paths_simplepath_.simplepath.md#subdivide)
* [traceIn](_paths_simplepath_.simplepath.md#tracein)
* [transformPoints](_paths_simplepath_.simplepath.md#transformpoints)
* [transformed](_paths_simplepath_.simplepath.md#transformed)
* [withAppended](_paths_simplepath_.simplepath.md#withappended)
* [startAt](_paths_simplepath_.simplepath.md#static-startat)
* [withPoints](_paths_simplepath_.simplepath.md#static-withpoints)

## Constructors

###  constructor

\+ **new SimplePath**(`points`: [Point2D](../modules/_types_sol_.md#point2d)[]): *[SimplePath](_paths_simplepath_.simplepath.md)*

*Defined in [paths/SimplePath.ts:8](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L8)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`points` | [Point2D](../modules/_types_sol_.md#point2d)[] |  [] |

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)*

## Properties

###  points

• **points**: *[Point2D](../modules/_types_sol_.md#point2d)[]*

*Defined in [paths/SimplePath.ts:9](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L9)*

## Accessors

###  centroid

• **get centroid**(): *[Point2D](../modules/_types_sol_.md#point2d)*

*Defined in [paths/SimplePath.ts:88](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L88)*

**Returns:** *[Point2D](../modules/_types_sol_.md#point2d)*

___

###  edges

• **get edges**(): *[SimplePath](_paths_simplepath_.simplepath.md)[]*

*Defined in [paths/SimplePath.ts:192](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L192)*

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)[]*

___

###  reversed

• **get reversed**(): *[SimplePath](_paths_simplepath_.simplepath.md)*

*Defined in [paths/SimplePath.ts:84](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L84)*

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)*

___

###  segmented

• **get segmented**(): *[SimplePath](_paths_simplepath_.simplepath.md)[]*

*Defined in [paths/SimplePath.ts:95](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L95)*

Split the path into triangular segments, around the centroid

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)[]*

## Methods

###  addPoint

▸ **addPoint**(`point`: [Point2D](../modules/_types_sol_.md#point2d)): *[SimplePath](_paths_simplepath_.simplepath.md)*

*Defined in [paths/SimplePath.ts:19](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) |

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)*

___

###  chaiken

▸ **chaiken**(`__namedParameters`: object): *[SimplePath](_paths_simplepath_.simplepath.md)*

*Defined in [paths/SimplePath.ts:33](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L33)*

Smooth out path by adding more points to give curvy result

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`looped` | boolean | false |
`n` | number | 1 |

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)*

___

###  close

▸ **close**(): *[SimplePath](_paths_simplepath_.simplepath.md)*

*Defined in [paths/SimplePath.ts:24](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L24)*

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)*

___

###  curvify

▸ **curvify**(`style`: function): *[Path](_paths_path_.path.md)*

*Defined in [paths/SimplePath.ts:177](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L177)*

Convert a simple path to a curved path

**Parameters:**

▪ **style**: *function*

▸ (`i`: number): *[CurveConfig](../modules/_paths_path_.md#curveconfig) | null*

**Parameters:**

Name | Type |
------ | ------ |
`i` | number |

**Returns:** *[Path](_paths_path_.path.md)*

___

###  exploded

▸ **exploded**(`config`: object): *[SimplePath](_paths_simplepath_.simplepath.md)[]*

*Defined in [paths/SimplePath.ts:117](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L117)*

Split the path into triangular segments, around the centroid.
displaced by magnitude and scaled by scale

**Parameters:**

▪`Default value`  **config**: *object*=  {}

Name | Type |
------ | ------ |
`magnitude?` | undefined \| number |
`scale?` | undefined \| number |

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)[]*

___

###  moved

▸ **moved**(`delta`: [Vector2D](../modules/_types_sol_.md#vector2d)): *[SimplePath](_paths_simplepath_.simplepath.md)*

*Defined in [paths/SimplePath.ts:66](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L66)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`delta` | [Vector2D](../modules/_types_sol_.md#vector2d) | Vector to move path by  |

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)*

___

###  rotated

▸ **rotated**(`angle`: number): *[SimplePath](_paths_simplepath_.simplepath.md)*

*Defined in [paths/SimplePath.ts:145](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L145)*

**Parameters:**

Name | Type |
------ | ------ |
`angle` | number |

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)*

___

###  scaled

▸ **scaled**(`scale`: number): *[SimplePath](_paths_simplepath_.simplepath.md)*

*Defined in [paths/SimplePath.ts:70](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`scale` | number |

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)*

___

###  subdivide

▸ **subdivide**(`config`: object): *[SimplePath](_paths_simplepath_.simplepath.md)[]*

*Defined in [paths/SimplePath.ts:157](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L157)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`m` | number |
`n` | number |

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)[]*

___

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_paths_index_.traceable.md)*

*Defined in [paths/SimplePath.ts:55](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L55)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*

___

###  transformPoints

▸ **transformPoints**(`transform`: function): *[SimplePath](_paths_simplepath_.simplepath.md)*

*Defined in [paths/SimplePath.ts:79](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L79)*

Warning mutates

**Parameters:**

▪ **transform**: *function*

▸ (`point`: [Point2D](../modules/_types_sol_.md#point2d)): *[Point2D](../modules/_types_sol_.md#point2d)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) |

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)*

___

###  transformed

▸ **transformed**(`transform`: function): *[SimplePath](_paths_simplepath_.simplepath.md)*

*Defined in [paths/SimplePath.ts:137](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L137)*

**Parameters:**

▪ **transform**: *function*

▸ (`point`: [Point2D](../modules/_types_sol_.md#point2d)): *[Point2D](../modules/_types_sol_.md#point2d)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) |

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)*

___

###  withAppended

▸ **withAppended**(`other`: [SimplePath](_paths_simplepath_.simplepath.md)): *[SimplePath](_paths_simplepath_.simplepath.md)*

*Defined in [paths/SimplePath.ts:141](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L141)*

**Parameters:**

Name | Type |
------ | ------ |
`other` | [SimplePath](_paths_simplepath_.simplepath.md) |

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)*

___

### `Static` startAt

▸ **startAt**(`point`: [Point2D](../modules/_types_sol_.md#point2d)): *[SimplePath](_paths_simplepath_.simplepath.md)*

*Defined in [paths/SimplePath.ts:11](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) |

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)*

___

### `Static` withPoints

▸ **withPoints**(`points`: [Point2D](../modules/_types_sol_.md#point2d)[]): *[SimplePath](_paths_simplepath_.simplepath.md)*

*Defined in [paths/SimplePath.ts:15](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/SimplePath.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`points` | [Point2D](../modules/_types_sol_.md#point2d)[] |

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)*