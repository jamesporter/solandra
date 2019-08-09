> **[solandra](../README.md)**

[Globals](../README.md) / ["path"](../modules/_path_.md) / [Rect](_path_.rect.md) /

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

*Defined in [path.ts:316](https://github.com/jamesporter/solandra/blob/2971925/src/lib/path.ts#L316)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`at` | [Point2D](../modules/_types_sol_.md#point2d) |
`h` | number |
`w` | number |

**Returns:** *[Rect](_path_.rect.md)*

## Properties

###  at

• **at**: *[Point2D](../modules/_types_sol_.md#point2d)*

*Defined in [path.ts:314](https://github.com/jamesporter/solandra/blob/2971925/src/lib/path.ts#L314)*

___

###  h

• **h**: *number*

*Defined in [path.ts:316](https://github.com/jamesporter/solandra/blob/2971925/src/lib/path.ts#L316)*

___

###  w

• **w**: *number*

*Defined in [path.ts:315](https://github.com/jamesporter/solandra/blob/2971925/src/lib/path.ts#L315)*

## Methods

###  split

▸ **split**(`config`: object): *[Rect](_path_.rect.md)[]*

*Defined in [path.ts:330](https://github.com/jamesporter/solandra/blob/2971925/src/lib/path.ts#L330)*

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

*Defined in [path.ts:326](https://github.com/jamesporter/solandra/blob/2971925/src/lib/path.ts#L326)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*