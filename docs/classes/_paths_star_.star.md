> **[solandra](../README.md)**

[Globals](../README.md) / ["paths/Star"](../modules/_paths_star_.md) / [Star](_paths_star_.star.md) /

# Class: Star

## Hierarchy

* **Star**

## Implements

* [Traceable](../interfaces/_paths_index_.traceable.md)

## Index

### Constructors

* [constructor](_paths_star_.star.md#constructor)

### Accessors

* [path](_paths_star_.star.md#path)

### Methods

* [traceIn](_paths_star_.star.md#tracein)

## Constructors

###  constructor

\+ **new Star**(`config`: object): *[Star](_paths_star_.star.md)*

*Defined in [paths/Star.ts:4](https://github.com/jamesporter/solandra/blob/544e3ee/src/lib/paths/Star.ts#L4)*

**Parameters:**

▪ **config**: *object*

Name | Type |
------ | ------ |
`a?` | undefined \| number |
`at` | [Point2D](../modules/_types_sol_.md#point2d) |
`n` | number |
`r` | number |
`r2?` | undefined \| number |

**Returns:** *[Star](_paths_star_.star.md)*

## Accessors

###  path

• **get path**(): *[SimplePath](_paths_simplepath_.simplepath.md)*

*Defined in [paths/Star.ts:48](https://github.com/jamesporter/solandra/blob/544e3ee/src/lib/paths/Star.ts#L48)*

**Returns:** *[SimplePath](_paths_simplepath_.simplepath.md)*

## Methods

###  traceIn

▸ **traceIn**(`ctx`: `CanvasRenderingContext2D`): *void*

*Implementation of [Traceable](../interfaces/_paths_index_.traceable.md)*

*Defined in [paths/Star.ts:19](https://github.com/jamesporter/solandra/blob/544e3ee/src/lib/paths/Star.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`ctx` | `CanvasRenderingContext2D` |

**Returns:** *void*