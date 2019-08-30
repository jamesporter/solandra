> **[solandra](../README.md)**

[Globals](../README.md) / ["paths/Hatching"](../modules/_paths_hatching_.md) / [Hatching](_paths_hatching_.hatching.md) /

# Class: Hatching

Hatching in a circle around a point, with a radius and delta between lines

## Hierarchy

* **Hatching**

## Implements

* [Traceable](../interfaces/_paths_index_.traceable.md)

## Index

### Constructors

* [constructor](_paths_hatching_.hatching.md#constructor)

### Methods

* [traceIn](_paths_hatching_.hatching.md#tracein)

## Constructors

###  constructor

\+ **new Hatching**(`config`: object): *[Hatching](_paths_hatching_.hatching.md)*

*Defined in [paths/Hatching.ts:6](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Hatching.ts#L6)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`a` | number |
`at` | [Point2D](../modules/_types_sol_.md#point2d) |
`delta` | number |
`r` | number |

**Returns:** *[Hatching](_paths_hatching_.hatching.md)*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_paths_index_.traceable.md)*

*Defined in [paths/Hatching.ts:15](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/Hatching.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*