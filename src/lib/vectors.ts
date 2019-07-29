import { Point2D } from "./types/play";

export const add = ([x1, y1]: Point2D, [x2, y2]: Point2D): Point2D => [
  x1 + x2,
  y1 + y2
];

export const subtract = ([x1, y1]: Point2D, [x2, y2]: Point2D): Point2D => [
  x1 - x2,
  y1 - y2
];

export const magnitude = ([x, y]: Point2D): number =>
  Math.sqrt(x ** 2 + y ** 2);

export const distance = (a: Point2D, b: Point2D): number =>
  magnitude(subtract(a, b));

export const rotate = ([x, y]: Point2D, a: number): Point2D => [
  x * Math.cos(a) - y * Math.sin(a),
  x * Math.sin(a) + y * Math.cos(a)
];

export const normalise = (p: Point2D): Point2D => {
  const m = magnitude(p);
  return [p[0] / m, p[1] / m];
};

export const scale = ([x, y]: Point2D, scale: number): Point2D => [
  scale * x,
  scale * y
];

export const polarToCartesian = (
  [x, y]: Point2D,
  radius: number,
  angle: number
): Point2D => [x + radius * Math.cos(angle), y + radius * Math.sin(angle)];

export const pointAlong = (
  a: Point2D,
  b: Point2D,
  proportion = 0.5
): Point2D => {
  return add(a, scale(subtract(b, a), proportion));
};

export const dot = ([x1, y1]: Point2D, [x2, y2]: Point2D): number =>
  x1 * x2 + y1 * y2;

export default {
  add,
  subtract,
  magnitude,
  rotate,
  normalise,
  scale,
  polarToCartesian,
  pointAlong,
  dot,
  distance
};
