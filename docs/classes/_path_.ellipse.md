> **[solandra](../README.md)**

[Globals](../README.md) / ["path"](../modules/_path_.md) / [Ellipse](_path_.ellipse.md) /

# Class: Ellipse

Technically you can't do ellipses/circles properly with cubic beziers, but you can come very, very close

Uses 4 point, cubic beziers, approximation of (4/3)*tan(pi/8) for control points

https://stackoverflow.com/questions/1734745/how-to-create-circle-with-bézier-curves

## Hierarchy

* **Ellipse**

  * [Circle](_path_.circle.md)

## Implements

* [Traceable](../interfaces/_path_.traceable.md)

## Index

### Constructors

* [constructor](_path_.ellipse.md#constructor)

### Properties

* [config](_path_.ellipse.md#protected-config)

### Methods

* [traceIn](_path_.ellipse.md#tracein)

## Constructors

###  constructor

\+ **new Ellipse**(`config`: object): *[Ellipse](_path_.ellipse.md)*

*Defined in [path.ts:461](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L461)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`align?` | "center" \| "topLeft" |
`at` | [Point2D](../modules/_types_sol_.md#point2d) |
`h` | number |
`w` | number |

**Returns:** *[Ellipse](_path_.ellipse.md)*

## Properties

### `Protected` config

• **config**: *object*

*Defined in [path.ts:463](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L463)*

#### Type declaration:

* **align**? : *"center" | "topLeft"*

* **at**: *[Point2D](../modules/_types_sol_.md#point2d)*

* **h**: *number*

* **w**: *number*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:471](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L471)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*