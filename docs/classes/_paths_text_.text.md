> **[solandra](../README.md)**

[Globals](../README.md) / ["paths/Text"](../modules/_paths_text_.md) / [Text](_paths_text_.text.md) /

# Class: Text

## Hierarchy

* **Text**

## Implements

* [Textable](../interfaces/_paths_index_.textable.md)

## Index

### Constructors

* [constructor](_paths_text_.text.md#constructor)

### Methods

* [textIn](_paths_text_.text.md#textin)

## Constructors

###  constructor

\+ **new Text**(`config`: [TextConfigWithKind](../modules/_paths_text_.md#textconfigwithkind), `text`: string): *[Text](_paths_text_.text.md)*

*Defined in [paths/Text.ts:50](https://github.com/jamesporter/solandra/blob/544e3ee/src/lib/paths/Text.ts#L50)*

Text is always vertically aligned
By default is fixed (specified vertcial font size) but can choose fitted, then will fit horizontally to size

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | [TextConfigWithKind](../modules/_paths_text_.md#textconfigwithkind) | Configuration  |
`text` | string | - |

**Returns:** *[Text](_paths_text_.text.md)*

## Methods

###  textIn

▸ **textIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Textable](../interfaces/_paths_index_.textable.md)*

*Defined in [paths/Text.ts:58](https://github.com/jamesporter/solandra/blob/544e3ee/src/lib/paths/Text.ts#L58)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*