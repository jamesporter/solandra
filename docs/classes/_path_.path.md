> **[solandra](../README.md)**

[Globals](../README.md) / ["path"](../modules/_path_.md) / [Path](_path_.path.md) /

# Class: Path

## Hierarchy

* **Path**

## Implements

* [Traceable](../interfaces/_path_.traceable.md)

## Index

### Accessors

* [centroid](_path_.path.md#centroid)
* [reversed](_path_.path.md#reversed)
* [segmented](_path_.path.md#segmented)

### Methods

* [addCurveTo](_path_.path.md#addcurveto)
* [addLineTo](_path_.path.md#addlineto)
* [exploded](_path_.path.md#exploded)
* [moved](_path_.path.md#moved)
* [rotated](_path_.path.md#rotated)
* [scaled](_path_.path.md#scaled)
* [subdivide](_path_.path.md#subdivide)
* [traceIn](_path_.path.md#tracein)
* [transformed](_path_.path.md#transformed)
* [startAt](_path_.path.md#static-startat)

## Accessors

###  centroid

• **get centroid**(): *[Point2D](../modules/_types_sol_.md#point2d)*

*Defined in [path.ts:294](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L294)*

**Returns:** *[Point2D](../modules/_types_sol_.md#point2d)*

___

###  reversed

• **get reversed**(): *[Path](_path_.path.md)*

*Defined in [path.ts:272](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L272)*

**Returns:** *[Path](_path_.path.md)*

___

###  segmented

• **get segmented**(): *[Path](_path_.path.md)[]*

*Defined in [path.ts:301](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L301)*

Split the path into triangular segments, around the centroid

**Returns:** *[Path](_path_.path.md)[]*

## Methods

###  addCurveTo

▸ **addCurveTo**(`point`: [Point2D](../modules/_types_sol_.md#point2d), `config`: [CurveConfig](../modules/_path_.md#curveconfig)): *[Path](_path_.path.md)*

*Defined in [path.ts:220](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L220)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) | - |
`config` | [CurveConfig](../modules/_path_.md#curveconfig) |  {} |

**Returns:** *[Path](_path_.path.md)*

___

###  addLineTo

▸ **addLineTo**(`point`: [Point2D](../modules/_types_sol_.md#point2d)): *[Path](_path_.path.md)*

*Defined in [path.ts:210](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L210)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) |

**Returns:** *[Path](_path_.path.md)*

___

###  exploded

▸ **exploded**(`config`: object): *[Path](_path_.path.md)[]*

*Defined in [path.ts:320](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L320)*

Split the path into triangular segments, around the centroid.
displaced by magnitude and scaled by scale

**Parameters:**

▪`Default value`  **config**: *object*=  {}

Name | Type |
------ | ------ |
`magnitude?` | undefined \| number |
`scale?` | undefined \| number |

**Returns:** *[Path](_path_.path.md)[]*

___

###  moved

▸ **moved**(`delta`: [Vector2D](../modules/_types_sol_.md#vector2d)): *[Path](_path_.path.md)*

*Defined in [path.ts:263](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L263)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`delta` | [Vector2D](../modules/_types_sol_.md#vector2d) | Vector to move path by  |

**Returns:** *[Path](_path_.path.md)*

___

###  rotated

▸ **rotated**(`angle`: number): *[Path](_path_.path.md)*

*Defined in [path.ts:364](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L364)*

**Parameters:**

Name | Type |
------ | ------ |
`angle` | number |

**Returns:** *[Path](_path_.path.md)*

___

###  scaled

▸ **scaled**(`scale`: number): *[Path](_path_.path.md)*

*Defined in [path.ts:267](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L267)*

**Parameters:**

Name | Type |
------ | ------ |
`scale` | number |

**Returns:** *[Path](_path_.path.md)*

___

###  subdivide

▸ **subdivide**(`config`: object): *[Path](_path_.path.md)[]*

*Defined in [path.ts:376](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L376)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`curve?` | [CurveConfig](../modules/_path_.md#curveconfig) |
`m` | number |
`n` | number |

**Returns:** *[Path](_path_.path.md)[]*

___

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:414](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L414)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*

___

###  transformed

▸ **transformed**(`transform`: function): *[Path](_path_.path.md)*

*Defined in [path.ts:338](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L338)*

**Parameters:**

▪ **transform**: *function*

▸ (`point`: [Point2D](../modules/_types_sol_.md#point2d)): *[Point2D](../modules/_types_sol_.md#point2d)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) |

**Returns:** *[Path](_path_.path.md)*

___

### `Static` startAt

▸ **startAt**(`point`: [Point2D](../modules/_types_sol_.md#point2d)): *[Path](_path_.path.md)*

*Defined in [path.ts:206](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L206)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) |

**Returns:** *[Path](_path_.path.md)*