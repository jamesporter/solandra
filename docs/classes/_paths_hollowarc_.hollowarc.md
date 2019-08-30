> **[solandra](../README.md)**

[Globals](../README.md) / ["paths/HollowArc"](../modules/_paths_hollowarc_.md) / [HollowArc](_paths_hollowarc_.hollowarc.md) /

# Class: HollowArc

## Hierarchy

* **HollowArc**

## Implements

* [Traceable](../interfaces/_paths_index_.traceable.md)

## Index

### Constructors

* [constructor](_paths_hollowarc_.hollowarc.md#constructor)

### Properties

* [antiClockwise](_paths_hollowarc_.hollowarc.md#anticlockwise)
* [cX](_paths_hollowarc_.hollowarc.md#cx)
* [cY](_paths_hollowarc_.hollowarc.md#cy)
* [endAngle](_paths_hollowarc_.hollowarc.md#endangle)
* [innerRadius](_paths_hollowarc_.hollowarc.md#innerradius)
* [radius](_paths_hollowarc_.hollowarc.md#radius)
* [startAngle](_paths_hollowarc_.hollowarc.md#startangle)

### Methods

* [traceIn](_paths_hollowarc_.hollowarc.md#tracein)

## Constructors

###  constructor

\+ **new HollowArc**(`config`: object): *[HollowArc](_paths_hollowarc_.hollowarc.md)*

*Defined in [paths/HollowArc.ts:10](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/HollowArc.ts#L10)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`a` | number |
`a2` | number |
`at` | [Point2D](../modules/_types_sol_.md#point2d) |
`r` | number |
`r2` | number |

**Returns:** *[HollowArc](_paths_hollowarc_.hollowarc.md)*

## Properties

###  antiClockwise

• **antiClockwise**: *boolean*

*Defined in [paths/HollowArc.ts:10](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/HollowArc.ts#L10)*

___

###  cX

• **cX**: *number*

*Defined in [paths/HollowArc.ts:4](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/HollowArc.ts#L4)*

___

###  cY

• **cY**: *number*

*Defined in [paths/HollowArc.ts:5](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/HollowArc.ts#L5)*

___

###  endAngle

• **endAngle**: *number*

*Defined in [paths/HollowArc.ts:9](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/HollowArc.ts#L9)*

___

###  innerRadius

• **innerRadius**: *number*

*Defined in [paths/HollowArc.ts:7](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/HollowArc.ts#L7)*

___

###  radius

• **radius**: *number*

*Defined in [paths/HollowArc.ts:6](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/HollowArc.ts#L6)*

___

###  startAngle

• **startAngle**: *number*

*Defined in [paths/HollowArc.ts:8](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/HollowArc.ts#L8)*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_paths_index_.traceable.md)*

*Defined in [paths/HollowArc.ts:34](https://github.com/jamesporter/solandra/blob/02e2cc9/src/lib/paths/HollowArc.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*