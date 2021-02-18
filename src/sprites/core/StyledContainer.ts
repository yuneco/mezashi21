import * as PIXI from 'pixi.js'
import OutlineFilter from '@/filters/OutlineFilter'
import PaperFilter from '@/filters/PaperFilter'
import store from '@/store'

// https://stackoverflow.com/questions/41980195/recursive-partialt-in-typescript
type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P]
}

type FilterOption = {
  outline: {
    enabled: boolean
    scale: number
  }
  paper: {
    enabled: boolean
    scale: number
    applyAlpha: boolean
    alphaLow: number
    alphaHigh: number
  }
}

export type FilterOptionParam = RecursivePartial<FilterOption>

const optionDefault: FilterOption = {
  outline: {
    enabled: true,
    scale: 5
  },
  paper: {
    enabled: true,
    scale: 0.8,
    applyAlpha: false,
    alphaLow: 0.23,
    alphaHigh: 0.4
  }
}

export class StyledContainer extends PIXI.Container {
  constructor(filter?: FilterOptionParam) {
    super()

    const stageSetting = store.state.stageSetting
    const filters: PIXI.Filter[] = []
    if (filter?.outline?.enabled ?? optionDefault.outline.enabled) {
      const scale = filter?.outline?.scale ?? optionDefault.outline.scale
      filters.push(new OutlineFilter(stageSetting.scale * scale))
    }
    if (filter?.paper?.enabled ?? optionDefault.paper.enabled) {
      const scale = filter?.paper?.scale ?? optionDefault.paper.scale
      const applyAlpha = filter?.paper?.applyAlpha ?? optionDefault.paper.applyAlpha
      const alphaLow = filter?.paper?.alphaLow ?? optionDefault.paper.alphaLow
      const alphaLowHigh = filter?.paper?.alphaHigh ?? optionDefault.paper.alphaHigh
      filters.push(new PaperFilter(scale, applyAlpha, alphaLow, alphaLowHigh))
    }

    this.filters = filters
  }
}
