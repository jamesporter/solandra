> **[solandra](../README.md)**

[Globals](../README.md) / ["paths/Rect"](../modules/_paths_rect_.md) / [Rect](_paths_rect_.rect.md) /

# Class: Rect

## Hierarchy

* **Rect**

## Implements

* [Traceable](../interfaces/_paths_index_.traceable.md)

## Index

### Constructors

* [constructor](_paths_rect_.rect.md#constructor)

### Properties

* [at](_paths_rect_.rect.md#at)
* [h](_paths_rect_.rect.md#h)
* [w](_paths_rect_.rect.md#w)

### Accessors

* [path](_paths_rect_.rect.md#path)

### Methods

* [split](_paths_rect_.rect.md#split)
* [traceIn](_paths_rect_.rect.md#tracein)

## Constructors

###  constructor

\+ **new Rect**(`config`: object): *[Rect](_paths_rect_.rect.md)*

*Defined in [paths/Rect.ts:6](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Rect.ts#L6)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`at` | [Point2D](../modules/_types_sol_.md#point2d) |
`h` | number |
`w` | number |

**Returns:** *[Rect](_paths_rect_.rect.md)*

## Properties

###  at

• **at**: *[Point2D](../modules/_types_sol_.md#point2d)*

*Defined in [paths/Rect.ts:4](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Rect.ts#L4)*

___

###  h

• **h**: *number*

*Defined in [paths/Rect.ts:6](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Rect.ts#L6)*

___

###  w

• **w**: *number*

*Defined in [paths/Rect.ts:5](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Rect.ts#L5)*

## Accessors

###  path

• **get path**(): *[SimplePath](_paths_simplepath_.simplepath.md)*

*Defined in [paths/Rect.ts:16](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Rect.ts#L16)*

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)*

## Methods

###  split

▸ **split**(`config`: object): *[Rect](_paths_rect_.rect.md)[]*

*Defined in [paths/Rect.ts:25](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Rect.ts#L25)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`orientation` | "vertical" \| "horizontal" |
`split?` | number \| number[] |

**Returns:** *[Rect](_paths_rect_.rect.md)[]*

___

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_paths_index_.traceable.md)*

*Defined in [paths/Rect.ts:13](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Rect.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*