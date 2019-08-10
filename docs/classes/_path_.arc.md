> **[solandra](../README.md)**

[Globals](../README.md) / ["path"](../modules/_path_.md) / [Arc](_path_.arc.md) /

# Class: Arc

## Hierarchy

* **Arc**

## Implements

* [Traceable](../interfaces/_path_.traceable.md)

## Index

### Constructors

* [constructor](_path_.arc.md#constructor)

### Properties

* [antiClockwise](_path_.arc.md#anticlockwise)
* [cX](_path_.arc.md#cx)
* [cY](_path_.arc.md#cy)
* [endAngle](_path_.arc.md#endangle)
* [radius](_path_.arc.md#radius)
* [startAngle](_path_.arc.md#startangle)

### Methods

* [traceIn](_path_.arc.md#tracein)

## Constructors

###  constructor

\+ **new Arc**(`config`: object): *[Arc](_path_.arc.md)*

*Defined in [path.ts:222](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L222)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`a` | number |
`a2` | number |
`at` | [Point2D](../modules/_types_sol_.md#point2d) |
`r` | number |

**Returns:** *[Arc](_path_.arc.md)*

## Properties

###  antiClockwise

• **antiClockwise**: *boolean*

*Defined in [path.ts:222](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L222)*

___

###  cX

• **cX**: *number*

*Defined in [path.ts:217](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L217)*

___

###  cY

• **cY**: *number*

*Defined in [path.ts:218](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L218)*

___

###  endAngle

• **endAngle**: *number*

*Defined in [path.ts:221](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L221)*

___

###  radius

• **radius**: *number*

*Defined in [path.ts:219](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L219)*

___

###  startAngle

• **startAngle**: *number*

*Defined in [path.ts:220](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L220)*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:240](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L240)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*