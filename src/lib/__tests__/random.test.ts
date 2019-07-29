import { PlayCanvas } from "..";

describe("Uniform random integers", () => {
  it("should be able to generate something random enough", () => {
    const p = new PlayCanvas(
      // @ts-ignore
      {
        resetTransform: () => {},
        scale: () => {},
        lineWidth: 1
      },
      { width: 1, height: 1 },
      100
    );

    let total = 0;
    p.times(100, () => {
      const r = p.uniformRandomInt({ from: 0, to: 100, inclusive: true });
      total += r;

      expect(r).toBeLessThan(101);
      expect(r).toBeGreaterThan(-1);
    });

    expect(total / 100).toBeGreaterThan(45);
    expect(total / 100).toBeLessThan(55);
  });

  it("seeding should work", () => {
    let total = 0;
    for (let i = 0; i < 100; i++) {
      const p = new PlayCanvas(
        // @ts-ignore
        {
          resetTransform: () => {},
          scale: () => {},
          lineWidth: 1
        },
        { width: 1, height: 1 },
        i
      );

      const r = p.uniformRandomInt({ from: 0, to: 100, inclusive: true });
      total += r;
    }
    expect(total / 100).toBeGreaterThan(45);
    expect(total / 100).toBeLessThan(55);
  });
});
