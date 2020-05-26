import { tileNumbers } from './tile'
import { getRealm } from './realmData'

export let playerRealm = 'localhost-stub' //getRealm()

export let awsServer = 'https://genesis-plaza.s3.us-east-2.amazonaws.com/'
export let fireBaseServer =
  'https://us-central1-genesis-plaza.cloudfunctions.net/app/'

// get lastest mural state
export async function getMural(): Promise<number[]> {
  try {
    // if (!playerRealm) {
    //   playerRealm = await getRealm()
    // }
    let url = awsServer + 'mural/' + playerRealm + '/tiles.json'
    let response = await fetch(url).then()
    let json = await response.json()
    return json.tiles
  } catch {
    log('error fetching from AWS server')
  }
}

// update mural
export async function changeMural() {
  try {
    // if (!playerRealm) {
    //   playerRealm = await getRealm()
    // }
    let url = fireBaseServer + 'update-mural?realm=' + playerRealm
    let body = JSON.stringify({ tiles: tileNumbers })
    let headers = {}
    let response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    })
    return response.json()
  } catch {
    log('error fetching from AWS server')
  }
}
