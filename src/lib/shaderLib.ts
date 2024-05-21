export const shaderLib = {
  palette: `vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}`,
  rand: `float rand(vec2 pos){
    return fract(sin(dot(pos, vec2(12.9898, 78.233))) * 43758.5453);
}`,
} as const

export type ShaderInclude = keyof typeof shaderLib
