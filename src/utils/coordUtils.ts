export const angleOfPoints = (p1: PIXI.Point, p2: PIXI.Point): number =>
  (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI
