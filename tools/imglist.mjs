import glob from 'glob'
import fs from 'fs'

const entries = glob
  .sync('imgs/**/*.+(svg|jpg)', {
    cwd: './public'
  })
  .map(ent => `/${ent}`)

fs.writeFileSync('src/assets/preloads.json', JSON.stringify(entries), {
  encoding: 'utf8',
  flag: 'w',
  mode: 0o666
})
