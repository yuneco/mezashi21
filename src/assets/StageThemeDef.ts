import { StageTheme } from './StageTheme'

export const sky: StageTheme = {
  name: 'Sky',
  imgDir: '/imgs/bg/sky',
  colors: {
    border: 0x4f7884
  },
  preloads: [
    'Cloud2.svg',
    'Cloud1.svg',
    'BubleWhite3.svg',
    'BubleWhite2.svg',
    'BubleWhite1.svg',
    'BlueSky.svg'
  ]
}

export const night: StageTheme = {
  name: 'Night',
  imgDir: '/imgs/bg/night',
  colors: {
    border: 0xc0a3a9
  },
  preloads: [
    'Star7.svg',
    'Star3.svg',
    'Star4.svg',
    'Star5.svg',
    'Star6.svg',
    'Cloud1.svg',
    'Cloud2.svg',
    'NightSky.svg',
    'Star1.svg',
    'Star2.svg'
  ]
}

export const snow: StageTheme = {
  name: 'Snow',
  imgDir: '/imgs/bg/snow',
  colors: {
    border: 0x598d9a
  },
  preloads: [
    'SnowSky.svg',
    'Snow6.svg',
    'Snow5.svg',
    'Snow4.svg',
    'Snow3.svg',
    'Snow2.svg',
    'Snow1.svg'
  ]
}

export const water: StageTheme = {
  name: 'UnderWater',
  imgDir: '/imgs/bg/water',
  colors: {
    border: 0x416c79
  },
  preloads: [
    'Wave3.svg',
    'Wave2.svg',
    'Wave1.svg',
    'WaterBubble4.svg',
    'WaterBubble3.svg',
    'WaterBubble2.svg',
    'WaterBubble1.svg',
    'WaterBg.svg'
  ]
}

export const univ: StageTheme = {
  name: 'Universe',
  imgDir: '/imgs/bg/univ',
  colors: {
    border: 0x60594f
  },
  preloads: [
    'UnivSky.svg',
    'Dust8.svg',
    'Dust7.svg',
    'Dust6.svg',
    'Dust5.svg',
    'Dust4.svg',
    'Dust3.svg',
    'Dust2.svg',
    'Dust1.svg',
    'Asteroids.svg'
  ]
}

export const dusk: StageTheme = {
  name: 'Dusk',
  imgDir: '/imgs/bg/dusk',
  colors: {
    border: 0x585356
  },
  preloads: [
    'UnivSky.svg',
    'Dust8.svg',
    'Dust7.svg',
    'Dust6.svg',
    'Dust5.svg',
    'Dust4.svg',
    'Dust3.svg',
    'Dust2.svg',
    'Dust1.svg',
    'Asteroids.svg'
  ]
}

export const themes = {
  sky,
  night,
  snow,
  water,
  univ,
  dusk
}
