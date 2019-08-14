> **[solandra](../README.md)**

[Globals](../README.md) / ["path"](../modules/_path_.md) / [CompoundPath](_path_.compoundpath.md) /

# Class: CompoundPath

## Hierarchy

* **CompoundPath**

## Implements

* [Traceable](../interfaces/_path_.traceable.md)

## Index

### Methods

* [traceIn](_path_.compoundpath.md#tracein)
* [withPaths](_path_.compoundpath.md#static-withpaths)

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_path_.traceable.md)*

*Defined in [path.ts:446](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L446)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*

___

### `Static` withPaths

▸ **withPaths**(...`paths`: [Traceable](../interfaces/_path_.traceable.md)[]): *[CompoundPath](_path_.compoundpath.md)*

*Defined in [path.ts:442](https://github.com/jamesporter/solandra/blob/a654911/src/lib/path.ts#L442)*

**Parameters:**

Name | Type |
------ | ------ |
`...paths` | [Traceable](../interfaces/_path_.traceable.md)[] |

**Returns:** *[CompoundPath](_path_.compoundpath.md)*