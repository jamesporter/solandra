> **[solandra](../README.md)**

[Globals](../README.md) / ["types/play"](_types_play_.md) /

# External module: "types/play"

## Index

### Type aliases

* [Message](_types_play_.md#message)
* [Point2D](_types_play_.md#point2d)
* [Size](_types_play_.md#size)
* [Sketch](_types_play_.md#sketch)
* [StatefulSketch](_types_play_.md#statefulsketch)
* [Vector2D](_types_play_.md#vector2d)

## Type aliases

###  Message

Ƭ **Message**: *object*

*Defined in [types/play.ts:7](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/types/play.ts#L7)*

#### Type declaration:

* **at**: *[Point2D](_types_play_.md#point2d)*

* **type**: *"click"*

___

###  Point2D

Ƭ **Point2D**: *[number, number]*

*Defined in [types/play.ts:21](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/types/play.ts#L21)*

___

###  Size

Ƭ **Size**: *object*

*Defined in [types/play.ts:19](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/types/play.ts#L19)*

#### Type declaration:

* **height**: *number*

* **width**: *number*

___

###  Sketch

Ƭ **Sketch**: *function*

*Defined in [types/play.ts:3](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/types/play.ts#L3)*

#### Type declaration:

▸ (`play`: [SCanvas](../classes/_scanvas_.scanvas.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`play` | [SCanvas](../classes/_scanvas_.scanvas.md) |

___

###  StatefulSketch

Ƭ **StatefulSketch**: *object*

*Defined in [types/play.ts:12](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/types/play.ts#L12)*

#### Type declaration:

* **handleMessage**? : *undefined | function*

* **initialState**(): *function*

  * (): *`S`*

* **name**: *string*

* **sketch**(): *function*

  * (`p`: [SCanvas](../classes/_scanvas_.scanvas.md), `state`: `S`): *void*

___

###  Vector2D

Ƭ **Vector2D**: *[number, number]*

*Defined in [types/play.ts:22](https://github.com/jamesporter/solandra/blob/50bf90a/src/lib/types/play.ts#L22)*