> **[solandra](../README.md)**

[Globals](../README.md) / ["path"](../modules/_path_.md) / [Path](_path_.path.md) /

# Class: Path

## Hierarchy

* **Path**

## Implements

* [Traceable](../interfaces/_path_.traceable.md)

## Index

### Methods

* [addCurveTo](_path_.path.md#addcurveto)
* [addLineTo](_path_.path.md#addlineto)
* [traceIn](_path_.path.md#tracein)
* [startAt](_path_.path.md#static-startat)

## Methods

###  addCurveTo

▸ **addCurveTo**(`point`: [Point2D](../modules/_types_sol_.md#point2d), `config`: [CurveConfig](../modules/_path_.md#curveconfig)): *[Path](_path_.path.md)*

*Defined in [path.ts:127](https://github.com/jamesporter/solandra/blob/9c7ec25/src/lib/path.ts#L127)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) | - |
`config` | [CurveConfig](../modules/_path_.md#curveconfig) |  {} |

**Returns:** *[Path](_path_.path.md)*

___

###  addLineTo

▸ **addLineTo**(`point`: [Point2D](../modules/_types_sol_.md#point2d)): *[Path](_path_.path.md)*

*Defined in [path.ts:117](https://github.com/jamesporter/solandra/blob/9c7ec25/src/lib/path.ts#L117)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) |

**Returns:** *[Path](_path_.path.md)*

___

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:167](https://github.com/jamesporter/solandra/blob/9c7ec25/src/lib/path.ts#L167)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*

___

### `Static` startAt

▸ **startAt**(`point`: [Point2D](../modules/_types_sol_.md#point2d)): *[Path](_path_.path.md)*

*Defined in [path.ts:113](https://github.com/jamesporter/solandra/blob/9c7ec25/src/lib/path.ts#L113)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_sol_.md#point2d) |

**Returns:** *[Path](_path_.path.md)*