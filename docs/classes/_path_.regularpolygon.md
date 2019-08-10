> **[solandra](../README.md)**

[Globals](../README.md) / ["path"](../modules/_path_.md) / [RegularPolygon](_path_.regularpolygon.md) /

# Class: RegularPolygon

## Hierarchy

* **RegularPolygon**

## Implements

* [Traceable](../interfaces/_path_.traceable.md)

## Index

### Constructors

* [constructor](_path_.regularpolygon.md#constructor)

### Accessors

* [path](_path_.regularpolygon.md#path)

### Methods

* [traceIn](_path_.regularpolygon.md#tracein)

## Constructors

###  constructor

\+ **new RegularPolygon**(`config`: object): *[RegularPolygon](_path_.regularpolygon.md)*

*Defined in [path.ts:535](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L535)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`a?` | undefined \| number |
`at` | [Point2D](../modules/_types_sol_.md#point2d) |
`n` | number |
`r` | number |

**Returns:** *[RegularPolygon](_path_.regularpolygon.md)*

## Accessors

###  path

• **get path**(): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:570](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L570)*

**Returns:** *[SimplePath](_path_.simplepath.md)*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:550](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L550)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*