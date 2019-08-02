> **[solandra](../README.md)**

[Globals](../README.md) / ["types/sol"](_types_sol_.md) /

# External module: "types/sol"

## Index

### Type aliases

* [Message](_types_sol_.md#message)
* [Point2D](_types_sol_.md#point2d)
* [Size](_types_sol_.md#size)
* [Sketch](_types_sol_.md#sketch)
* [StatefulSketch](_types_sol_.md#statefulsketch)
* [Vector2D](_types_sol_.md#vector2d)

## Type aliases

###  Message

Ƭ **Message**: *object*

*Defined in [types/sol.ts:7](https://github.com/jamesporter/solandra/blob/9c7ec25/src/lib/types/sol.ts#L7)*

#### Type declaration:

* **at**: *[Point2D](_types_sol_.md#point2d)*

* **type**: *"click"*

___

###  Point2D

Ƭ **Point2D**: *[number, number]*

*Defined in [types/sol.ts:21](https://github.com/jamesporter/solandra/blob/9c7ec25/src/lib/types/sol.ts#L21)*

___

###  Size

Ƭ **Size**: *object*

*Defined in [types/sol.ts:19](https://github.com/jamesporter/solandra/blob/9c7ec25/src/lib/types/sol.ts#L19)*

#### Type declaration:

* **height**: *number*

* **width**: *number*

___

###  Sketch

Ƭ **Sketch**: *function*

*Defined in [types/sol.ts:3](https://github.com/jamesporter/solandra/blob/9c7ec25/src/lib/types/sol.ts#L3)*

#### Type declaration:

▸ (`play`: [SCanvas](../classes/_scanvas_.scanvas.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`play` | [SCanvas](../classes/_scanvas_.scanvas.md) |

___

###  StatefulSketch

Ƭ **StatefulSketch**: *object*

*Defined in [types/sol.ts:12](https://github.com/jamesporter/solandra/blob/9c7ec25/src/lib/types/sol.ts#L12)*

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

*Defined in [types/sol.ts:22](https://github.com/jamesporter/solandra/blob/9c7ec25/src/lib/types/sol.ts#L22)*