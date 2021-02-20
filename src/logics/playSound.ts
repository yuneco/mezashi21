/* eslint-disable @typescript-eslint/no-explicit-any */
import store from '@/store'
import loadSnd from 'audio-loader'
import playSnd from 'audio-play'

type SndName = 'btn' | 'catch' | 'jump' | 'gameover' | 'shot' | 'down' | 'lvup' | 'miss' | 'warn'
const sndNames: SndName[] = [
  'btn',
  'catch',
  'jump',
  'gameover',
  'shot',
  'down',
  'lvup',
  'miss',
  'warn'
]

const snds: Partial<{ [key in SndName]: AudioBuffer }> = {}
const load = (name: SndName) => {
  loadSnd(`/snd/${name}.mp3`).then(a => {
    snds[name] = a
  })
}
sndNames.forEach(name => load(name))

const isPlayAllowed = () => {
  return store.state.system.initialTapped
}

const playSound = (name: SndName) => {
  if (!isPlayAllowed()) {
    return
  }
  const audio = snds[name]
  if (!audio) {
    // console.warn(`No sound for: ${name}`)
    return
  }
  return playSnd(audio, {}, () => {
    //
  })
}

export const repeatSound = (name: SndName, times: number) => {
  if (!isPlayAllowed()) {
    return
  }
  const audio = snds[name]
  if (!audio || times <= 0) {
    // console.warn(`No sound for: ${name}`)
    return
  }
  return playSnd(audio, {}, () => {
    if (times >= 2) {
      repeatSound(name, times - 1)
    }
  })
}

export default playSound
