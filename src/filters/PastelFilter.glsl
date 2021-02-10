precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterClamp;

uniform vec2 uSize;
uniform vec3 uShColor1;
uniform vec3 uShColor2;
const float DOUBLE_PI = 3.14159265358979323846264 * 2.;
const float ANGLE_STEP = <ANGLE_STEP>;
const float EDGE_RATE_OF_OUTLINE = 0.5;
const float ANGLE_STEP_EDGE = ANGLE_STEP * EDGE_RATE_OF_OUTLINE * EDGE_RATE_OF_OUTLINE;

/* ランダムなノイズを生成する。PIXIのnoiseフィルターより */
float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

/* ベースの色に影の色をのせた色を求める */
vec4 shadowColor (vec4 baseRgba, float amount, float shAngle) {
  vec3 sh2 = uShColor1;
  vec3 sh1 = uShColor2;
  vec3 sh = mix(sh1, sh2, shAngle);
  return vec4(mix(sh, baseRgba.rgb, 1.0 - amount), baseRgba.a);
}

/* フィルタのメイン処理 */
void main(void) {
  float noizeX = (rand(vTextureCoord * 100.0) - 0.5) * uSize.x * 0.1;
  float noizeY = (rand(vTextureCoord * 100.0 + 10.0) - 0.5) * uSize.y * 0.1;
  vec2 sourceCoord = vTextureCoord + vec2(noizeX, noizeY);
  vec4 ownColor = texture2D(uSampler, sourceCoord);
  vec4 curColor;
  vec2 displaced;
  vec4 FC = vec4(0., 0., 1., 1.);

  /* サンプリング1週目。エッジ判定を行い影をつける量を求める */
  float minAlphaOl = 1.0;
  float totalAlphaOl = 0.0;
  for (float angle = 0.; angle <= DOUBLE_PI; angle += ANGLE_STEP) {
    displaced.x = vTextureCoord.x + uSize.x * cos(angle);
    displaced.y = vTextureCoord.y + uSize.y * sin(angle);
    curColor = texture2D(uSampler, clamp(displaced, FC.xy, FC.zw));
    minAlphaOl = min(minAlphaOl, curColor.a);
    totalAlphaOl += curColor.a;
  }

  /* サンプリング2週目。1週目とことなことな条件で
  エッジ判定を行い、エッジに適用するもさもさのノイズ量を求める */
  vec2 sizeEdge = uSize * EDGE_RATE_OF_OUTLINE;
  float minAlphaEd = 1.0;
  float totalAlphaEd = 0.0;
  for (float angle = 0.; angle <= DOUBLE_PI; angle += ANGLE_STEP_EDGE) {
    displaced.x = vTextureCoord.x + sizeEdge.x * cos(angle);
    displaced.y = vTextureCoord.y + sizeEdge.y * sin(angle);
    curColor = texture2D(uSampler, clamp(displaced, FC.xy, FC.zw));
    minAlphaEd = min(minAlphaEd, curColor.a);
    totalAlphaEd += curColor.a;
  }

  /* サンプリングで求めた値を元に色とアルファ値を決める */
  float avrAlphaOl = 1.0 - totalAlphaOl / (DOUBLE_PI / ANGLE_STEP);
  float avrAlphaEd = 1.0 - totalAlphaEd / (DOUBLE_PI / ANGLE_STEP_EDGE);
  float noise1 = rand(vTextureCoord / 10000.0);
  float noise2 = rand(vTextureCoord * 10.0);
  float noise3 = rand(vTextureCoord * 1.0 * noise2);
  float outlineAlpha = step(noise1 * 0.3, avrAlphaOl);
  float edgeAlpha = (1.0 - pow(avrAlphaEd, 6.0)) * ownColor.a * min(noise3 + 0.9, 1.0);
  float shadowAngle =  distance(vec2(.0, .0), vTextureCoord) / 1.41421356;
  vec3 resultRgb = shadowColor(ownColor, outlineAlpha,shadowAngle).rgb;
  gl_FragColor = vec4(resultRgb, 1.) * edgeAlpha;
}
