precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 uSize;
uniform vec2 uThickness;
uniform vec3 uColor;
uniform sampler2D uPaper;

const float DOUBLE_PI = 3.14159265358979323846264 * 2.;
const float SAMPLE_COUNT = 25.;
const float ANGLE_STEP = DOUBLE_PI / SAMPLE_COUNT;

float borderRate(vec2 offset) {
  float totalAlphaOl = 0.0;
  for (float angle = 0.; angle <= DOUBLE_PI; angle += ANGLE_STEP) {
    vec2 displaced = vec2(
      vTextureCoord.x + offset.x + uThickness.x * cos(angle),
      vTextureCoord.y + offset.y + uThickness.y * sin(angle)
    );

    vec4 sampleColor = texture2D(uSampler, clamp(displaced, vec2(.0), vec2(1.)));
    totalAlphaOl += sampleColor.a;
  }
  return totalAlphaOl / SAMPLE_COUNT;
}

vec4 blend(vec4 back, vec4 fore) {
  float resA = clamp(back.a + (1.0 - back.a) * fore.a, 0.0, 1.0);
  vec3 resRgb = (back.rgb * back.a * (1.0 - fore.a) + fore.rgb * fore.a) / resA;
  return vec4(resRgb, resA);
}

/* フィルタのメイン処理 */
void main(void) {
  vec2 tex = texture2D(uPaper, fract(vTextureCoord * 5.)).xy;
  tex -= vec2(0.5, 0.5);
  tex *= 0.007;
  vec4 border = vec4(uColor, step(0.1,  borderRate(tex)));
  gl_FragColor = blend(border, texture2D(uSampler, vTextureCoord));
}