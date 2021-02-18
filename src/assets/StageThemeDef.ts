import { StageTheme } from './StageTheme'

export const sky: StageTheme = {
  name: 'Sky',
  imgDir: 'imgs/bg/sky',
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
  imgDir: 'imgs/bg/night',
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
  imgDir: 'imgs/bg/snow',
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
    'Snow1.svg',
    'Ice3.svg',
    'Ice2.svg',
    'Ice1.svg'
  ]
}

export const themes = {
  sky,
  night,
  snow
}
