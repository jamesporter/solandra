> **[solandra](../README.md)**

[Globals](../README.md) / ["paths/Square"](../modules/_paths_square_.md) / [Square](_paths_square_.square.md) /

# Class: Square

## Hierarchy

* [Rect](_paths_rect_.rect.md)

  * **Square**

## Implements

* [Traceable](../interfaces/_paths_index_.traceable.md)

## Index

### Constructors

* [constructor](_paths_square_.square.md#constructor)

### Properties

* [at](_paths_square_.square.md#at)
* [h](_paths_square_.square.md#h)
* [w](_paths_square_.square.md#w)

### Accessors

* [path](_paths_square_.square.md#path)

### Methods

* [split](_paths_square_.square.md#split)
* [traceIn](_paths_square_.square.md#tracein)

## Constructors

###  constructor

\+ **new Square**(`config`: object): *[Square](_paths_square_.square.md)*

*Overrides [Rect](_paths_rect_.rect.md).[constructor](_paths_rect_.rect.md#constructor)*

*Defined in [paths/Square.ts:4](https://github.com/jamesporter/solandra/blob/544e3ee/src/lib/paths/Square.ts#L4)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`align?` | "topLeft" \| "center" |
`at` | [Point2D](../modules/_types_sol_.md#point2d) |
`s` | number |

**Returns:** *[Square](_paths_square_.square.md)*

## Properties

###  at

• **at**: *[Point2D](../modules/_types_sol_.md#point2d)*

*Inherited from [Rect](_paths_rect_.rect.md).[at](_paths_rect_.rect.md#at)*

*Defined in [paths/Rect.ts:5](https://github.com/jamesporter/solandra/blob/544e3ee/src/lib/paths/Rect.ts#L5)*

___

###  h

• **h**: *number*

*Inherited from [Rect](_paths_rect_.rect.md).[h](_paths_rect_.rect.md#h)*

*Defined in [paths/Rect.ts:7](https://github.com/jamesporter/solandra/blob/544e3ee/src/lib/paths/Rect.ts#L7)*

___

###  w

• **w**: *number*

*Inherited from [Rect](_paths_rect_.rect.md).[w](_paths_rect_.rect.md#w)*

*Defined in [paths/Rect.ts:6](https://github.com/jamesporter/solandra/blob/544e3ee/src/lib/paths/Rect.ts#L6)*

## Accessors

###  path

• **get path**(): *[SimplePath](_paths_simplepath_.simplepath.md)*

*Inherited from [Rect](_paths_rect_.rect.md).[path](_paths_rect_.rect.md#path)*

*Defined in [paths/Rect.ts:22](https://github.com/jamesporter/solandra/blob/544e3ee/src/lib/paths/Rect.ts#L22)*

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)*

## Methods

###  split

▸ **split**(`config`: object): *[Rect](_paths_rect_.rect.md)[]*

*Inherited from [Rect](_paths_rect_.rect.md)*

*Defined in [paths/Rect.ts:31](https://github.com/jamesporter/solandra/blob/544e3ee/src/lib/paths/Rect.ts#L31)*

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

*Inherited from [Rect](_paths_rect_.rect.md)*

*Defined in [paths/Rect.ts:19](https://github.com/jamesporter/solandra/blob/544e3ee/src/lib/paths/Rect.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*