import store from '@/store'
import * as PIXI from 'pixi.js'
const shaderSource = require('./OutlineFilter.glsl').default as string

/**
 * パステル調の表現を加えるためのフィルタです。
 */
export default class PastelFilter extends PIXI.Filter {
  thickness: number

  constructor(thickness = 4.0) {
    const paper = PIXI.Texture.from('/imgs/paperNoise.jpg')
    super(
      undefined, // 頂点シェーダーのソース（今回はいらないのでnull）
      // フラグメントシェーダーのソース：
      // GLSL内でループ処理するときのループカウンタ増分を事前に計算し、
      // GLSLのソースに直接漉き込む。GLSLではループ文の条件はコード内で
      // 動的に変更できないので、必要なものは事前にJS側で計算し、コードに埋め込むことが必要
      shaderSource,
      // シェーダー側に渡すパラメータの宣言
      {
        uSize: new Float32Array([0, 0]),
        uPaper: paper,
        uColor: new Float32Array([0.3, 0.2, 0.1]),
        uThickness: new Float32Array([0, 0])
      }
    )
    this.thickness = thickness
  }
  // フィルタを適用する際の処理（PIXIが呼んでくれる）。
  // パラメータの値更新等、前処理を記述できる
  apply(
    filterManager: PIXI.systems.FilterSystem,
    input: PIXI.RenderTexture,
    output: PIXI.RenderTexture,
    clear: PIXI.CLEAR_MODES
  ): void {
    this.padding = this.thickness
    this.uniforms.uColor = this.colorNumToVec(store.state.appcolor.border)
    this.uniforms.uSize[0] = input._frame.width
    this.uniforms.uSize[1] = input._frame.height
    this.uniforms.uThickness[0] = this.thickness / input._frame.width
    this.uniforms.uThickness[1] = this.thickness / input._frame.height
    filterManager.applyFilter(this, input, output, clear)
  }

  /**
   * PIXIの色数値を[R,G,B]形式のFloat32Arrayに変換します
   * @param c 0x000000 形式で表現される色
   */
  private colorNumToVec(c: number): Float32Array {
    return new Float32Array([
      /* R */ ((c & 0b1111_1111_0000_0000_0000_0000) >> (4 * 4)) / 0xff,
      /* G */ ((c & 0b0000_0000_1111_1111_0000_0000) >> (4 * 2)) / 0xff,
      /* B */ (c & 0b0000_0000_0000_0000_1111_1111) / 0xff
    ])
  }
}
