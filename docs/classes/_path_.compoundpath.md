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

*Defined in [path.ts:211](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L211)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*

___

### `Static` withPaths

▸ **withPaths**(...`paths`: [Traceable](../interfaces/_path_.traceable.md)[]): *[CompoundPath](_path_.compoundpath.md)*

*Defined in [path.ts:207](https://github.com/jamesporter/solandra/blob/18f919a/src/lib/path.ts#L207)*

**Parameters:**

Name | Type |
------ | ------ |
`...paths` | [Traceable](../interfaces/_path_.traceable.md)[] |

**Returns:** *[CompoundPath](_path_.compoundpath.md)*