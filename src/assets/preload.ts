import { loadSvg } from '@/logics/loadImgs'
import list from './preloads.json'

export const preloadAll = async (onprogress?: (percent: number) => void): Promise<void> => {
  let loadCount = 0
  const onload = () => {
    loadCount++
    if (onprogress) {
      onprogress((loadCount / list.length) * 100)
    }
  }

  await Promise.allSettled(
    list.map(ent => {
      loadSvg(ent).then(onload)
    })
  )

  return
}
