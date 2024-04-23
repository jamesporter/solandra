import { RegularPolygon, SCanvas } from "@site/src/lib"
import { Canvas } from "../Canvas"

const logoForDemo = (p: SCanvas) => {
	p.background(220, 26, 14)
	const { bottom, right, center } = p.meta
	const d = Math.min(bottom, right) / 2.8

	p.times(5, (n) => {
		const sides = 10 - n
		const r = d - n * 0.16 * d + (1 + Math.cos(p.t)) / 40
		p.setFillColor(220, 70, 10 + n * 12)
		p.fill(
			new RegularPolygon({
				at: center,
				n: sides,
				r,
			})
		)
	})
}

export function EndOfTutorial() {
	return <Canvas playing sketch={logoForDemo} width={320} height={320} />
}
