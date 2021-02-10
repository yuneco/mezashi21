import * as PIXI from 'pixi.js'
import { loadSvg } from '@/logics/loadImgs'

export type SpriteDef = {
  name: string
  fileName?: string
  pos: {
    x: number
    y: number
  }
  anchor: {
    x: number
    y: number
  }
}

const createSprite = async (name: string): Promise<PIXI.Sprite> => {
  const tx = await loadSvg(`/imgs/${name}.svg`)
  return new PIXI.Sprite(tx)
}

export const loadSprites = async (defs: SpriteDef[], dir?: string): Promise<PIXI.Container> => {
  const container = new PIXI.Container()
  const tasks = defs.map((def, index) => {
    return async () => {
      const sp = await createSprite((dir ? `${dir}/` : '') + (def.fileName ?? def.name))
      sp.name = def.name
      container.addChild(sp)
      sp.zIndex = defs.length - index
      sp.anchor.set(def.anchor.x, def.anchor.y)
      sp.position.set(def.pos.x, def.pos.y)
      sp.x += sp.anchor.x * sp.width
      sp.y += sp.anchor.y * sp.height
    }
  })
  await Promise.all(tasks.map(task => task()))
  container.sortChildren()
  return container
}
