type SatellaiteDef = {
  /** 衛星の直径 */
  size: number
  /** 軌道の直径 */
  orbitSize: number
  /** 公転周期(sec)。負値にすると逆回転 */
  orbitDuration: number
  /** 開始時の角度 */
  initialAngle: number
}

export type LevelDef = {
  /** 惑星のサイズ */
  planetSize: number
  /** 衛星の定義 */
  satellaites: SatellaiteDef[]
  /** このレベルをクリアするために必要なスコア */
  scoreToClear: number
  /** 猫の最大速度(deg/tick) */
  maxCatSpeed: number
  /** 猫の最大ジャンプ高さ(px)。0=ジャンプなし */
  maxCatJump: number
  /** 猫の生成間隔(sec) */
  catBornInterval: number
}
