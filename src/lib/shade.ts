const vertexShaderCode = /* glsl */ `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0, 1);
}
`

function fragmentShaderCode(shader: string) {
  return /* glsl */ `precision highp float;
  
  uniform vec2 u_resolution;
  
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
}: {
  w?: number
  h?: number
  shader: string
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
  gl.shaderSource(fragmentShader, fragmentShaderCode(shader))
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

  gl.drawArrays(gl.TRIANGLES, 0, 6)

  return offscreen.transferToImageBitmap()
}
