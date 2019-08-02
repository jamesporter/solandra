> **[solandra](../README.md)**

[Globals](../README.md) / ["path"](../modules/_path_.md) / [HollowArc](_path_.hollowarc.md) /

# Class: HollowArc

## Hierarchy

* **HollowArc**

## Implements

* [Traceable](../interfaces/_path_.traceable.md)

## Index

### Constructors

* [constructor](_path_.hollowarc.md#constructor)

### Properties

* [antiClockwise](_path_.hollowarc.md#anticlockwise)
* [cX](_path_.hollowarc.md#cx)
* [cY](_path_.hollowarc.md#cy)
* [endAngle](_path_.hollowarc.md#endangle)
* [innerRadius](_path_.hollowarc.md#innerradius)
* [radius](_path_.hollowarc.md#radius)
* [startAngle](_path_.hollowarc.md#startangle)

### Methods

* [traceIn](_path_.hollowarc.md#tracein)

## Constructors

###  constructor

\+ **new HollowArc**(`config`: object): *[HollowArc](_path_.hollowarc.md)*

*Defined in [path.ts:239](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L239)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`a` | number |
`a2` | number |
`at` | [Point2D](../modules/_types_play_.md#point2d) |
`r` | number |
`r2` | number |

**Returns:** *[HollowArc](_path_.hollowarc.md)*

## Properties

###  antiClockwise

• **antiClockwise**: *boolean*

*Defined in [path.ts:239](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L239)*

___

###  cX

• **cX**: *number*

*Defined in [path.ts:233](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L233)*

___

###  cY

• **cY**: *number*

*Defined in [path.ts:234](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L234)*

___

###  endAngle

• **endAngle**: *number*

*Defined in [path.ts:238](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L238)*

___

###  innerRadius

• **innerRadius**: *number*

*Defined in [path.ts:236](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L236)*

___

###  radius

• **radius**: *number*

*Defined in [path.ts:235](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L235)*

___

###  startAngle

• **startAngle**: *number*

*Defined in [path.ts:237](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L237)*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:265](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L265)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*