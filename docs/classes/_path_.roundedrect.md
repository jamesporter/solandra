> **[solandra](../README.md)**

[Globals](../README.md) / ["path"](../modules/_path_.md) / [RoundedRect](_path_.roundedrect.md) /

# Class: RoundedRect

## Hierarchy

* **RoundedRect**

## Implements

* [Traceable](../interfaces/_path_.traceable.md)

## Index

### Constructors

* [constructor](_path_.roundedrect.md#constructor)

### Properties

* [at](_path_.roundedrect.md#at)
* [h](_path_.roundedrect.md#h)
* [r](_path_.roundedrect.md#r)
* [w](_path_.roundedrect.md#w)

### Methods

* [traceIn](_path_.roundedrect.md#tracein)

## Constructors

###  constructor

\+ **new RoundedRect**(`config`: object): *[RoundedRect](_path_.roundedrect.md)*

*Defined in [path.ts:660](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L660)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`at` | [Point2D](../modules/_types_sol_.md#point2d) |
`h` | number |
`r` | number |
`w` | number |

**Returns:** *[RoundedRect](_path_.roundedrect.md)*

## Properties

###  at

• **at**: *[Point2D](../modules/_types_sol_.md#point2d)*

*Defined in [path.ts:657](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L657)*

___

###  h

• **h**: *number*

*Defined in [path.ts:659](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L659)*

___

###  r

• **r**: *number*

*Defined in [path.ts:660](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L660)*

___

###  w

• **w**: *number*

*Defined in [path.ts:658](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L658)*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:671](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L671)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*