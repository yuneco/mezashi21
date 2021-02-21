import * as PIXI from 'pixi.js'

type ImgAssetPath = [string, string]
type LoaderResult = Partial<Record<string, PIXI.LoaderResource>>

const imgCache: { [key in string]: PIXI.Texture } = {}
const loadings: { [key in string]: Promise<PIXI.Texture> } = {}
const cacheKeyFor = (url: string, w?: number, h?: number) => {
  return `${url}?w=${w}&h=${h}`
}

export const loadImgs = (pathes: ImgAssetPath[]): Promise<LoaderResult> => {
  const loader = new PIXI.Loader()
  pathes.forEach(path => loader.add(...path))
  const promise = new Promise<LoaderResult>(resolve => {
    loader.load((loader, resources) => {
      resolve(resources)
    })
  })
  return promise
}

const resizeImgElem = (img: HTMLImageElement, w?: number, h?: number): void => {
  const nw = img.naturalWidth
  const nh = img.naturalHeight
  if (!nw || !nh) {
    return
  }
  if (!w && !h) {
    return
  }
  if (w && h) {
    img.width = w
    img.height = h
    return
  }
  if (w) {
    img.width = w
    img.height = (nh / nw) * w
    return
  }
  if (h) {
    img.height = h
    img.width = (nw / nh) * h
    return
  }
}

export const loadSvg = async (url: string, w?: number, h?: number): Promise<PIXI.Texture> => {
  const resolution = Math.min(window.devicePixelRatio, 2)

  const onload = (el: HTMLImageElement): PIXI.Texture => {
    const [orgW, orgH] = [el.width, el.height]
    if (!w && !h) {
      // サイズ指定がない場合
      resizeImgElem(el, el.naturalWidth * resolution, el.naturalHeight * resolution)
    } else {
      // w,hの少なくとも一方が指定されている場合
      resizeImgElem(el, w && w * resolution, h && h * resolution)
    }
    const tx = PIXI.Texture.from(el, { resolution })
    el.width = orgW
    el.height = orgH
    return tx
  }

  const cacheKey = cacheKeyFor(url, w, h)
  const cachedTx = imgCache[cacheKey]
  if (cachedTx) {
    return cachedTx
  }
  if (loadings[cacheKey]) {
    // console.log('wait for load...', cacheKeyFor(url, w, h))
    return await loadings[cacheKey]
  }
  // console.log('new load', cacheKeyFor(url, w, h), imgCache)

  const promise = new Promise<PIXI.Texture>((resolve, reject) => {
    const el = new Image(w, h)
    el.addEventListener('load', async () => {
      const tx = onload(el)
      imgCache[cacheKeyFor(url, w, h)] = tx
      resolve(tx)
    })
    el.addEventListener('error', err => {
      reject(err)
    })
    el.src = url
  })
  loadings[cacheKey] = promise
  const result = await promise
  delete loadings[cacheKey]
  return result
}

export const loadSprite = async (texPath: string, w?: number, h?: number) => {
  const tex = await loadSvg(texPath, w, h)
  return new PIXI.Sprite(tex)
}

export const loadSvgs = async (
  ...reqs: { url: string; w?: number; h?: number }[]
): Promise<{ [s in string]: PIXI.Texture }> => {
  const resp: { [s in string]: PIXI.Texture } = {}
  const tasks = reqs.map(async req => {
    resp[req.url] = await loadSvg(req.url, req.w, req.h)
  })
  await Promise.all(tasks)
  return resp
}
