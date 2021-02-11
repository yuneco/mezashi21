precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 uSize;
uniform sampler2D uPaper;

/* フィルタのメイン処理 */
void main(void) {
  vec2 tex = texture2D(uPaper, fract(vTextureCoord * 1.)).xy;
  tex -= vec2(0.5, 0.5);
  tex.x *= 256. / uSize.x * 0.008;
  tex.y *= 256. / uSize.y * 0.008;
  vec4 c = texture2D(uSampler, vTextureCoord + tex);
  gl_FragColor = c;
}