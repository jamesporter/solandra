> **[solandra](../README.md)**

[Globals](../globals.md) / ["path"](../modules/_path_.md) / [Rect](_path_.rect.md) /

# Class: Rect

## Hierarchy

* **Rect**

## Implements

* [Traceable](../interfaces/_path_.traceable.md)

## Index

### Constructors

* [constructor](_path_.rect.md#constructor)

### Properties

* [at](_path_.rect.md#at)
* [h](_path_.rect.md#h)
* [w](_path_.rect.md#w)

### Methods

* [split](_path_.rect.md#split)
* [traceIn](_path_.rect.md#tracein)

## Constructors

###  constructor

\+ **new Rect**(`config`: object): *[Rect](_path_.rect.md)*

*Defined in [path.ts:304](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L304)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`at` | [Point2D](../modules/_types_play_.md#point2d) |
`h` | number |
`w` | number |

**Returns:** *[Rect](_path_.rect.md)*

## Properties

###  at

• **at**: *[Point2D](../modules/_types_play_.md#point2d)*

*Defined in [path.ts:302](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L302)*

___

###  h

• **h**: *number*

*Defined in [path.ts:304](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L304)*

___

###  w

• **w**: *number*

*Defined in [path.ts:303](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L303)*

## Methods

###  split

▸ **split**(`config`: object): *[Rect](_path_.rect.md)[]*

*Defined in [path.ts:318](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L318)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`orientation` | "vertical" \| "horizontal" |
`split?` | number \| number[] |

**Returns:** *[Rect](_path_.rect.md)[]*

___

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:314](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L314)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*