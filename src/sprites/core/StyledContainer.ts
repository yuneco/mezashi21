import * as PIXI from 'pixi.js'
import OutlineFilter from '@/filters/OutlineFilter'
import PaperFilter from '@/filters/PaperFilter'
import store from '@/store'

export class StyledContainer extends PIXI.Container {
  constructor() {
    super()

    const stageSetting = store.state.stageSetting
    this.filters = [new OutlineFilter(stageSetting.scale * 5.0), new PaperFilter()]
  }
}
