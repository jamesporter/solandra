> **[solandra](../README.md)**

[Globals](../globals.md) / ["path"](../modules/_path_.md) / [RegularPolygon](_path_.regularpolygon.md) /

# Class: RegularPolygon

## Hierarchy

* **RegularPolygon**

## Implements

* [Traceable](../interfaces/_path_.traceable.md)

## Index

### Constructors

* [constructor](_path_.regularpolygon.md#constructor)

### Properties

* [config](_path_.regularpolygon.md#private-config)

### Methods

* [traceIn](_path_.regularpolygon.md#tracein)

## Constructors

###  constructor

\+ **new RegularPolygon**(`config`: object): *[RegularPolygon](_path_.regularpolygon.md)*

*Defined in [path.ts:501](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L501)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`a?` | undefined \| number |
`at` | [Point2D](../modules/_types_play_.md#point2d) |
`n` | number |
`r` | number |

**Returns:** *[RegularPolygon](_path_.regularpolygon.md)*

## Properties

### `Private` config

• **config**: *object*

*Defined in [path.ts:503](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L503)*

#### Type declaration:

* **a**? : *undefined | number*

* **at**: *[Point2D](../modules/_types_play_.md#point2d)*

* **n**: *number*

* **r**: *number*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:516](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L516)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*