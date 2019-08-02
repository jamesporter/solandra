> **[solandra](../README.md)**

[Globals](../README.md) / ["path"](_path_.md) /

# External module: "path"

## Index

### Enumerations

* [Font](../enums/_path_.font.md)

### Classes

* [Arc](../classes/_path_.arc.md)
* [Circle](../classes/_path_.circle.md)
* [Ellipse](../classes/_path_.ellipse.md)
* [Hatching](../classes/_path_.hatching.md)
* [HollowArc](../classes/_path_.hollowarc.md)
* [Path](../classes/_path_.path.md)
* [Rect](../classes/_path_.rect.md)
* [RegularPolygon](../classes/_path_.regularpolygon.md)
* [RoundedRect](../classes/_path_.roundedrect.md)
* [SimplePath](../classes/_path_.simplepath.md)
* [Star](../classes/_path_.star.md)
* [Text](../classes/_path_.text.md)

### Interfaces

* [Textable](../interfaces/_path_.textable.md)
* [Traceable](../interfaces/_path_.traceable.md)

### Type aliases

* [CurveConfig](_path_.md#curveconfig)
* [FontStyle](_path_.md#fontstyle)
* [FontVariant](_path_.md#fontvariant)
* [FontWeight](_path_.md#fontweight)
* [PathEdge](_path_.md#pathedge)
* [TextConfig](_path_.md#textconfig)
* [TextConfigWithKind](_path_.md#textconfigwithkind)
* [TextHorizontalAlign](_path_.md#texthorizontalalign)
* [TextSizing](_path_.md#textsizing)

## Type aliases

###  CurveConfig

Ƭ **CurveConfig**: *object*

*Defined in [path.ts:97](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L97)*

#### Type declaration:

* **bulbousness**? : *undefined | number*

* **curveAngle**? : *undefined | number*

* **curveSize**? : *undefined | number*

* **polarlity**? : *`1` | `-1`*

* **twist**? : *undefined | number*

___

###  FontStyle

Ƭ **FontStyle**: *"normal" | "italic" | "oblique"*

*Defined in [path.ts:634](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L634)*

___

###  FontVariant

Ƭ **FontVariant**: *"normal" | "small-caps"*

*Defined in [path.ts:635](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L635)*

___

###  FontWeight

Ƭ **FontWeight**: *"normal" | "bold" | "bolder" | "lighter" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"*

*Defined in [path.ts:636](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L636)*

___

###  PathEdge

Ƭ **PathEdge**: *object | object*

*Defined in [path.ts:87](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L87)*

___

###  TextConfig

Ƭ **TextConfig**: *`Omit<TextConfigWithKind, "kind">`*

*Defined in [path.ts:676](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L676)*

___

###  TextConfigWithKind

Ƭ **TextConfigWithKind**: *object*

*Defined in [path.ts:664](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L664)*

#### Type declaration:

* **align**? : *[TextHorizontalAlign](_path_.md#texthorizontalalign)*

* **at**: *[Point2D](_types_play_.md#point2d)*

* **font**? : *[Font](../enums/_path_.font.md)*

* **kind**: *"fill" | "stroke"*

* **size**: *number*

* **sizing**? : *[TextSizing](_path_.md#textsizing)*

* **style**? : *[FontStyle](_path_.md#fontstyle)*

* **variant**? : *[FontVariant](_path_.md#fontvariant)*

* **weight**? : *[FontWeight](_path_.md#fontweight)*

___

###  TextHorizontalAlign

Ƭ **TextHorizontalAlign**: *"center" | "start" | "end" | "left" | "right"*

*Defined in [path.ts:633](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L633)*

___

###  TextSizing

Ƭ **TextSizing**: *"fixed" | "fitted"*

*Defined in [path.ts:632](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/path.ts#L632)*