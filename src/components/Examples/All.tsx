import sketches from "../../examples/sketches"
import { Canvas } from "../Canvas"

export function AllExamples() {
	return (
		<div>
			{Object.entries(sketches).map(([kind, { sketches, description }]) => (
				<div>
					<h2>{kind}</h2>

					<p>{description}</p>

					<div
						style={{
							display: "flex",
							flexDirection: "row",
							gap: "8px",
							flexWrap: "wrap",
						}}
					>
						{sketches.map(({ sketch, name }, i) => (
							<div key={i}>
								<Canvas sketch={sketch} width={240} height={240} />
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	)
}
