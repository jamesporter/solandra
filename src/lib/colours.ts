type Colour = string;

/**
 * @param h hue 0 to 360
 * @param s saturation 0 to 100
 * @param l lightness 0 to 100
 * @param a alpha 0 to 1
 */
export function hsla(h: number, s: number, l: number, a: number = 1): Colour {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}
