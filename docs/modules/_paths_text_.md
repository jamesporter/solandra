> **[solandra](../README.md)**

[Globals](../README.md) / ["paths/Text"](_paths_text_.md) /

# External module: "paths/Text"

## Index

### Enumerations

* [Font](../enums/_paths_text_.font.md)

### Classes

* [Text](../classes/_paths_text_.text.md)

### Type aliases

* [FontStyle](_paths_text_.md#fontstyle)
* [FontVariant](_paths_text_.md#fontvariant)
* [FontWeight](_paths_text_.md#fontweight)
* [TextConfig](_paths_text_.md#textconfig)
* [TextConfigWithKind](_paths_text_.md#textconfigwithkind)
* [TextHorizontalAlign](_paths_text_.md#texthorizontalalign)
* [TextSizing](_paths_text_.md#textsizing)

## Type aliases

###  FontStyle

Ƭ **FontStyle**: *"normal" | "italic" | "oblique"*

*Defined in [paths/Text.ts:6](https://github.com/jamesporter/solandra/blob/511cfc3/src/lib/paths/Text.ts#L6)*

___

###  FontVariant

Ƭ **FontVariant**: *"normal" | "small-caps"*

*Defined in [paths/Text.ts:7](https://github.com/jamesporter/solandra/blob/511cfc3/src/lib/paths/Text.ts#L7)*

___

###  FontWeight

Ƭ **FontWeight**: *"normal" | "bold" | "bolder" | "lighter" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"*

*Defined in [paths/Text.ts:8](https://github.com/jamesporter/solandra/blob/511cfc3/src/lib/paths/Text.ts#L8)*

___

###  TextConfig

Ƭ **TextConfig**: *`Omit<TextConfigWithKind, "kind">`*

*Defined in [paths/Text.ts:48](https://github.com/jamesporter/solandra/blob/511cfc3/src/lib/paths/Text.ts#L48)*

___

###  TextConfigWithKind

Ƭ **TextConfigWithKind**: *object*

*Defined in [paths/Text.ts:36](https://github.com/jamesporter/solandra/blob/511cfc3/src/lib/paths/Text.ts#L36)*

#### Type declaration:

* **align**? : *[TextHorizontalAlign](_paths_text_.md#texthorizontalalign)*

* **at**: *[Point2D](_types_sol_.md#point2d)*

* **font**? : *[Font](../enums/_paths_text_.font.md)*

* **kind**: *"fill" | "stroke"*

* **size**: *number*

* **sizing**? : *[TextSizing](_paths_text_.md#textsizing)*

* **style**? : *[FontStyle](_paths_text_.md#fontstyle)*

* **variant**? : *[FontVariant](_paths_text_.md#fontvariant)*

* **weight**? : *[FontWeight](_paths_text_.md#fontweight)*

___

###  TextHorizontalAlign

Ƭ **TextHorizontalAlign**: *"center" | "start" | "end" | "left" | "right"*

*Defined in [paths/Text.ts:5](https://github.com/jamesporter/solandra/blob/511cfc3/src/lib/paths/Text.ts#L5)*

___

###  TextSizing

Ƭ **TextSizing**: *"fixed" | "fitted"*

*Defined in [paths/Text.ts:4](https://github.com/jamesporter/solandra/blob/511cfc3/src/lib/paths/Text.ts#L4)*