> **[solandra](../README.md)**

[Globals](../README.md) / ["sCanvas"](../modules/_scanvas_.md) / [SCanvas](_scanvas_.scanvas.md) /

# Class: SCanvas

## Hierarchy

* **SCanvas**

## Index

### Constructors

* [constructor](_scanvas_.scanvas.md#constructor)

### Properties

* [aspectRatio](_scanvas_.scanvas.md#aspectratio)
* [ctx](_scanvas_.scanvas.md#private-ctx)
* [originalScale](_scanvas_.scanvas.md#originalscale)
* [rng](_scanvas_.scanvas.md#rng)
* [t](_scanvas_.scanvas.md#t)

### Accessors

* [lineStyle](_scanvas_.scanvas.md#linestyle)
* [lineWidth](_scanvas_.scanvas.md#linewidth)
* [meta](_scanvas_.scanvas.md#meta)
* [randomPoint](_scanvas_.scanvas.md#randompoint)

### Methods

* [aroundCircle](_scanvas_.scanvas.md#aroundcircle)
* [background](_scanvas_.scanvas.md#background)
* [backgroundGradient](_scanvas_.scanvas.md#backgroundgradient)
* [build](_scanvas_.scanvas.md#build)
* [doProportion](_scanvas_.scanvas.md#doproportion)
* [draw](_scanvas_.scanvas.md#draw)
* [drawLine](_scanvas_.scanvas.md#drawline)
* [drawText](_scanvas_.scanvas.md#drawtext)
* [fill](_scanvas_.scanvas.md#fill)
* [fillText](_scanvas_.scanvas.md#filltext)
* [forHorizontal](_scanvas_.scanvas.md#forhorizontal)
* [forTiling](_scanvas_.scanvas.md#fortiling)
* [forVertical](_scanvas_.scanvas.md#forvertical)
* [gaussian](_scanvas_.scanvas.md#gaussian)
* [inDrawing](_scanvas_.scanvas.md#indrawing)
* [perturb](_scanvas_.scanvas.md#perturb)
* [poisson](_scanvas_.scanvas.md#poisson)
* [popState](_scanvas_.scanvas.md#private-popstate)
* [proportionately](_scanvas_.scanvas.md#proportionately)
* [pushState](_scanvas_.scanvas.md#private-pushstate)
* [random](_scanvas_.scanvas.md#random)
* [randomPolarity](_scanvas_.scanvas.md#randompolarity)
* [range](_scanvas_.scanvas.md#range)
* [sample](_scanvas_.scanvas.md#sample)
* [samples](_scanvas_.scanvas.md#samples)
* [setFillColour](_scanvas_.scanvas.md#setfillcolour)
* [setFillGradient](_scanvas_.scanvas.md#setfillgradient)
* [setStrokeColour](_scanvas_.scanvas.md#setstrokecolour)
* [setStrokeGradient](_scanvas_.scanvas.md#setstrokegradient)
* [shuffle](_scanvas_.scanvas.md#shuffle)
* [times](_scanvas_.scanvas.md#times)
* [uniformRandomInt](_scanvas_.scanvas.md#uniformrandomint)
* [withClipping](_scanvas_.scanvas.md#withclipping)
* [withContext](_scanvas_.scanvas.md#withcontext)
* [withRandomOrder](_scanvas_.scanvas.md#withrandomorder)
* [withRotation](_scanvas_.scanvas.md#withrotation)
* [withScale](_scanvas_.scanvas.md#withscale)
* [withTransform](_scanvas_.scanvas.md#withtransform)
* [withTranslation](_scanvas_.scanvas.md#withtranslation)

## Constructors

###  constructor

\+ **new SCanvas**(`ctx`: `CanvasRenderingContext2D`, `__namedParameters`: object, `rngSeed?`: string | number, `time?`: undefined | number): *[SCanvas](_scanvas_.scanvas.md)*

*Defined in [sCanvas.ts:14](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L14)*

**Parameters:**

▪ **ctx**: *`CanvasRenderingContext2D`*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`height` | number |
`width` | number |

▪`Optional`  **rngSeed**: *string | number*

▪`Optional`  **time**: *undefined | number*

**Returns:** *[SCanvas](_scanvas_.scanvas.md)*

## Properties

###  aspectRatio

• **aspectRatio**: *number*

*Defined in [sCanvas.ts:11](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L11)*

___

### `Private` ctx

• **ctx**: *`CanvasRenderingContext2D`*

*Defined in [sCanvas.ts:17](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L17)*

___

###  originalScale

• **originalScale**: *number*

*Defined in [sCanvas.ts:12](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L12)*

___

###  rng

• **rng**: *`Prando`*

*Defined in [sCanvas.ts:13](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L13)*

___

###  t

• **t**: *number*

*Defined in [sCanvas.ts:14](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L14)*

## Accessors

###  lineStyle

• **set lineStyle**(`__namedParameters`: object): *void*

*Defined in [sCanvas.ts:56](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L56)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`cap` | "round" \| "butt" \| "square" | "round" |

**Returns:** *void*

___

###  lineWidth

• **set lineWidth**(`width`: number): *void*

*Defined in [sCanvas.ts:52](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |

**Returns:** *void*

___

###  meta

• **get meta**(): *object*

*Defined in [sCanvas.ts:41](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L41)*

**Returns:** *object*

* **aspectRatio**: *number* =  this.aspectRatio

* **bottom**: *number* =  1 / this.aspectRatio

* **center**: *[number, number]* =  [0.5, 0.5 / this.aspectRatio] as [number, number]

* **left**: *number* = 0

* **right**: *number* = 1

* **top**: *number* = 0

___

###  randomPoint

• **get randomPoint**(): *[Point2D](../modules/_types_play_.md#point2d)*

*Defined in [sCanvas.ts:300](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L300)*

**Returns:** *[Point2D](../modules/_types_play_.md#point2d)*

## Methods

###  aroundCircle

▸ **aroundCircle**(`config`: object, `callback`: function): *void*

*Defined in [sCanvas.ts:258](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L258)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`at?` | [Point2D](../modules/_types_play_.md#point2d) |
`n` | number |
`radius?` | undefined \| number |

▪ **callback**: *function*

▸ (`point`: [Point2D](../modules/_types_play_.md#point2d), `i`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_play_.md#point2d) |
`i` | number |

**Returns:** *void*

___

###  background

▸ **background**(`h`: number, `s`: number, `l`: number, `a`: number): *void*

*Defined in [sCanvas.ts:60](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L60)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`h` | number | - |
`s` | number | - |
`l` | number | - |
`a` | number | 1 |

**Returns:** *void*

___

###  backgroundGradient

▸ **backgroundGradient**(`gradient`: [Gradientable](../interfaces/_scanvas_.gradientable.md)): *void*

*Defined in [sCanvas.ts:66](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L66)*

**Parameters:**

Name | Type |
------ | ------ |
`gradient` | [Gradientable](../interfaces/_scanvas_.gradientable.md) |

**Returns:** *void*

___

###  build

▸ **build**<**C**, **T**, **U**>(`iterFn`: function, `config`: `C`, `cb`: function): *`U`[]*

*Defined in [sCanvas.ts:215](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L215)*

**Type parameters:**

▪ **C**

▪ **T**: *any[]*

▪ **U**

**Parameters:**

▪ **iterFn**: *function*

▸ (`config`: `C`, `callback`: function): *void*

**Parameters:**

▪ **config**: *`C`*

▪ **callback**: *function*

▸ (...`args`: `T`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | `T` |

▪ **config**: *`C`*

▪ **cb**: *function*

▸ (...`args`: `T`): *`U`*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | `T` |

**Returns:** *`U`[]*

___

###  doProportion

▸ **doProportion**(`p`: number, `callback`: function): *void*

*Defined in [sCanvas.ts:246](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L246)*

**Parameters:**

▪ **p**: *number*

▪ **callback**: *function*

▸ (): *void*

**Returns:** *void*

___

###  draw

▸ **draw**(`traceable`: [Traceable](../interfaces/_path_.traceable.md)): *void*

*Defined in [sCanvas.ts:96](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L96)*

**Parameters:**

Name | Type |
------ | ------ |
`traceable` | [Traceable](../interfaces/_path_.traceable.md) |

**Returns:** *void*

___

###  drawLine

▸ **drawLine**(`from`: [Point2D](../modules/_types_play_.md#point2d), `to`: [Point2D](../modules/_types_play_.md#point2d)): *void*

*Defined in [sCanvas.ts:89](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L89)*

**Parameters:**

Name | Type |
------ | ------ |
`from` | [Point2D](../modules/_types_play_.md#point2d) |
`to` | [Point2D](../modules/_types_play_.md#point2d) |

**Returns:** *void*

___

###  drawText

▸ **drawText**(`config`: [TextConfig](../modules/_path_.md#textconfig), `text`: string): *void*

*Defined in [sCanvas.ts:108](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L108)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | [TextConfig](../modules/_path_.md#textconfig) |
`text` | string |

**Returns:** *void*

___

###  fill

▸ **fill**(`traceable`: [Traceable](../interfaces/_path_.traceable.md)): *void*

*Defined in [sCanvas.ts:102](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L102)*

**Parameters:**

Name | Type |
------ | ------ |
`traceable` | [Traceable](../interfaces/_path_.traceable.md) |

**Returns:** *void*

___

###  fillText

▸ **fillText**(`config`: [TextConfig](../modules/_path_.md#textconfig), `text`: string): *void*

*Defined in [sCanvas.ts:112](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L112)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | [TextConfig](../modules/_path_.md#textconfig) |
`text` | string |

**Returns:** *void*

___

###  forHorizontal

▸ **forHorizontal**(`config`: object, `callback`: function): *void*

*Defined in [sCanvas.ts:150](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L150)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`margin?` | undefined \| number |
`n` | number |

▪ **callback**: *function*

▸ (`point`: [Point2D](../modules/_types_play_.md#point2d), `delta`: [Vector2D](../modules/_types_play_.md#vector2d), `center`: [Point2D](../modules/_types_play_.md#point2d), `i`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_play_.md#point2d) |
`delta` | [Vector2D](../modules/_types_play_.md#vector2d) |
`center` | [Point2D](../modules/_types_play_.md#point2d) |
`i` | number |

**Returns:** *void*

___

###  forTiling

▸ **forTiling**(`config`: object, `callback`: function): *void*

*Defined in [sCanvas.ts:116](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L116)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`margin?` | undefined \| number |
`n` | number |
`type?` | "square" \| "proportionate" |

▪ **callback**: *function*

▸ (`point`: [Point2D](../modules/_types_play_.md#point2d), `delta`: [Vector2D](../modules/_types_play_.md#vector2d), `center`: [Point2D](../modules/_types_play_.md#point2d), `i`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_play_.md#point2d) |
`delta` | [Vector2D](../modules/_types_play_.md#vector2d) |
`center` | [Point2D](../modules/_types_play_.md#point2d) |
`i` | number |

**Returns:** *void*

___

###  forVertical

▸ **forVertical**(`config`: object, `callback`: function): *void*

*Defined in [sCanvas.ts:180](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L180)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`margin?` | undefined \| number |
`n` | number |

▪ **callback**: *function*

▸ (`point`: [Point2D](../modules/_types_play_.md#point2d), `delta`: [Vector2D](../modules/_types_play_.md#vector2d), `center`: [Point2D](../modules/_types_play_.md#point2d), `i`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_play_.md#point2d) |
`delta` | [Vector2D](../modules/_types_play_.md#vector2d) |
`center` | [Point2D](../modules/_types_play_.md#point2d) |
`i` | number |

**Returns:** *void*

___

###  gaussian

▸ **gaussian**(`config?`: undefined | object): *number*

*Defined in [sCanvas.ts:476](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L476)*

Gaussian random number, default mean 0, default standard deviation 1

**Parameters:**

Name | Type |
------ | ------ |
`config?` | undefined \| object |

**Returns:** *number*

___

###  inDrawing

▸ **inDrawing**(`point`: [Point2D](../modules/_types_play_.md#point2d)): *boolean*

*Defined in [sCanvas.ts:317](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L317)*

**Parameters:**

Name | Type |
------ | ------ |
`point` | [Point2D](../modules/_types_play_.md#point2d) |

**Returns:** *boolean*

___

###  perturb

▸ **perturb**(`__namedParameters`: [number, number], `config`: object): *[Point2D](../modules/_types_play_.md#point2d)*

*Defined in [sCanvas.ts:465](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L465)*

Perturb a point by a random amount (by default uniform random changes in
-0.05 to 0.05, optional magnitude scales this e.g. magnitude 1 is perturbations
of -0.5 to 0.5)

**Parameters:**

▪ **__namedParameters**: *[number, number]*

▪`Default value`  **config**: *object*=  {}

Name | Type |
------ | ------ |
`magnitude?` | undefined \| number |

**Returns:** *[Point2D](../modules/_types_play_.md#point2d)*

___

###  poisson

▸ **poisson**(`lambda`: number): *number*

*Defined in [sCanvas.ts:487](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L487)*

Poisson random number, lambda (the mean and variance) is only parameter

**Parameters:**

Name | Type |
------ | ------ |
`lambda` | number |

**Returns:** *number*

___

### `Private` popState

▸ **popState**(): *void*

*Defined in [sCanvas.ts:330](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L330)*

**Returns:** *void*

___

###  proportionately

▸ **proportionately**<**T**>(`cases`: [number, function][]): *`T`*

*Defined in [sCanvas.ts:284](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L284)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`cases` | [number, function][] |

**Returns:** *`T`*

___

### `Private` pushState

▸ **pushState**(): *void*

*Defined in [sCanvas.ts:326](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L326)*

**Returns:** *void*

___

###  random

▸ **random**(): *number*

*Defined in [sCanvas.ts:396](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L396)*

A uniform random number betweeon 0 and 1

**Returns:** *number*

___

###  randomPolarity

▸ **randomPolarity**(): *`1` | `-1`*

*Defined in [sCanvas.ts:417](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L417)*

A coin toss with result either -1 or 1

**Returns:** *`1` | `-1`*

___

###  range

▸ **range**(`config`: object, `callback`: function): *void*

*Defined in [sCanvas.ts:304](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L304)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`from` | number |
`inclusive?` | undefined \| false \| true |
`n` | number |
`to` | number |

▪ **callback**: *function*

▸ (`n`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |

**Returns:** *void*

___

###  sample

▸ **sample**<**T**>(`from`: `T`[]): *`T`*

*Defined in [sCanvas.ts:424](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L424)*

Sample uniformly from an array

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`from` | `T`[] |

**Returns:** *`T`*

___

###  samples

▸ **samples**<**T**>(`n`: number, `from`: `T`[]): *`T`[]*

*Defined in [sCanvas.ts:431](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L431)*

n uniform samples from an array

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |
`from` | `T`[] |

**Returns:** *`T`[]*

___

###  setFillColour

▸ **setFillColour**(`h`: number, `s`: number, `l`: number, `a`: number): *void*

*Defined in [sCanvas.ts:76](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L76)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`h` | number | - |
`s` | number | - |
`l` | number | - |
`a` | number | 1 |

**Returns:** *void*

___

###  setFillGradient

▸ **setFillGradient**(`gradient`: [Gradientable](../interfaces/_scanvas_.gradientable.md)): *void*

*Defined in [sCanvas.ts:84](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L84)*

**Parameters:**

Name | Type |
------ | ------ |
`gradient` | [Gradientable](../interfaces/_scanvas_.gradientable.md) |

**Returns:** *void*

___

###  setStrokeColour

▸ **setStrokeColour**(`h`: number, `s`: number, `l`: number, `a`: number): *void*

*Defined in [sCanvas.ts:72](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L72)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`h` | number | - |
`s` | number | - |
`l` | number | - |
`a` | number | 1 |

**Returns:** *void*

___

###  setStrokeGradient

▸ **setStrokeGradient**(`gradient`: [Gradientable](../interfaces/_scanvas_.gradientable.md)): *void*

*Defined in [sCanvas.ts:80](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L80)*

**Parameters:**

Name | Type |
------ | ------ |
`gradient` | [Gradientable](../interfaces/_scanvas_.gradientable.md) |

**Returns:** *void*

___

###  shuffle

▸ **shuffle**<**T**>(`items`: `T`[]): *`T`[]*

*Defined in [sCanvas.ts:442](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L442)*

Shuffle an array

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`items` | `T`[] |

**Returns:** *`T`[]*

___

###  times

▸ **times**(`n`: number, `callback`: function): *void*

*Defined in [sCanvas.ts:252](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L252)*

**Parameters:**

▪ **n**: *number*

▪ **callback**: *function*

▸ (`n`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |

**Returns:** *void*

___

###  uniformRandomInt

▸ **uniformRandomInt**(`config`: object): *number*

*Defined in [sCanvas.ts:404](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L404)*

A uniform random integer. Default lower bound is 0.
Upper bound can be inclusive (default) or exclusive

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`from?` | undefined \| number |
`inclusive?` | undefined \| false \| true |
`to` | number |

**Returns:** *number*

___

###  withClipping

▸ **withClipping**(`clipArea`: [Traceable](../interfaces/_path_.traceable.md), `callback`: function): *void*

*Defined in [sCanvas.ts:334](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L334)*

**Parameters:**

▪ **clipArea**: *[Traceable](../interfaces/_path_.traceable.md)*

▪ **callback**: *function*

▸ (): *void*

**Returns:** *void*

___

###  withContext

▸ **withContext**(`callback`: function): *void*

*Defined in [sCanvas.ts:346](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L346)*

Within a context all style/colour changes are local.

**Parameters:**

▪ **callback**: *function*

▸ (): *void*

**Returns:** *void*

___

###  withRandomOrder

▸ **withRandomOrder**<**C**, **T**>(`iterFn`: function, `config`: `C`, `cb`: function): *void*

*Defined in [sCanvas.ts:230](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L230)*

**Type parameters:**

▪ **C**

▪ **T**: *any[]*

**Parameters:**

▪ **iterFn**: *function*

▸ (`config`: `C`, `callback`: function): *void*

**Parameters:**

▪ **config**: *`C`*

▪ **callback**: *function*

▸ (...`args`: `T`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | `T` |

▪ **config**: *`C`*

▪ **cb**: *function*

▸ (...`args`: `T`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | `T` |

**Returns:** *void*

___

###  withRotation

▸ **withRotation**(`angle`: number, `callback`: function): *void*

*Defined in [sCanvas.ts:352](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L352)*

**Parameters:**

▪ **angle**: *number*

▪ **callback**: *function*

▸ (): *void*

**Returns:** *void*

___

###  withScale

▸ **withScale**(`scale`: [Vector2D](../modules/_types_play_.md#vector2d), `callback`: function): *void*

*Defined in [sCanvas.ts:359](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L359)*

**Parameters:**

▪ **scale**: *[Vector2D](../modules/_types_play_.md#vector2d)*

▪ **callback**: *function*

▸ (): *void*

**Returns:** *void*

___

###  withTransform

▸ **withTransform**(`config`: object, `callback`: function): *void*

*Defined in [sCanvas.ts:373](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L373)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`dX` | number |
`dY` | number |
`hScale` | number |
`hskew` | number |
`vScaling` | number |
`vSkew` | number |

▪ **callback**: *function*

▸ (): *void*

**Returns:** *void*

___

###  withTranslation

▸ **withTranslation**(`translation`: [Vector2D](../modules/_types_play_.md#vector2d), `callback`: function): *void*

*Defined in [sCanvas.ts:366](https://github.com/jamesporter/solandra/blob/0595850/src/lib/sCanvas.ts#L366)*

**Parameters:**

▪ **translation**: *[Vector2D](../modules/_types_play_.md#vector2d)*

▪ **callback**: *function*

▸ (): *void*

**Returns:** *void*