> **[solandra](../README.md)**

[Globals](../globals.md) / ["gradient"](../modules/_gradient_.md) / [LinearGradient](_gradient_.lineargradient.md) /

# Class: LinearGradient

## Hierarchy

* **LinearGradient**

## Implements

* [Gradientable](../interfaces/_scanvas_.gradientable.md)

## Index

### Constructors

* [constructor](_gradient_.lineargradient.md#constructor)

### Properties

* [config](_gradient_.lineargradient.md#private-config)

### Methods

* [gradient](_gradient_.lineargradient.md#gradient)

## Constructors

###  constructor

\+ **new LinearGradient**(`config`: object): *[LinearGradient](_gradient_.lineargradient.md)*

*Defined in [gradient.ts:5](https://github.com/jamesporter/solandra/blob/c698086/src/lib/gradient.ts#L5)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`colours` | [number, object][] |
`from` | [Point2D](../modules/_types_play_.md#point2d) |
`to` | [Point2D](../modules/_types_play_.md#point2d) |

**Returns:** *[LinearGradient](_gradient_.lineargradient.md)*

## Properties

### `Private` config

• **config**: *object*

*Defined in [gradient.ts:7](https://github.com/jamesporter/solandra/blob/c698086/src/lib/gradient.ts#L7)*

#### Type declaration:

* **colours**: *[number, object][]*

* **from**: *[Point2D](../modules/_types_play_.md#point2d)*

* **to**: *[Point2D](../modules/_types_play_.md#point2d)*

## Methods

###  gradient

▸ **gradient**(`ctx`: `CanvasRenderingContext2D`): *`CanvasGradient`*

*Implementation of [Gradientable](../interfaces/_scanvas_.gradientable.md)*

*Defined in [gradient.ts:22](https://github.com/jamesporter/solandra/blob/c698086/src/lib/gradient.ts#L22)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *`CanvasGradient`*