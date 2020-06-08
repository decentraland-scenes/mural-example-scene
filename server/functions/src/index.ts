const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors({ origin: true }))
require('isomorphic-fetch')

export type messageBoard = {
  name: string
  messages: string[]
}

app.get('/hello-world', (req: any, res: any) => {
  return res.status(200).send('Hello World!')
})

app.post('/update-mural', async (req: any, res: any) => {
  let tiles = req.body.tiles

  updateMuralJSON(tiles)

  return res.status(200).send('Updated Mural')
})

app.get('/mural', async (req: any, res: any) => {
  let url = 'https://genesis-plaza.s3.us-east-2.amazonaws.com/mural/tiles.json'

  let currentMural: number[] = await getMuralJSON(url)

  return res.status(200).json({ tiles: currentMural })
})

//// AWS
const AWS = require('aws-sdk')

const AWSconfig = require('../keys/aws-key.json')

// You will need your own amazon key to handle this authentication step
AWS.config.setPromisesDependency()
AWS.config.update({
  accessKeyId: AWSconfig.AWSAccessKeyId,
  secretAccessKey: AWSconfig.AWSSecretKey,
  region: 'us-east-2',
})

export async function updateMuralJSON(tiles: number[]) {
  var upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: 'genesis-plaza',
      Key: 'mural/tiles.json',
      Body: JSON.stringify({ tiles: tiles }),
      ACL: 'public-read',
      ContentType: 'application/json; charset=utf-8',
    },
  })

  var promise = upload.promise()

  promise.then(
    function (data: any) {
      console.log('Successfully uploaded mural JSON')
    },
    function (err: any) {
      console.log('There was an error uploading mural json file: ', err.message)
    }
  )
}

export async function getMuralJSON(url: string): Promise<number[]> {
  try {
    let response = await fetch(url).then()
    let json = await response.json()
    return json.tiles
  } catch {
    console.log('error fetching from AWS server')
    console.log('url used: ', url)
    return []
  }
}

exports.app = functions.https.onRequest(app)
