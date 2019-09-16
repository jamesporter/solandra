> **[solandra](../README.md)**

[Globals](../README.md) / ["paths/Spiral"](../modules/_paths_spiral_.md) / [Spiral](_paths_spiral_.spiral.md) /

# Class: Spiral

## Hierarchy

* **Spiral**

## Implements

* [Traceable](../interfaces/_paths_index_.traceable.md)

## Index

### Constructors

* [constructor](_paths_spiral_.spiral.md#constructor)

### Properties

* [path](_paths_spiral_.spiral.md#path)

### Methods

* [traceIn](_paths_spiral_.spiral.md#tracein)

## Constructors

###  constructor

\+ **new Spiral**(`__namedParameters`: object): *[Spiral](_paths_spiral_.spiral.md)*

*Defined in [paths/Spiral.ts:6](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/Spiral.ts#L6)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`at` | [number, number] | - |
`l` | number | - |
`n` | number | - |
`rate` | number | 0.005 |
`sA` | number | 0 |

**Returns:** *[Spiral](_paths_spiral_.spiral.md)*

## Properties

###  path

• **path**: *[SimplePath](_paths_simplepath_.simplepath.md)*

*Defined in [paths/Spiral.ts:6](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/Spiral.ts#L6)*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_paths_index_.traceable.md)*

*Defined in [paths/Spiral.ts:32](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/Spiral.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*