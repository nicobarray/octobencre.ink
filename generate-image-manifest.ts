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
  const imagePath = async (trigram, day) => {
    let path = join(__dirname, '/public', trigram, 'octobencre2020-' + day)
    const expectedExtensions = [".jpg", ".png"]

    for (let ext of expectedExtensions) {
      if (await pathExists(path + ext)) {
        return path + ext
      }
    }

    return join(__dirname, '/public', "/shame.png")
  }
  const getPublicPath = async (trigram, day) => {
    let path = join(__dirname, '/public', trigram, 'octobencre2020-' + day)
    const expectedExtensions = [".jpg", ".png"]

    for (let ext of expectedExtensions) {
      if (await pathExists(path + ext)) {
        return '/' + trigram + '/' + 'octobencre2020-' + day + ext
      }
    }

    return "/shame.png"
  }
  
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
      const drawingPath = await imagePath(trigram, day.day)
      const drawingSize = sizeOf(drawingPath)
      const src = await getPublicPath(trigram, day.day)
      day.drawings[trigram] = {
        src,
        ...drawingSize,
      }
    }
  }

  await ensureFile(join(__dirname, 'generated', 'drawings.json'))
  await writeJSON(join(__dirname, 'generated', 'drawings.json'), manifest)
}

main().catch((err) => console.log('Script failed : ' + err))
