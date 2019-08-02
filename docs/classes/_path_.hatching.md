> **[solandra](../README.md)**

[Globals](../globals.md) / ["path"](../modules/_path_.md) / [Hatching](_path_.hatching.md) /

# Class: Hatching

Hatching in a circle around a point, with a radius and delta between lines

## Hierarchy

* **Hatching**

## Implements

* [Traceable](../interfaces/_path_.traceable.md)

## Index

### Constructors

* [constructor](_path_.hatching.md#constructor)

### Properties

* [config](_path_.hatching.md#private-config)

### Methods

* [traceIn](_path_.hatching.md#tracein)

## Constructors

###  constructor

\+ **new Hatching**(`config`: object): *[Hatching](_path_.hatching.md)*

*Defined in [path.ts:587](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L587)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`a` | number |
`at` | [Point2D](../modules/_types_play_.md#point2d) |
`delta` | number |
`r` | number |

**Returns:** *[Hatching](_path_.hatching.md)*

## Properties

### `Private` config

• **config**: *object*

*Defined in [path.ts:589](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L589)*

#### Type declaration:

* **a**: *number*

* **at**: *[Point2D](../modules/_types_play_.md#point2d)*

* **delta**: *number*

* **r**: *number*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:597](https://github.com/jamesporter/solandra/blob/c698086/src/lib/path.ts#L597)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*