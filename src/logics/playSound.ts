/* eslint-disable @typescript-eslint/no-explicit-any */
import loadSnd from 'audio-loader'
import playSnd from 'audio-play'

type SndName = 'btn' | 'catch' | 'jump' | 'gameover' | 'shot' | 'charge' | 'down' | 'lvup' | 'miss'
const sndNames: SndName[] = [
  'btn',
  'catch',
  'jump',
  'gameover',
  'shot',
  'charge',
  'down',
  'lvup',
  'miss'
]

const snds: Partial<{ [key in SndName]: AudioBuffer }> = {}
const load = (name: SndName) => {
  loadSnd(`/snd/${name}.mp3`).then(a => {
    snds[name] = a
  })
}
sndNames.forEach(name => load(name))

const playSound = (name: SndName) => {
  const audio = snds[name]
  if (!audio) {
    // console.warn(`No sound for: ${name}`)
    return
  }
  return playSnd(audio, {}, () => {
    //
  })
}

export default playSound
