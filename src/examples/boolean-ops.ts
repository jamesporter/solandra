import SCanvas from "../lib/sCanvas"
import {
  union,
  intersection,
  difference,
  xor,
  shapeToSimplePath,
} from "../lib/booleanOps"
import { SimplePath } from "../lib"

/**
 * Simple union of two circles
 */
const simpleUnion = (s: SCanvas) => {
  s.background(210, 10, 95)

  const circle1 = shapeToSimplePath.circle([0.4, 0.5], 0.2)
  const circle2 = shapeToSimplePath.circle([0.6, 0.5], 0.2)

  // Draw original shapes in outline
  s.setStrokeColor(200, 50, 40, 0.3)
  s.lineWidth = 0.005
  s.draw(circle1)
  s.draw(circle2)

  // Draw union
  const result = union(circle1, circle2)
  s.setFillColor(180, 60, 50)
  result.forEach((path) => s.fill(path))
}

/**
 * Intersection of two circles (lens shape)
 */
const simpleIntersection = (s: SCanvas) => {
  s.background(210, 10, 95)

  const circle1 = shapeToSimplePath.circle([0.4, 0.5], 0.2)
  const circle2 = shapeToSimplePath.circle([0.6, 0.5], 0.2)

  // Draw original shapes in outline
  s.setStrokeColor(200, 50, 40, 0.3)
  s.lineWidth = 0.005
  s.draw(circle1)
  s.draw(circle2)

  // Draw intersection
  const result = intersection(circle1, circle2)
  s.setFillColor(140, 60, 50)
  result.forEach((path) => s.fill(path))
}

/**
 * Difference - cut out one shape from another
 */
const simpleDifference = (s: SCanvas) => {
  s.background(210, 10, 95)

  const square = shapeToSimplePath.rect(0.2, 0.2, 0.6, 0.6)
  const circle = shapeToSimplePath.circle([0.5, 0.5], 0.2)

  // Draw original shapes in outline
  s.setStrokeColor(200, 50, 40, 0.3)
  s.lineWidth = 0.005
  s.draw(square)
  s.draw(circle)

  // Draw difference (square with hole)
  const result = difference(square, circle)
  s.setFillColor(30, 60, 50)
  result.forEach((path) => s.fill(path))
}

/**
 * XOR - symmetric difference
 */
const simpleXor = (s: SCanvas) => {
  s.background(210, 10, 95)

  const circle1 = shapeToSimplePath.circle([0.4, 0.5], 0.25)
  const circle2 = shapeToSimplePath.circle([0.6, 0.5], 0.25)

  // Draw original shapes in outline
  s.setStrokeColor(200, 50, 40, 0.3)
  s.lineWidth = 0.005
  s.draw(circle1)
  s.draw(circle2)

  // Draw XOR
  const result = xor(circle1, circle2)
  s.setFillColor(280, 60, 50)
  result.forEach((path) => s.fill(path))
}

/**
 * Complex example - flower pattern using unions
 */
const flowerPattern = (s: SCanvas) => {
  s.background(45, 20, 95)

  const center: [number, number] = [0.5, 0.5]
  const petals: SimplePath[] = []

  // Create petals
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const petalCenter: [number, number] = [
      center[0] + Math.cos(angle) * 0.15,
      center[1] + Math.sin(angle) * 0.15,
    ]
    petals.push(shapeToSimplePath.circle(petalCenter, 0.12))
  }

  // Union all petals together
  const flower = union(...petals)

  // Fill the flower
  s.setFillColor(340, 70, 60)
  flower.forEach((path) => s.fill(path))

  // Add center circle
  const centerCircle = shapeToSimplePath.circle(center, 0.08)
  s.setFillColor(50, 80, 55)
  s.fill(centerCircle)
}

/**
 * Grid of intersecting circles
 */
const intersectionGrid = (s: SCanvas) => {
  s.background(0, 0, 5)

  s.forTiling({ n: 5, type: "square", margin: 0.1 }, ([x, y], [w, h]) => {
    const circle1 = shapeToSimplePath.circle([x + w * 0.3, y + h / 2], w * 0.35)
    const circle2 = shapeToSimplePath.circle([x + w * 0.7, y + h / 2], w * 0.35)

    const overlap = intersection(circle1, circle2)

    if (overlap.length > 0) {
      const hue = (x + y) * 180
      s.setFillColor(hue, 70, 60)
      overlap.forEach((path) => s.fill(path))
    }
  })
}

/**
 * Venn diagram-style composition
 */
const vennDiagram = (s: SCanvas) => {
  s.background(0, 0, 98)

  const circle1 = shapeToSimplePath.circle([0.35, 0.45], 0.2)
  const circle2 = shapeToSimplePath.circle([0.65, 0.45], 0.2)
  const circle3 = shapeToSimplePath.circle([0.5, 0.65], 0.2)

  // Find all intersections
  const int12 = intersection(circle1, circle2)
  const int23 = intersection(circle2, circle3)
  const int13 = intersection(circle1, circle3)
  const int123 = intersection(circle1, circle2, circle3)

  // Draw circles first (just the parts that are unique)
  const only1 = difference(circle1, circle2, circle3)
  const only2 = difference(circle2, circle1, circle3)
  const only3 = difference(circle3, circle1, circle2)

  s.setFillColor(0, 70, 70, 0.7)
  only1.forEach((path) => s.fill(path))

  s.setFillColor(120, 70, 70, 0.7)
  only2.forEach((path) => s.fill(path))

  s.setFillColor(240, 70, 70, 0.7)
  only3.forEach((path) => s.fill(path))

  // Draw pairwise intersections
  const only12 = difference(int12[0] || int12[1], circle3)
  const only23 = difference(int23[0] || int23[1], circle1)
  const only13 = difference(int13[0] || int13[1], circle2)

  s.setFillColor(60, 70, 50, 0.8)
  only12.forEach((path) => s.fill(path))

  s.setFillColor(180, 70, 50, 0.8)
  only23.forEach((path) => s.fill(path))

  s.setFillColor(300, 70, 50, 0.8)
  only13.forEach((path) => s.fill(path))

  // Draw triple intersection
  s.setFillColor(0, 0, 30, 0.9)
  int123.forEach((path) => s.fill(path))

  // Outline the circles
  s.setStrokeColor(0, 0, 20)
  s.lineWidth = 0.003
  s.draw(circle1)
  s.draw(circle2)
  s.draw(circle3)
}

/**
 * Geometric pattern using differences
 */
const cutoutPattern = (s: SCanvas) => {
  s.background(220, 15, 25)

  s.forTiling({ n: 4, type: "square", margin: 0.05 }, ([x, y], [w, h]) => {
    let shape = shapeToSimplePath.rect(x, y, w, h)

    // Cut out circles from corners
    const cornerRadius = w * 0.3
    const corners = [
      [x, y],
      [x + w, y],
      [x, y + h],
      [x + w, y + h],
    ] as [number, number][]

    for (const corner of corners) {
      const circle = shapeToSimplePath.circle(corner, cornerRadius)
      const result = difference(shape, circle)
      if (result.length > 0) {
        shape = result[0]
      }
    }

    const hue = (x + y) * 200
    s.setFillColor(hue, 60, 70)
    s.fill(shape)
  })
}

/**
 * Star pattern using regular polygons and boolean ops
 */
const starPattern = (s: SCanvas) => {
  s.background(240, 30, 15)

  const center: [number, number] = [0.5, 0.5]

  // Create two overlapping pentagons rotated
  const penta1 = shapeToSimplePath.regularPolygon(center, 0.35, 5, 0)
  const penta2 = shapeToSimplePath.regularPolygon(
    center,
    0.35,
    5,
    Math.PI / 5
  )

  // Union creates a star shape
  const star = union(penta1, penta2)

  // Cut out a smaller circle from the center
  const centerCircle = shapeToSimplePath.circle(center, 0.15)
  const result = difference(star[0], centerCircle)

  s.setFillColor(50, 80, 60)
  result.forEach((path) => s.fill(path))

  // Add some decoration in the hole
  const innerStar = shapeToSimplePath.regularPolygon(center, 0.08, 5, 0)
  s.setFillColor(180, 60, 50)
  s.fill(innerStar)
}

/**
 * Overlapping ellipses with XOR
 */
const xorPattern = (s: SCanvas) => {
  s.background(0, 0, 95)

  const center: [number, number] = [0.5, 0.5]
  const ellipses: SimplePath[] = []

  // Create rotated ellipses
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI
    const rx = 0.4
    const ry = 0.15

    // Approximate rotated ellipse with points
    const points: [number, number][] = []
    for (let j = 0; j <= 64; j++) {
      const t = (j / 64) * Math.PI * 2
      const x = Math.cos(t) * rx
      const y = Math.sin(t) * ry
      // Rotate the point
      const rotX = x * Math.cos(angle) - y * Math.sin(angle)
      const rotY = x * Math.sin(angle) + y * Math.cos(angle)
      points.push([center[0] + rotX, center[1] + rotY])
    }
    ellipses.push(SimplePath.withPoints(points))
  }

  // XOR all ellipses
  const result = xor(...ellipses)

  s.setFillColor(270, 60, 50)
  result.forEach((path) => s.fill(path))
}

/**
 * Complex multi-shape composition
 */
const complexComposition = (s: SCanvas) => {
  s.background(30, 20, 95)

  // Create base shape - square
  let base = shapeToSimplePath.rect(0.25, 0.25, 0.5, 0.5)

  // Add rounded corners by unioning with circles
  const cornerRadius = 0.08
  const corners = [
    [0.25, 0.25],
    [0.75, 0.25],
    [0.25, 0.75],
    [0.75, 0.75],
  ] as [number, number][]

  for (const corner of corners) {
    const circle = shapeToSimplePath.circle(corner, cornerRadius)
    const combined = union(base, circle)
    if (combined.length > 0) {
      base = combined[0]
    }
  }

  // Cut out internal pattern
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const x = 0.35 + i * 0.1
      const y = 0.35 + j * 0.1
      const size = 0.03
      const cutout = shapeToSimplePath.circle([x, y], size)
      const result = difference(base, cutout)
      if (result.length > 0) {
        base = result[0]
      }
    }
  }

  s.setFillColor(200, 60, 60)
  s.fill(base)

  // Add border
  s.setStrokeColor(200, 80, 30)
  s.lineWidth = 0.005
  s.draw(base)
}

const sketches: { sketch: (c: SCanvas) => void; name: string }[] = [
  { sketch: simpleUnion, name: "Union - Two Circles" },
  { sketch: simpleIntersection, name: "Intersection - Lens Shape" },
  { sketch: simpleDifference, name: "Difference - Circle Cut from Square" },
  { sketch: simpleXor, name: "XOR - Symmetric Difference" },
  { sketch: flowerPattern, name: "Flower Pattern (Union)" },
  { sketch: intersectionGrid, name: "Intersection Grid" },
  { sketch: vennDiagram, name: "Venn Diagram" },
  { sketch: cutoutPattern, name: "Cutout Pattern" },
  { sketch: starPattern, name: "Star Pattern" },
  { sketch: xorPattern, name: "XOR Pattern with Ellipses" },
  { sketch: complexComposition, name: "Complex Composition" },
]

export default sketches
