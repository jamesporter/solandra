> **[solandra](../README.md)**

[Globals](../README.md) / ["path"](../modules/_path_.md) / [Star](_path_.star.md) /

# Class: Star

## Hierarchy

* **Star**

## Implements

* [Traceable](../interfaces/_path_.traceable.md)

## Index

### Constructors

* [constructor](_path_.star.md#constructor)

### Accessors

* [path](_path_.star.md#path)

### Methods

* [traceIn](_path_.star.md#tracein)

## Constructors

###  constructor

\+ **new Star**(`config`: object): *[Star](_path_.star.md)*

*Defined in [path.ts:829](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L829)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`a?` | undefined \| number |
`at` | [Point2D](../modules/_types_sol_.md#point2d) |
`n` | number |
`r` | number |
`r2?` | undefined \| number |

**Returns:** *[Star](_path_.star.md)*

## Accessors

###  path

• **get path**(): *[SimplePath](_path_.simplepath.md)*

*Defined in [path.ts:875](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L875)*

**Returns:** *[SimplePath](_path_.simplepath.md)*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:845](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L845)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*