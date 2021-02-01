import * as PIXI from 'pixi.js'

type ImgAssetPath = [string, string]
type LoaderResult = Partial<Record<string, PIXI.LoaderResource>>

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

export const loadSvg = async (
  url: string,
  w?: number,
  h?: number
): Promise<PIXI.Texture> => {
  const el = new Image(w, h)
  const resolution = window.devicePixelRatio
  const promise = new Promise<PIXI.Texture>((resolve, reject) => {
    el.addEventListener('load', () => {
      if (!w && !h) {
        // サイズ指定がない場合
        resizeImgElem(
          el,
          el.naturalWidth * resolution,
          el.naturalHeight * resolution
        )
      } else {
        // w,hの少なくとも一方が指定されている場合
        resizeImgElem(el, w && w * resolution, h && h * resolution)
      }
      const tx = PIXI.Texture.from(el, { resolution })
      resolve(tx)
    })
    el.addEventListener('error', err => {
      reject(err)
    })
    el.src = url
  })
  return promise
}
