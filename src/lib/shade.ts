import { ShaderInclude, shaderLib } from "./shaderLib"

const vertexShaderCode = /* glsl */ `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0, 1);
}
`

function fragmentShaderCode(
  shader: string,
  imageNames: string[],
  includes?: ShaderInclude[]
) {
  return /* glsl */ `precision highp float;
precision highp sampler2D;

uniform vec2 u_resolution;

${imageNames.map((n) => `uniform sampler2D ${n};`).join("\n") ?? ""}

${includes?.map((i) => shaderLib[i]).join("\n\n") ?? ""}
  
${shader}      
  `
}

/**
 * Unlike other Solandra APIs this works with pixels
 *
 * Pass a w(idth) and h(eight) and a fragment shader string for example:
 *
 * void main() {
 *   vec2 r_pos = gl_FragCoord.xy / u_resolution;
 *   gl_FragColor = vec4(r_pos.x, r_pos.y, 0.4, 1.0);
 * }
 *
 * The fragment shader should be a GLSL fragment shader containing a main function that sets `gl_FragColor`. A
 * single uniform `u_resolution` is provided.
 *
 * Uses OffscreenCanvas to render the shader, returns an ImageBitmap which can be easily used in a Solandra canvas
 * via the `drawImage` method
 *
 */
export function renderShader({
  w = 2048,
  h = 2048,
  shader,
  images = {},
  includes,
}: {
  w?: number
  h?: number
  shader: string
  images?: Record<string, ImageBitmap>
  includes?: ShaderInclude[]
}) {
  const offscreen = new OffscreenCanvas(w, h)

  const gl = offscreen.getContext("webgl", { preserveDrawingBuffer: true })

  if (!gl) throw new Error("Unable to create OffscreenCanvas context")

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

  gl.clearColor(1.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    ]),
    gl.STATIC_DRAW
  )

  const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
  gl.shaderSource(vertexShader, vertexShaderCode)
  gl.compileShader(vertexShader)

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!
  const code = fragmentShaderCode(shader, Object.keys(images), includes)
  gl.shaderSource(fragmentShader, code)
  gl.compileShader(fragmentShader)

  const program = gl.createProgram()!
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.useProgram(program)

  const positionLocation = gl.getAttribLocation(program, "a_position")
  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

  const error = gl.getShaderInfoLog(fragmentShader)
  if (error) {
    throw error
  }

  const locationURes = gl.getUniformLocation(program, "u_resolution")
  gl.uniform2f(locationURes, gl.drawingBufferWidth, gl.drawingBufferHeight)

  Object.entries(images).map(([name, image], i) => {
    const texture = gl.createTexture()

    gl.activeTexture(gl.TEXTURE0 + i)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    const locationUResImg = gl.getUniformLocation(program, name)
    // this is so confusing(!); this is indexed from 0, but for active texture stuff to the weird offset
    gl.uniform1i(locationUResImg, i)
  })

  gl.drawArrays(gl.TRIANGLES, 0, 6)

  return offscreen.transferToImageBitmap()
}
