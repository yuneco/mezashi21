import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'

export const initGsap = () => {
  // register the plugin
  gsap.registerPlugin(PixiPlugin)

  // give the plugin a reference to the PIXI object
  PixiPlugin.registerPIXI(PIXI)
}
