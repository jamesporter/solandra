import { Canvas } from "../src/components/Canvas"
import Footer from "../src/components/Footer"
import Header from "../src/components/Header"
import { RegularPolygon, Star, renderShader } from "../src/lib"

const shaderOne = /* glsl */ `
void main() {
  vec2 r_pos = gl_FragCoord.xy / u_resolution;
  gl_FragColor = vec4(r_pos.x, r_pos.y, 0.4, 1.0);
}
`

// A generic noise shader
const noiseShader = /* glsl */ `
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+10.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187, 
                      0.366025403784439, 
                     -0.577350269189626, 
                      0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    gl_FragColor = vec4(
        snoise(gl_FragCoord.xy * 8.0 / u_resolution),
        snoise(gl_FragCoord.xy * 7.0 / u_resolution),
        snoise(gl_FragCoord.xy * 3.0 / u_resolution),
        1.0);
}
`

export default function Shaders() {
  return (
    <>
      <Header />

      <h1 className="text-4xl text-sky-700 mt-16 mb-4 text-center">Shaders</h1>
      <p className="text-center max-w-xl m-auto mb-12">
        Solandra can leverage GLSL shaders, though this is not intended to be
        for realtime rendering (for that you should think about more efficient
        approaches).
      </p>

      <p className="text-center max-w-xl m-auto mb-12">
        Here are a few simple examples. We create a couple of images and render
        to canvas. In the third example we use a custom compositing (blend)
        mode.
      </p>

      <div className="flex flex-row flex-wrap gap-8 justify-center">
        <div className="w-[320px] h-[320px] flex flex-col">
          <Canvas
            aspectRatio={1}
            sketch={(s) => {
              const gradient = renderShader({ shader: shaderOne })
              s.drawImage({ image: gradient })
            }}
            seed={0}
            playing={false}
          />
        </div>

        <div className="w-[320px] h-[320px] flex flex-col">
          <Canvas
            aspectRatio={1}
            sketch={(s) => {
              const gradient = renderShader({ shader: shaderOne })

              s.withClipping(
                new RegularPolygon({ n: 8, r: 0.45, at: s.meta.center }),
                () => {
                  s.drawImage({ image: gradient })
                }
              )
            }}
            seed={0}
            playing={false}
          />
        </div>

        <div className="w-[320px] h-[320px] flex flex-col">
          <Canvas
            aspectRatio={1}
            sketch={(s) => {
              const noise = renderShader({ shader: noiseShader })

              s.background(50, 30, 80)

              s.withBlendMode("soft-light", () => {
                s.drawImage({ image: noise })
              })

              s.setFillColor(210, 60, 40, 0.8)
              s.fill(new Star({ at: s.meta.center, r: 0.4, n: 5 }))
            }}
            seed={0}
            playing={false}
          />
        </div>
      </div>

      <Footer />
    </>
  )
}
