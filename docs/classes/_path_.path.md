> **[solandra](../README.md)**

[Globals](../globals.md) / ["path"](../modules/_path_.md) / [Path](_path_.path.md) /

# Class: Path

## Hierarchy

* **Path**

## Implements

* [Traceable](../interfaces/_path_.traceable.md)

## Index

### Constructors

* [constructor](_path_.path.md#private-constructor)

### Properties

* [currentPoint](_path_.path.md#private-currentpoint)
* [edges](_path_.path.md#private-edges)

### Methods

* [addCurveTo](_path_.path.md#addcurveto)
* [addLineTo](_path_.path.md#addlineto)
* [traceIn](_path_.path.md#tracein)
* [startAt](_path_.path.md#static-startat)

## Constructors

### `Private` constructor

\+ **new Path**(`path`: [Point2D](../modules/_types_play_.md#point2d)): *[Path](_path_.path.md)*

*Defined in [path.ts:107](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L107)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | [Point2D](../modules/_types_play_.md#point2d) |

**Returns:** *[Path](_path_.path.md)*

## Properties

### `Private` currentPoint

• **currentPoint**: *[Point2D](../modules/_types_play_.md#point2d)*

*Defined in [path.ts:106](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L106)*

___

### `Private` edges

• **edges**: *[PathEdge](../modules/_path_.md#pathedge)[]* =  []

*Defined in [path.ts:107](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L107)*

## Methods

###  addCurveTo

▸ **addCurveTo**(`point`: [Point2D](../modules/_types_play_.md#point2d), `config`: [CurveConfig](../modules/_path_.md#curveconfig)): *[Path](_path_.path.md)*

*Defined in [path.ts:127](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L127)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`point` | [Point2D](../modules/_types_play_.md#point2d) | - |
`config` | [CurveConfig](../modules/_path_.md#curveconfig) |  {} |

**Returns:** *[Path](_path_.path.md)*

___

###  addLineTo

▸ **addLineTo**(`point`: [Point2D](../modules/_types_play_.md#point2d)): *[Path](_path_.path.md)*

*Defined in [path.ts:117](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L117)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_play_.md#point2d) |

**Returns:** *[Path](_path_.path.md)*

___

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:167](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L167)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*

___

### `Static` startAt

▸ **startAt**(`point`: [Point2D](../modules/_types_play_.md#point2d)): *[Path](_path_.path.md)*

*Defined in [path.ts:113](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L113)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_play_.md#point2d) |

**Returns:** *[Path](_path_.path.md)*