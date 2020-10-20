import { join } from 'path'
import { ensureFile, pathExists, writeJSON } from 'fs-extra'

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
    days: themes.map((theme, i) => ({
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
