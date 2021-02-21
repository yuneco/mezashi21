export default class RankingItem {
  readonly uid: string
  name: string
  score: number
  level: number
  playmode: 'normal' | 'random'
  created: number

  constructor(
    uid: string,
    name = '',
    score = 0,
    level = 0,
    playmode: 'normal' | 'random' = 'normal',
    created?: number
  ) {
    this.uid = uid
    this.name = name
    this.score = score
    this.level = level
    this.playmode = playmode
    this.created = created ?? Date.now()
  }
}
