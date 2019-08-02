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

*Defined in [path.ts:198](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L198)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`a` | number |
`a2` | number |
`at` | [Point2D](../modules/_types_play_.md#point2d) |
`r` | number |

**Returns:** *[Arc](_path_.arc.md)*

## Properties

###  antiClockwise

• **antiClockwise**: *boolean*

*Defined in [path.ts:198](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L198)*

___

###  cX

• **cX**: *number*

*Defined in [path.ts:193](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L193)*

___

###  cY

• **cY**: *number*

*Defined in [path.ts:194](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L194)*

___

###  endAngle

• **endAngle**: *number*

*Defined in [path.ts:197](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L197)*

___

###  radius

• **radius**: *number*

*Defined in [path.ts:195](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L195)*

___

###  startAngle

• **startAngle**: *number*

*Defined in [path.ts:196](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L196)*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:216](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L216)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*