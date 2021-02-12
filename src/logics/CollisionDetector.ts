import boxIntersect from 'box-intersect'

export type CollidableObject = {
  id: string
  category: string
  obj: PIXI.DisplayObject
  box?: PIXI.Rectangle
  targets?: string[]
  margin?: [number, number]
}

const getBox = (
  rect: PIXI.Rectangle,
  marginXRatio = 0,
  marginYRatio = 0
): [number, number, number, number] => {
  const marginX = Math.min(marginXRatio, 0.5) * rect.width
  const marginY = Math.min(marginYRatio, 0.5) * rect.height
  return [
    rect.x + marginX,
    rect.y + marginY,
    rect.x + rect.width - marginX * 2,
    rect.y + rect.height - marginY * 2
  ]
}

export type CollisionPair = [CollidableObject, CollidableObject]
const NonNull = <T>(value: T): value is NonNullable<T> => value !== null

const diffNewResults = (lastArr: CollisionPair[], newArr: CollisionPair[]): CollisionPair[] => {
  if (!newArr.length) {
    return []
  }
  if (!lastArr.length) {
    return newArr
  }
  const lastIdDic = Object.fromEntries(lastArr.map(pare => [pare[0].id + '/' + pare[1].id, pare]))
  const newIdDic = Object.fromEntries(newArr.map(pare => [pare[0].id + '/' + pare[1].id, pare]))
  const newIds = Object.keys(newIdDic)
  const addedIds = newIds.filter(newId => !lastIdDic[newId])
  const news = addedIds.map(addedId => newIdDic[addedId])
  return news
}

export class CollisionDetector {
  readonly safeMargin = 0.1
  readonly _objs: CollidableObject[] = []
  _lastResult: CollisionPair[] = []

  add(...objs: CollidableObject[]) {
    objs.forEach(obj => {
      if (this._objs.includes(obj)) {
        return
      }
      this._objs.push(obj)
    })
  }

  clear() {
    this._objs.length = 0
  }

  detect() {
    const boxes = this._objs
      .map(c => {
        if (!c.box) {
          c.box = c.obj.getBounds()
        }
        return getBox(c.box, c.margin?.[0], c.margin?.[1])
      })
      .filter(NonNull)
    const result: CollisionPair[] = boxIntersect(boxes).map(indexes => {
      const [i1, i2] = indexes
      const c1 = this._objs[i1]
      const c2 = this._objs[i2]
      return [c1, c2]
    })
    const diffedRes = diffNewResults(this._lastResult, result)
    this._lastResult = result
    const detectedHits: CollisionPair[] = []
    diffedRes.forEach(pare => {
      const [c1, c2] = pare
      if (c1.targets && c1.targets.includes(c2.category)) {
        detectedHits.push([c1, c2])
      }
      if (c2.targets && c2.targets.includes(c1.category)) {
        detectedHits.push([c2, c1])
      }
    })
    return detectedHits
  }
}
