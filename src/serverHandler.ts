import { tileNumbers } from './tile'
import { setRealm, playerRealm } from './realmData'
import * as utils from '@dcl/ecs-scene-utils'

export const awsServer = 'https://soho-plaza.s3.us-east-2.amazonaws.com/'
export const fireBaseServer =
  'https://us-central1-soho-plaza.cloudfunctions.net/app/'

// get lastest mural state
export async function getMural(): Promise<number[]> {
  try {
    if (!playerRealm) {
      await setRealm()
    }
    const url = awsServer + 'mural/' + playerRealm + '/tiles.json'
    const response = await fetch(url)
    const json = await response.json()
    return json.tiles
  } catch {
    log('error fetching from AWS server')
  }
}

// update mural
export async function changeMural() {
  if (!playerRealm) {
    await setRealm()
  }
  muralChanger.addComponentOrReplace(
    // Only send request if no more changes come over the next second
    new utils.Delay(1000, async function () {
      try {
        const url = fireBaseServer + 'update-mural?realm=' + playerRealm
        const body = JSON.stringify({ tiles: tileNumbers })
        const headers = {}
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body
        })
        return response.json()
      } catch {
        log('error fetching from AWS server')
      }
    })
  )
}

// dummy entity to throttle the sending of change requests
export const muralChanger = new Entity()
engine.addEntity(muralChanger)
