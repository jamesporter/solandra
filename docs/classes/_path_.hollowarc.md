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

*Defined in [path.ts:251](https://github.com/jamesporter/solandra/blob/2971925/src/lib/path.ts#L251)*

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

*Defined in [path.ts:251](https://github.com/jamesporter/solandra/blob/2971925/src/lib/path.ts#L251)*

___

###  cX

• **cX**: *number*

*Defined in [path.ts:245](https://github.com/jamesporter/solandra/blob/2971925/src/lib/path.ts#L245)*

___

###  cY

• **cY**: *number*

*Defined in [path.ts:246](https://github.com/jamesporter/solandra/blob/2971925/src/lib/path.ts#L246)*

___

###  endAngle

• **endAngle**: *number*

*Defined in [path.ts:250](https://github.com/jamesporter/solandra/blob/2971925/src/lib/path.ts#L250)*

___

###  innerRadius

• **innerRadius**: *number*

*Defined in [path.ts:248](https://github.com/jamesporter/solandra/blob/2971925/src/lib/path.ts#L248)*

___

###  radius

• **radius**: *number*

*Defined in [path.ts:247](https://github.com/jamesporter/solandra/blob/2971925/src/lib/path.ts#L247)*

___

###  startAngle

• **startAngle**: *number*

*Defined in [path.ts:249](https://github.com/jamesporter/solandra/blob/2971925/src/lib/path.ts#L249)*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:277](https://github.com/jamesporter/solandra/blob/2971925/src/lib/path.ts#L277)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*