precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 uSize;
uniform sampler2D uPaper;
uniform float uScale;
uniform bool uApplyAlpha;
uniform float uAlphaLow;
uniform float uAlphaHigh;

/* フィルタのメイン処理 */
void main(void) {
  vec4 texC = texture2D(uPaper, fract(vTextureCoord * uSize * 0.01 / uScale));
  vec2 tex = texC.xy;
  tex -= vec2(0.5, 0.5);
  tex *= 256. / uSize * uScale * 0.01;
  vec4 c = texture2D(uSampler, vTextureCoord + tex);
  float a = uApplyAlpha ? smoothstep(uAlphaLow, uAlphaHigh, texC.r) : 1.0;
  gl_FragColor = c * a;
}