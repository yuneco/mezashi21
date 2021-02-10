export const all = (...ps: Promise<void>[]) => Promise.all(ps)
export const run = (f: () => Promise<void>) => f()
