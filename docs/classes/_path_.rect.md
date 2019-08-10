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

### Accessors

* [path](_path_.rect.md#path)

### Methods

* [split](_path_.rect.md#split)
* [traceIn](_path_.rect.md#tracein)

## Constructors

###  constructor

\+ **new Rect**(`config`: object): *[Rect](_path_.rect.md)*

*Defined in [path.ts:328](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L328)*

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

*Defined in [path.ts:326](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L326)*

___

###  h

• **h**: *number*

*Defined in [path.ts:328](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L328)*

___

###  w

• **w**: *number*

*Defined in [path.ts:327](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L327)*

## Accessors

###  path

• **get path**(): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:342](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L342)*

**Returns:** *[SimplePath](_path_.simplepath.md)*

## Methods

###  split

▸ **split**(`config`: object): *[Rect](_path_.rect.md)[]*

*Defined in [path.ts:352](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L352)*

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

*Defined in [path.ts:338](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L338)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*