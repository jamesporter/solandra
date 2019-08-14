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

*Defined in [path.ts:498](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L498)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`a` | number |
`a2` | number |
`at` | [Point2D](../modules/_types_sol_.md#point2d) |
`r` | number |
`r2` | number |

**Returns:** *[HollowArc](_path_.hollowarc.md)*

## Properties

###  antiClockwise

• **antiClockwise**: *boolean*

*Defined in [path.ts:498](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L498)*

___

###  cX

• **cX**: *number*

*Defined in [path.ts:492](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L492)*

___

###  cY

• **cY**: *number*

*Defined in [path.ts:493](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L493)*

___

###  endAngle

• **endAngle**: *number*

*Defined in [path.ts:497](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L497)*

___

###  innerRadius

• **innerRadius**: *number*

*Defined in [path.ts:495](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L495)*

___

###  radius

• **radius**: *number*

*Defined in [path.ts:494](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L494)*

___

###  startAngle

• **startAngle**: *number*

*Defined in [path.ts:496](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L496)*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:524](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L524)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*