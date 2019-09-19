> **[solandra](../README.md)**

[Globals](../README.md) / ["paths/Circle"](../modules/_paths_circle_.md) / [Circle](_paths_circle_.circle.md) /

# Class: Circle

Just an ellipse with width = height

## Hierarchy

* [Ellipse](_paths_ellipse_.ellipse.md)

  * **Circle**

## Implements

* [Traceable](../interfaces/_paths_index_.traceable.md)

## Index

### Constructors

* [constructor](_paths_circle_.circle.md#constructor)

### Properties

* [config](_paths_circle_.circle.md#protected-config)

### Methods

* [traceIn](_paths_circle_.circle.md#tracein)

## Constructors

###  constructor

\+ **new Circle**(`config`: object): *[Circle](_paths_circle_.circle.md)*

*Overrides [Ellipse](_paths_ellipse_.ellipse.md).[constructor](_paths_ellipse_.ellipse.md#constructor)*

*Defined in [paths/Circle.ts:7](https://github.com/jamesporter/solandra/blob/544e3ee/src/lib/paths/Circle.ts#L7)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`align?` | "center" \| "topLeft" |
`at` | [Point2D](../modules/_types_sol_.md#point2d) |
`r` | number |

**Returns:** *[Circle](_paths_circle_.circle.md)*

## Properties

### `Protected` config

• **config**: *object*

*Inherited from [Ellipse](_paths_ellipse_.ellipse.md).[config](_paths_ellipse_.ellipse.md#protected-config)*

*Defined in [paths/Ellipse.ts:12](https://github.com/jamesporter/solandra/blob/544e3ee/src/lib/paths/Ellipse.ts#L12)*

#### Type declaration:

* **align**? : *"center" | "topLeft"*

* **at**: *[Point2D](../modules/_types_sol_.md#point2d)*

* **h**: *number*

* **w**: *number*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_paths_index_.traceable.md)*

*Inherited from [Ellipse](_paths_ellipse_.ellipse.md)*

*Defined in [paths/Ellipse.ts:19](https://github.com/jamesporter/solandra/blob/544e3ee/src/lib/paths/Ellipse.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*