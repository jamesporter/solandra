> **[solandra](../README.md)**

[Globals](../README.md) / ["paths/Ellipse"](../modules/_paths_ellipse_.md) / [Ellipse](_paths_ellipse_.ellipse.md) /

# Class: Ellipse

Technically you can't do ellipses/circles properly with cubic beziers, but you can come very, very close

Uses 4 point, cubic beziers, approximation of (4/3)*tan(pi/8) for control points

https://stackoverflow.com/questions/1734745/how-to-create-circle-with-bézier-curves

## Hierarchy

* **Ellipse**

  * [Circle](_paths_circle_.circle.md)

## Implements

* [Traceable](../interfaces/_paths_index_.traceable.md)

## Index

### Constructors

* [constructor](_paths_ellipse_.ellipse.md#constructor)

### Properties

* [config](_paths_ellipse_.ellipse.md#protected-config)

### Methods

* [traceIn](_paths_ellipse_.ellipse.md#tracein)

## Constructors

###  constructor

\+ **new Ellipse**(`config`: object): *[Ellipse](_paths_ellipse_.ellipse.md)*

*Defined in [paths/Ellipse.ts:10](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Ellipse.ts#L10)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`align?` | "center" \| "topLeft" |
`at` | [Point2D](../modules/_types_sol_.md#point2d) |
`h` | number |
`w` | number |

**Returns:** *[Ellipse](_paths_ellipse_.ellipse.md)*

## Properties

### `Protected` config

• **config**: *object*

*Defined in [paths/Ellipse.ts:12](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Ellipse.ts#L12)*

#### Type declaration:

* **align**? : *"center" | "topLeft"*

* **at**: *[Point2D](../modules/_types_sol_.md#point2d)*

* **h**: *number*

* **w**: *number*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_paths_index_.traceable.md)*

*Defined in [paths/Ellipse.ts:19](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Ellipse.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*