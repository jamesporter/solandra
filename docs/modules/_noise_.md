> **[solandra](../README.md)**

[Globals](../README.md) / ["noise"](_noise_.md) /

# External module: "noise"

## Index

### Variables

* [grad3](_noise_.md#const-grad3)
* [gradP](_noise_.md#const-gradp)
* [p](_noise_.md#p)
* [perm](_noise_.md#const-perm)

### Functions

* [fade](_noise_.md#fade)
* [lerp](_noise_.md#lerp)
* [perlin2](_noise_.md#perlin2)
* [seedNoise](_noise_.md#seednoise)

## Variables

### `Const` grad3

• **grad3**: *number[][]* =  [
  [1, 1, 0],
  [-1, 1, 0],
  [1, -1, 0],
  [-1, -1, 0],
  [1, 0, 1],
  [-1, 0, 1],
  [1, 0, -1],
  [-1, 0, -1],
  [0, 1, 1],
  [0, -1, 1],
  [0, 1, -1],
  [0, -1, -1]
]

*Defined in [noise.ts:13](https://github.com/jamesporter/solandra/blob/a654911/src/lib/noise.ts#L13)*

___

### `Const` gradP

• **gradP**: *any[]* =  new Array(512)

*Defined in [noise.ts:288](https://github.com/jamesporter/solandra/blob/a654911/src/lib/noise.ts#L288)*

___

###  p

• **p**: *number[]* =  [
  151,
  160,
  137,
  91,
  90,
  15,
  131,
  13,
  201,
  95,
  96,
  53,
  194,
  233,
  7,
  225,
  140,
  36,
  103,
  30,
  69,
  142,
  8,
  99,
  37,
  240,
  21,
  10,
  23,
  190,
  6,
  148,
  247,
  120,
  234,
  75,
  0,
  26,
  197,
  62,
  94,
  252,
  219,
  203,
  117,
  35,
  11,
  32,
  57,
  177,
  33,
  88,
  237,
  149,
  56,
  87,
  174,
  20,
  125,
  136,
  171,
  168,
  68,
  175,
  74,
  165,
  71,
  134,
  139,
  48,
  27,
  166,
  77,
  146,
  158,
  231,
  83,
  111,
  229,
  122,
  60,
  211,
  133,
  230,
  220,
  105,
  92,
  41,
  55,
  46,
  245,
  40,
  244,
  102,
  143,
  54,
  65,
  25,
  63,
  161,
  1,
  216,
  80,
  73,
  209,
  76,
  132,
  187,
  208,
  89,
  18,
  169,
  200,
  196,
  135,
  130,
  116,
  188,
  159,
  86,
  164,
  100,
  109,
  198,
  173,
  186,
  3,
  64,
  52,
  217,
  226,
  250,
  124,
  123,
  5,
  202,
  38,
  147,
  118,
  126,
  255,
  82,
  85,
  212,
  207,
  206,
  59,
  227,
  47,
  16,
  58,
  17,
  182,
  189,
  28,
  42,
  223,
  183,
  170,
  213,
  119,
  248,
  152,
  2,
  44,
  154,
  163,
  70,
  221,
  153,
  101,
  155,
  167,
  43,
  172,
  9,
  129,
  22,
  39,
  253,
  19,
  98,
  108,
  110,
  79,
  113,
  224,
  232,
  178,
  185,
  112,
  104,
  218,
  246,
  97,
  228,
  251,
  34,
  242,
  193,
  238,
  210,
  144,
  12,
  191,
  179,
  162,
  241,
  81,
  51,
  145,
  235,
  249,
  14,
  239,
  107,
  49,
  192,
  214,
  31,
  181,
  199,
  106,
  157,
  184,
  84,
  204,
  176,
  115,
  121,
  50,
  45,
  127,
  4,
  150,
  254,
  138,
  236,
  205,
  93,
  222,
  114,
  67,
  29,
  24,
  72,
  243,
  141,
  128,
  195,
  78,
  66,
  215,
  61,
  156,
  180
]

*Defined in [noise.ts:28](https://github.com/jamesporter/solandra/blob/a654911/src/lib/noise.ts#L28)*

___

### `Const` perm

• **perm**: *any[]* =  new Array(512)

*Defined in [noise.ts:287](https://github.com/jamesporter/solandra/blob/a654911/src/lib/noise.ts#L287)*

## Functions

###  fade

▸ **fade**(`t`: number): *number*

*Defined in [noise.ts:5](https://github.com/jamesporter/solandra/blob/a654911/src/lib/noise.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`t` | number |

**Returns:** *number*

___

###  lerp

▸ **lerp**(`a`: number, `b`: number, `t`: number): *number*

*Defined in [noise.ts:9](https://github.com/jamesporter/solandra/blob/a654911/src/lib/noise.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`a` | number |
`b` | number |
`t` | number |

**Returns:** *number*

___

###  perlin2

▸ **perlin2**(`ax`: number, `ay`: number): *number*

*Defined in [noise.ts:315](https://github.com/jamesporter/solandra/blob/a654911/src/lib/noise.ts#L315)*

**Parameters:**

Name | Type |
------ | ------ |
`ax` | number |
`ay` | number |

**Returns:** *number*

___

###  seedNoise

▸ **seedNoise**(`seed`: number): *void*

*Defined in [noise.ts:290](https://github.com/jamesporter/solandra/blob/a654911/src/lib/noise.ts#L290)*

**Parameters:**

Name | Type |
------ | ------ |
`seed` | number |

**Returns:** *void*