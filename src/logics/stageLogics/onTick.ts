import { GameStage } from '../GameStage'
import store from '@/store'
import { CollidableObject } from '../CollisionDetector'
import { removeCat } from './catLogic'
import { Tama } from '@/sprites/Tama'
import { Cat } from '@/sprites/Cat'
import { Satellite } from '@/sprites/Satellite'
import playSound, { repeatSound } from '../playSound'

let lastApproachTime = 0
const APPLOACH_SND_MIN_INTERVAL = 200

const indecatorAngleForOrbit = (orbit: number) => {
  const width = store.state.stageSetting.vw
  const rad = Math.acos(width / (orbit + 200))
  const angle = (rad / Math.PI) * 180
  return 90 - angle
}

export const detectCollision = (stage: GameStage) => {
  const targets: CollidableObject[] = []
  targets.push({
    obj: stage.tama.chara,
    id: 'tama',
    category: 'tama',
    targets: ['cat', 'sat'],
    margin: [0.18, 0.1]
  })
  targets.push(
    ...stage.cats
      .filter(cat => cat.worldVisible)
      .map(cat => ({
        obj: cat.chara,
        id: cat.id,
        category: 'cat',
        targets: ['mezashi']
      }))
  )
  targets.push(
    ...stage.mezashis
      .filter(mzs => mzs.worldVisible)
      .map(mzs => ({
        obj: mzs.chara,
        id: mzs.id,
        category: 'mezashi',
        targets: ['cat']
      }))
  )
  targets.push(
    ...stage.sats
      .filter(sat => sat.worldVisible)
      .map(sat => ({
        obj: sat.cont,
        id: sat.id,
        category: 'sat'
      }))
  )

  stage.detector.clear()
  stage.detector.add(...targets)
  const hitPairs = stage.detector.detect()
  if (!hitPairs.length) {
    return
  }

  hitPairs.forEach(pair => {
    const sub = pair[0]
    // たまさんが何かに当たった
    if (sub.id === 'tama') {
      playSound('gameover')
      store.dispatch('gameOver')
    }
    // 猫がめざしに当たった
    if (sub.category === 'cat') {
      const cat = stage.cats.find(cat => cat.id === sub.id)
      if (cat) {
        playSound('catch')
        store.dispatch('gameIncrementScore')
        removeCat(stage, cat)
      }
    }
    // めざしが何かに当たった
    if (sub.category === 'mezashi') {
      const mzs = stage.mezashis.find(mzs => mzs.id === sub.id)
      if (mzs) {
        mzs.visible = false
      }
    }
  })
}

export const updateTamaPos = (tama: Tama) => {
  const isGameOver = store.state.game.play === 'over'
  if (!isGameOver) {
    const tamaDir = store.state.tama.dir
    const isJumping = store.state.tama.jumpCount > 0
    if (tamaDir == 'right') {
      tama.angle += isJumping ? 0.2 : 0.1
      tama.scale.x = 1
    }
    if (tamaDir == 'left') {
      tama.angle -= isJumping ? 0.2 : 0.1
      tama.scale.x = -1
    }
  }
}

export const updateCatPos = (cat: Cat) => {
  cat.angle += cat.speed * (cat.direction === 'left' ? 1 : -1)
}

export const updateSatIndicator = (sat: Satellite, tamaAngle: number) => {
  const baseAngle = (tamaAngle + 180) % 360
  const angleDiff = sat.satelliteAngle - baseAngle
  const angleDiffNormalized = angleDiff < 0 ? angleDiff + 360 : angleDiff
  const approachAngle = sat.isClockwise ? 360 - angleDiffNormalized : angleDiffNormalized
  const isApproaching = approachAngle > 20 && approachAngle < 90
  const IndicatorAngle = indecatorAngleForOrbit(sat.orbitSize)
  sat.IndicatorAngle = isApproaching
    ? baseAngle + IndicatorAngle * (sat.isClockwise ? -1 : 1)
    : undefined
  if (isApproaching) {
    // 接近時に警報音を鳴らす。一度鳴らしたら一定時間は鳴らさない
    const now = Date.now()
    const shouldPlaySnd =
      now - lastApproachTime > APPLOACH_SND_MIN_INTERVAL && store.state.game.play === 'playing'
    if (shouldPlaySnd) {
      repeatSound('warn', 3)
    }
    lastApproachTime = now
  }
}
