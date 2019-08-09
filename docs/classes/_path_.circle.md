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

*Defined in [path.ts:498](https://github.com/jamesporter/solandra/blob/2971925/src/lib/path.ts#L498)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`align?` | "center" \| "topLeft" |
`at` | [Point2D](../modules/_types_sol_.md#point2d) |
`r` | number |

**Returns:** *[Circle](_path_.circle.md)*

## Properties

### `Protected` config

• **config**: *object*

*Inherited from [Ellipse](_path_.ellipse.md).[config](_path_.ellipse.md#protected-config)*

*Defined in [path.ts:441](https://github.com/jamesporter/solandra/blob/2971925/src/lib/path.ts#L441)*

#### Type declaration:

* **align**? : *"center" | "topLeft"*

* **at**: *[Point2D](../modules/_types_sol_.md#point2d)*

* **h**: *number*

* **w**: *number*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Inherited from [Ellipse](_path_.ellipse.md)*

*Defined in [path.ts:449](https://github.com/jamesporter/solandra/blob/2971925/src/lib/path.ts#L449)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*