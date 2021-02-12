export const all = (...ps: Promise<unknown>[]) => Promise.all(ps)
export const run = (f: () => Promise<unknown>) => f()
