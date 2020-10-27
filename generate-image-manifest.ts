import { join } from 'path'
import { ensureFile, pathExists, writeJSON } from 'fs-extra'
import sizeOf from 'image-size'

const themes = [
  'Brume',
  'Antique',
  'Frange',
  'Perdu',
  'Clef',
  'Argent',
  'Confus',
  'Familier',
  'Tranche',
  'Dégoulinant',
  'Corde',
  'Fané',
  'Cuir',
  'Pente',
  'Ovale',
  'Temple',
  'Antenne',
  'Plante',
  'Pale',
  'Minéral',
  'Auteur',
  'Académique',
  'Superstitieux',
  'Bulle',
  'Code',
  'Chaudron',
  'Traîne',
  'Reste',
  'Mains',
  'Encore',
  'Pomme de pain',
]

async function main() {
  const imagePath = (trigram, day) =>
    join(__dirname, '/public', trigram, 'octobencre2020-' + day + '.jpg')

  const artists = ['nby', 'lae', 'idt']

  const manifest = {
    when: 'october 2020',
    who: artists,
    days: themes
      .map((theme, i) => ({
        theme,
        day: i + 1,
        drawings: {},
      }))
      .reverse(),
    waiting: sizeOf(join(__dirname, 'public', 'waiting.gif')),
  }

  for (let day of manifest.days) {
    for (let trigram of artists) {
      const drawingPath = imagePath(trigram, day.day)
      console.log('Writing metadata for ' + drawingPath)

      const hasDrawing = await pathExists(drawingPath)
      if (hasDrawing) {
        const drawingSize = sizeOf(drawingPath)
        day.drawings[trigram] = {
          src: '/' + trigram + '/' + 'octobencre2020-' + day.day + '.jpg',
          ...drawingSize,
        }
      } else {
        const shamePath = join(__dirname, '/public', 'shame.png')
        const shameSize = sizeOf(shamePath)
        day.drawings[trigram] = { src: '/shame.png', ...shameSize }
      }
    }
  }

  await ensureFile(join(__dirname, 'generated', 'drawings.json'))
  await writeJSON(join(__dirname, 'generated', 'drawings.json'), manifest)
}

main().catch((err) => console.log('Script failed : ' + err))
