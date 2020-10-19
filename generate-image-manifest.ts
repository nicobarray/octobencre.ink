import { join } from 'path'
import { ensureFile, pathExists, writeJSON } from 'fs-extra'
import { twentyTwentyThemes } from './core/theme'

async function main() {
  const imagePath = (trigram, day) =>
    join(__dirname, '/public', trigram, 'octobencre2020-' + day + '.jpg')

  const artists = ['nby', 'lae', 'idt']

  const manifest = {
    when: 'october 2020',
    who: artists,
    days: twentyTwentyThemes.map((theme, i) => ({
      theme,
      day: i + 1,
      drawings: {},
    })),
  }

  for (let day of manifest.days) {
    for (let trigram of artists) {
      const hasDrawing = await pathExists(imagePath(trigram, day.day))
      if (hasDrawing) {
        day.drawings[trigram] =
          '/' + trigram + '/' + 'octobencre2020-' + day.day + '.jpg'
      } else {
        day.drawings[trigram] = '/shame.png'
      }
    }
  }

  await ensureFile(join(__dirname, 'public', 'octobencre2020.json'))
  await writeJSON(join(__dirname, 'public', 'octobencre2020.json'), manifest)
}

main().catch((err) => console.log('Script failed : ' + err))
