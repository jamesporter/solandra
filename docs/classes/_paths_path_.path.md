> **[solandra](../README.md)**

[Globals](../README.md) / ["paths/Path"](../modules/_paths_path_.md) / [Path](_paths_path_.path.md) /

# Class: Path

## Hierarchy

* **Path**

## Implements

* [Traceable](../interfaces/_paths_index_.traceable.md)

## Index

### Accessors

* [centroid](_paths_path_.path.md#centroid)
* [reversed](_paths_path_.path.md#reversed)
* [segmented](_paths_path_.path.md#segmented)

### Methods

* [addCurve](_paths_path_.path.md#addcurve)
* [addCurveTo](_paths_path_.path.md#addcurveto)
* [addLineTo](_paths_path_.path.md#addlineto)
* [exploded](_paths_path_.path.md#exploded)
* [moved](_paths_path_.path.md#moved)
* [rotated](_paths_path_.path.md#rotated)
* [scaled](_paths_path_.path.md#scaled)
* [subdivide](_paths_path_.path.md#subdivide)
* [traceIn](_paths_path_.path.md#tracein)
* [transformed](_paths_path_.path.md#transformed)
* [startAt](_paths_path_.path.md#static-startat)

## Accessors

###  centroid

• **get centroid**(): *[Point2D](../modules/_types_sol_.md#point2d)*

*Defined in [paths/Path.ts:146](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Path.ts#L146)*

Vertex-wise centroid

**Returns:** *[Point2D](../modules/_types_sol_.md#point2d)*

___

###  reversed

• **get reversed**(): *[Path](_paths_path_.path.md)*

*Defined in [paths/Path.ts:121](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Path.ts#L121)*

**Returns:** *[Path](_paths_path_.path.md)*

___

###  segmented

• **get segmented**(): *[Path](_paths_path_.path.md)[]*

*Defined in [paths/Path.ts:153](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Path.ts#L153)*

Split the path into triangular segments, around the centroid

**Returns:** *[Path](_paths_path_.path.md)[]*

## Methods

###  addCurve

▸ **addCurve**(`config`: [CurveConfig](../modules/_paths_path_.md#curveconfig) & object): *[Path](_paths_path_.path.md)*

*Defined in [paths/Path.ts:52](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Path.ts#L52)*

Add a curve

**Parameters:**

Name | Type |
------ | ------ |
`config` | [CurveConfig](../modules/_paths_path_.md#curveconfig) & object |

**Returns:** *[Path](_paths_path_.path.md)*

___

###  addCurveTo

▸ **addCurveTo**(`point`: [Point2D](../modules/_types_sol_.md#point2d), `config`: [CurveConfig](../modules/_paths_path_.md#curveconfig)): *[Path](_paths_path_.path.md)*

*Defined in [paths/Path.ts:65](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Path.ts#L65)*

Adds a curve to a point
with optional configuration

Admittedly this is inconsistent with APIs elsewhere (where typically config
goes first) but I found in practice this is nice. addCurve is also available
and more consistent.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) | - |
`config` | [CurveConfig](../modules/_paths_path_.md#curveconfig) |  {} |

**Returns:** *[Path](_paths_path_.path.md)*

___

###  addLineTo

▸ **addLineTo**(`point`: [Point2D](../modules/_types_sol_.md#point2d)): *[Path](_paths_path_.path.md)*

*Defined in [paths/Path.ts:39](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Path.ts#L39)*

Add a line to a point

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) |

**Returns:** *[Path](_paths_path_.path.md)*

___

###  exploded

▸ **exploded**(`config`: object): *[Path](_paths_path_.path.md)[]*

*Defined in [paths/Path.ts:172](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Path.ts#L172)*

Split the path into triangular segments, around the centroid.
displaced by magnitude and scaled by scale

**Parameters:**

▪`Default value`  **config**: *object*=  {}

Name | Type |
------ | ------ |
`magnitude?` | undefined \| number |
`scale?` | undefined \| number |

**Returns:** *[Path](_paths_path_.path.md)[]*

___

###  moved

▸ **moved**(`delta`: [Vector2D](../modules/_types_sol_.md#vector2d)): *[Path](_paths_path_.path.md)*

*Defined in [paths/Path.ts:108](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Path.ts#L108)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`delta` | [Vector2D](../modules/_types_sol_.md#vector2d) | Vector to move path by  |

**Returns:** *[Path](_paths_path_.path.md)*

___

###  rotated

▸ **rotated**(`angle`: number): *[Path](_paths_path_.path.md)*

*Defined in [paths/Path.ts:224](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Path.ts#L224)*

Rotate a path about its vertex-wise centroid

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`angle` | number | radians as alway  |

**Returns:** *[Path](_paths_path_.path.md)*

___

###  scaled

▸ **scaled**(`scale`: number): *[Path](_paths_path_.path.md)*

*Defined in [paths/Path.ts:116](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Path.ts#L116)*

Scale a path around its (vertex-wise) centroid

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`scale` | number |   |

**Returns:** *[Path](_paths_path_.path.md)*

___

###  subdivide

▸ **subdivide**(`config`: object): *[Path](_paths_path_.path.md)[]*

*Defined in [paths/Path.ts:241](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Path.ts#L241)*

Split a path into two, supply a curve configuration to split with a curve
otherwise will be split with a straight line.

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`curve?` | [CurveConfig](../modules/_paths_path_.md#curveconfig) |
`m` | number |
`n` | number |

**Returns:** *[Path](_paths_path_.path.md)[]*

___

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_paths_index_.traceable.md)*

*Defined in [paths/Path.ts:279](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Path.ts#L279)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*

___

###  transformed

▸ **transformed**(`transform`: function): *[Path](_paths_path_.path.md)*

*Defined in [paths/Path.ts:194](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Path.ts#L194)*

A new path transforming the current one in a pointwise manner

**Parameters:**

▪ **transform**: *function*

▸ (`point`: [Point2D](../modules/_types_sol_.md#point2d)): *[Point2D](../modules/_types_sol_.md#point2d)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) |

**Returns:** *[Path](_paths_path_.path.md)*

___

### `Static` startAt

▸ **startAt**(`point`: [Point2D](../modules/_types_sol_.md#point2d)): *[Path](_paths_path_.path.md)*

*Defined in [paths/Path.ts:32](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Path.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) |

**Returns:** *[Path](_paths_path_.path.md)*