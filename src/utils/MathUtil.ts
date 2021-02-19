/**
 * min以上max未満の値をランダムに返します
 * @param min
 * @param max
 */
export const randomBetween = (min: number, max: number) => {
  return min + Math.random() * (max - min)
}

/**
 * min .. max（両端含む）の整数をランダムに返します
 * @param min
 * @param max
 */
export const randomIntBetween = (min: number, max: number) => {
  return Math.floor(min + Math.random() * (max - min + 1))
}
