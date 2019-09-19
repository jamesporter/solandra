> **[solandra](../README.md)**

[Globals](../README.md) / ["gradient"](../modules/_gradient_.md) / [RadialGradient](_gradient_.radialgradient.md) /

# Class: RadialGradient

## Hierarchy

* **RadialGradient**

## Implements

* [Gradientable](../interfaces/_scanvas_.gradientable.md)

## Index

### Constructors

* [constructor](_gradient_.radialgradient.md#constructor)

### Methods

* [gradient](_gradient_.radialgradient.md#gradient)

## Constructors

###  constructor

\+ **new RadialGradient**(`config`: object): *[RadialGradient](_gradient_.radialgradient.md)*

*Defined in [gradient.ts:36](https://github.com/jamesporter/solandra/blob/544e3ee/src/lib/gradient.ts#L36)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`colours` | [number, object][] |
`end` | [Point2D](../modules/_types_sol_.md#point2d) |
`rEnd` | number |
`rStart` | number |
`start` | [Point2D](../modules/_types_sol_.md#point2d) |

**Returns:** *[RadialGradient](_gradient_.radialgradient.md)*

## Methods

###  gradient

▸ **gradient**(`ctx`: `CanvasRenderingContext2D`): *`CanvasGradient`*

*Implementation of [Gradientable](../interfaces/_scanvas_.gradientable.md)*

*Defined in [gradient.ts:55](https://github.com/jamesporter/solandra/blob/544e3ee/src/lib/gradient.ts#L55)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *`CanvasGradient`*