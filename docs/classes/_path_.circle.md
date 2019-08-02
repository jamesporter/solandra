> **[solandra](../README.md)**

[Globals](../README.md) / ["path"](../modules/_path_.md) / [Circle](_path_.circle.md) /

# Class: Circle

Just an ellipse with width = height

## Hierarchy

* [Ellipse](_path_.ellipse.md)

  * **Circle**

## Implements

* [Traceable](../interfaces/_path_.traceable.md)

## Index

### Constructors

* [constructor](_path_.circle.md#constructor)

### Properties

* [config](_path_.circle.md#protected-config)

### Methods

* [traceIn](_path_.circle.md#tracein)

## Constructors

###  constructor

\+ **new Circle**(`config`: object): *[Circle](_path_.circle.md)*

*Overrides [Ellipse](_path_.ellipse.md).[constructor](_path_.ellipse.md#constructor)*

*Defined in [path.ts:486](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L486)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`align?` | "center" \| "topLeft" |
`at` | [Point2D](../modules/_types_play_.md#point2d) |
`r` | number |

**Returns:** *[Circle](_path_.circle.md)*

## Properties

### `Protected` config

• **config**: *object*

*Inherited from [Ellipse](_path_.ellipse.md).[config](_path_.ellipse.md#protected-config)*

*Defined in [path.ts:429](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L429)*

#### Type declaration:

* **align**? : *"center" | "topLeft"*

* **at**: *[Point2D](../modules/_types_play_.md#point2d)*

* **h**: *number*

* **w**: *number*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Inherited from [Ellipse](_path_.ellipse.md)*

*Defined in [path.ts:437](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L437)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*