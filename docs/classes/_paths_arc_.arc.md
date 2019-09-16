> **[solandra](../README.md)**

[Globals](../README.md) / ["paths/Arc"](../modules/_paths_arc_.md) / [Arc](_paths_arc_.arc.md) /

# Class: Arc

## Hierarchy

* **Arc**

## Implements

* [Traceable](../interfaces/_paths_index_.traceable.md)

## Index

### Constructors

* [constructor](_paths_arc_.arc.md#constructor)

### Properties

* [antiClockwise](_paths_arc_.arc.md#anticlockwise)
* [cX](_paths_arc_.arc.md#cx)
* [cY](_paths_arc_.arc.md#cy)
* [endAngle](_paths_arc_.arc.md#endangle)
* [radius](_paths_arc_.arc.md#radius)
* [startAngle](_paths_arc_.arc.md#startangle)

### Methods

* [traceIn](_paths_arc_.arc.md#tracein)

## Constructors

###  constructor

\+ **new Arc**(`config`: object): *[Arc](_paths_arc_.arc.md)*

*Defined in [paths/Arc.ts:9](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/Arc.ts#L9)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`a` | number |
`a2` | number |
`at` | [Point2D](../modules/_types_sol_.md#point2d) |
`r` | number |

**Returns:** *[Arc](_paths_arc_.arc.md)*

## Properties

###  antiClockwise

• **antiClockwise**: *boolean*

*Defined in [paths/Arc.ts:9](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/Arc.ts#L9)*

___

###  cX

• **cX**: *number*

*Defined in [paths/Arc.ts:4](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/Arc.ts#L4)*

___

###  cY

• **cY**: *number*

*Defined in [paths/Arc.ts:5](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/Arc.ts#L5)*

___

###  endAngle

• **endAngle**: *number*

*Defined in [paths/Arc.ts:8](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/Arc.ts#L8)*

___

###  radius

• **radius**: *number*

*Defined in [paths/Arc.ts:6](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/Arc.ts#L6)*

___

###  startAngle

• **startAngle**: *number*

*Defined in [paths/Arc.ts:7](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/Arc.ts#L7)*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_paths_index_.traceable.md)*

*Defined in [paths/Arc.ts:25](https://github.com/jamesporter/solandra/blob/0b8a323/src/lib/paths/Arc.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*