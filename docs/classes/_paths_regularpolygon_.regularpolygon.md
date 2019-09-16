> **[solandra](../README.md)**

[Globals](../README.md) / ["paths/RegularPolygon"](../modules/_paths_regularpolygon_.md) / [RegularPolygon](_paths_regularpolygon_.regularpolygon.md) /

# Class: RegularPolygon

## Hierarchy

* **RegularPolygon**

## Implements

* [Traceable](../interfaces/_paths_index_.traceable.md)

## Index

### Constructors

* [constructor](_paths_regularpolygon_.regularpolygon.md#constructor)

### Accessors

* [path](_paths_regularpolygon_.regularpolygon.md#path)

### Methods

* [traceIn](_paths_regularpolygon_.regularpolygon.md#tracein)

## Constructors

###  constructor

\+ **new RegularPolygon**(`config`: object): *[RegularPolygon](_paths_regularpolygon_.regularpolygon.md)*

*Defined in [paths/RegularPolygon.ts:5](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/RegularPolygon.ts#L5)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`a?` | undefined \| number |
`at` | [Point2D](../modules/_types_sol_.md#point2d) |
`n` | number |
`r` | number |

**Returns:** *[RegularPolygon](_paths_regularpolygon_.regularpolygon.md)*

## Accessors

###  path

• **get path**(): *[SimplePath](_paths_simplepath_.simplepath.md)*

*Defined in [paths/RegularPolygon.ts:40](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/RegularPolygon.ts#L40)*

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_paths_index_.traceable.md)*

*Defined in [paths/RegularPolygon.ts:20](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/RegularPolygon.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*