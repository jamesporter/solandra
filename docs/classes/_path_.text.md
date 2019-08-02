> **[solandra](../README.md)**

[Globals](../README.md) / ["path"](../modules/_path_.md) / [Text](_path_.text.md) /

# Class: Text

## Hierarchy

* **Text**

## Implements

* [Textable](../interfaces/_path_.textable.md)

## Index

### Constructors

* [constructor](_path_.text.md#constructor)

### Methods

* [textIn](_path_.text.md#textin)

## Constructors

###  constructor

\+ **new Text**(`config`: [TextConfigWithKind](../modules/_path_.md#textconfigwithkind), `text`: string): *[Text](_path_.text.md)*

*Defined in [path.ts:678](https://github.com/jamesporter/solandra/blob/57eddd7/src/lib/path.ts#L678)*

Text is always vertically aligned
By default is fixed (specified vertcial font size) but can choose fitted, then will fit horizontally to size

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | [TextConfigWithKind](../modules/_path_.md#textconfigwithkind) | Configuration  |
`text` | string | - |

**Returns:** *[Text](_path_.text.md)*

## Methods

###  textIn

▸ **textIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Textable](../interfaces/_path_.textable.md)*

*Defined in [path.ts:686](https://github.com/jamesporter/solandra/blob/57eddd7/src/lib/path.ts#L686)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*