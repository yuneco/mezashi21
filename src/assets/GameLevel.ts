import { themes } from './StageThemeDef'

export type PlanetItemName = 'flower' | 'ice'

export type SatelliteSetting = {
  /** 衛星の直径 */
  readonly size: number
  /** 軌道の直径 */
  readonly orbitSize: number
  /** 公転周期(sec)。負値にすると逆回転 */
  readonly orbitDuration: number
  /** 開始時の角度 */
  readonly initialAngle: number
  /** テクスチャパス */
  readonly imgName: string
}

export type GameLevel = {
  /** テーマ名 */
  readonly themeName: keyof typeof themes
  /** 惑星のサイズ */
  readonly planetSize: number
  /** 惑星に配置する装飾アイテム（オプション） */
  readonly planetItem?: PlanetItemName
  /** 惑星のテクスチャパス */
  readonly planetImgName: string
  /** 衛星の定義 */
  readonly satellaites: SatelliteSetting[]
  /** このレベルをクリアするために必要なスコア */
  readonly scoreToClear: number
  /** 猫の最大速度(deg/tick) */
  readonly maxCatSpeed: number
  /** 猫の最大ジャンプ高さ(px)。0=ジャンプなし */
  readonly maxCatJump: number
  /** 猫の生成間隔(sec) */
  readonly catBornInterval: number
}
