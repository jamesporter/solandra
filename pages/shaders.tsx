import { Canvas } from "../src/components/Canvas"
import Footer from "../src/components/Footer"
import Header from "../src/components/Header"
import {
  Circle,
  Rect,
  RegularPolygon,
  Star,
  render,
  renderShader,
} from "../src/lib"

const shaderOne = /* glsl */ `
void main() {
  vec2 r_pos = gl_FragCoord.xy / u_resolution;
  gl_FragColor = vec4(r_pos.x, r_pos.y, rand(r_pos), 1.0);
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
        Solandra can leverage GLSL fragment shaders, though this is not intended
        to be for realtime rendering (for that you should think about more
        efficient approaches). This offers an efficient per-pixel way of
        drawing, in contrast to the standard vector and curve based approach of
        most of Solandra. This can be combined interesting ways by drawing
        rendered shader layers onto canvases. You can use blend modes for
        control. We can also use rendered Solandra canvas or shader layers
        within shaders themselves.
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
              const gradient = renderShader({
                shader: shaderOne,
                includes: ["rand"],
              })
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
              const gradient = renderShader({
                shader: shaderOne,
                includes: ["rand"],
              })

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
      <h2 className="text-2xl text-sky-700 mt-16 mb-4 text-center">
        Stacking and Combining
      </h2>

      <div className="w-[320px] h-[320px] flex flex-col">
        <Canvas
          aspectRatio={1}
          sketch={(s) => {
            const overlay = render({
              sketch: (s) => {
                s.background(210, 70, 10)
                s.setFillColor(30, 60, 70)
                s.forPoissonDiskPoints({ minDist: 0.1 }, (at) => {
                  s.fill(new Star({ at, r: 0.025, n: 5, a: s.randomAngle() }))
                })
              },
            })

            s.background(50, 30, 80)

            s.withClipping(
              new Star({ at: s.meta.center, r: 0.7, n: 5, a: Math.PI / 12 }),
              () => {
                s.withBlendMode("soft-light", () => {
                  s.drawImage({ image: overlay })
                })
              }
            )

            s.setFillColor(210, 60, 40, 0.8)
            s.fill(new Star({ at: s.meta.center, r: 0.4, n: 5 }))
          }}
          seed={0}
          playing={false}
        />
      </div>

      <div className="w-[320px] h-[320px] flex flex-col">
        <Canvas
          aspectRatio={1}
          sketch={(s) => {
            const overlay = render({
              sketch: (s) => {
                s.background(210, 70, 10)
                s.setFillColor(30, 60, 70)
                s.forPoissonDiskPoints({ minDist: 0.1 }, (at) => {
                  s.fill(new Star({ at, r: 0.025, n: 5, a: s.randomAngle() }))
                })
              },
            })

            s.background(50, 30, 80)

            s.withClipping(new Circle({ at: s.meta.center, r: 0.3 }), () => {
              s.drawImage({ image: overlay })
            })

            const shaderImage = renderShader({
              shader: /* glsl */ `void main() {
                vec2 r_pos = gl_FragCoord.xy / u_resolution;
                gl_FragColor = vec4(
                  texture2D(overlay, r_pos).x, 
                  texture2D(overlay, r_pos / 2.0).y, 
                  texture2D(overlay, r_pos / 1.2).z, 1.0);
              }`,
              images: { overlay },
            })

            s.withBlendMode("hard-light", () => {
              s.withClipping(
                new Rect({ at: [0, 0], w: 1, h: (s.meta.bottom * 2) / 3 }),
                () => {
                  s.drawImage({ image: shaderImage })
                }
              )
            })
          }}
          seed={0}
          playing={false}
        />
      </div>

      <div className="w-[320px] h-[320px] flex flex-col">
        <Canvas
          aspectRatio={1}
          sketch={(s) => {
            const overlay = render({
              sketch: (s) => {
                s.background(210, 70, 10)
                s.setFillColor(30, 60, 70)
                s.forPoissonDiskPoints({ minDist: 0.1 }, (at) => {
                  s.fill(new Star({ at, r: 0.025, n: 5, a: s.randomAngle() }))
                })
              },
            })

            const overlay2 = render({
              sketch: (s) => {
                s.background(10, 70, 40)
                // s.forPoissonDiskPoints({ minDist: 0.01 }, (at, i) => {
                //   s.setFillColor(i, 60, 70)
                //   s.fill(new Star({ at, r: 0.025, n: 5, a: s.randomAngle() }))
                // })
              },
            })

            s.background(50, 20, 5)

            s.withClipping(new Circle({ at: s.meta.center, r: 0.3 }), () => {
              s.drawImage({ image: overlay })
            })

            const shaderImage = renderShader({
              shader: /* glsl */ `void main() {
                vec2 r_pos = gl_FragCoord.xy / u_resolution;
                gl_FragColor = vec4(
                  texture2D(overlay2, r_pos + rand(r_pos) * 0.2).x, 
                  texture2D(overlay, r_pos).y, 
                  texture2D(overlay, r_pos + rand(r_pos) * 0.1).x * 2.0, 1.0);
              }`,
              images: { overlay2, overlay },
              includes: ["rand"],
            })

            s.withClipping(new Circle({ at: s.meta.center, r: 0.45 }), () => {
              s.drawImage({ image: shaderImage })
            })
          }}
          seed={0}
          playing={false}
        />
      </div>
      <Footer />
    </>
  )
}
