> **[solandra](../README.md)**

[Globals](../globals.md) / ["path"](../modules/_path_.md) / [RoundedRect](_path_.roundedrect.md) /

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

*Defined in [path.ts:391](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L391)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`at` | [Point2D](../modules/_types_play_.md#point2d) |
`h` | number |
`r` | number |
`w` | number |

**Returns:** *[RoundedRect](_path_.roundedrect.md)*

## Properties

###  at

• **at**: *[Point2D](../modules/_types_play_.md#point2d)*

*Defined in [path.ts:388](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L388)*

___

###  h

• **h**: *number*

*Defined in [path.ts:390](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L390)*

___

###  r

• **r**: *number*

*Defined in [path.ts:391](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L391)*

___

###  w

• **w**: *number*

*Defined in [path.ts:389](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L389)*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:402](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L402)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*