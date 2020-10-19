import { NextApiRequest, NextApiResponse } from 'next'
import { pathExists } from 'fs-extra'
import path from 'path'
import getConfig from 'next/config'

export default async function resolver(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { serverRuntimeConfig } = getConfig()
  try {
    const imagePath =
      '/' + req.query.trigram + '/octobencre2020-' + req.query.day + '.jpg'
    res.statusCode = 200
    res.setHeader('content-type', 'application/json')
    if (
      await pathExists(
        path.join(serverRuntimeConfig.PROJECT_ROOT, 'public', imagePath)
      )
    ) {
      res.send(imagePath)
    } else {
      res.send('/shame.png')
    }
  } catch (err) {
    res.statusCode = 500
    return res.send(null)
  }
}
