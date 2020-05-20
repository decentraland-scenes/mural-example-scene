export let awsServer = 'https://genesis-plaza.s3.us-east-2.amazonaws.com/'
export let fireBaseServer =
  'https://us-central1-genesis-plaza.cloudfunctions.net/app/'

// get lastest mural state
export async function getMural(): Promise<number[]> {
  try {
    let url = awsServer + 'mural/tiles.json'
    let response = await fetch(url).then()
    let json = await response.json()
    return json.tiles
  } catch {
    log('error fetching from AWS server')
  }
}

// update mural
export async function changeMural(tile: number, color: number) {
  try {
    let url = fireBaseServer + 'update-mural?tile=' + tile + '&color=' + color
    let response = await fetch(url, { method: 'POST' })
  } catch {
    log('error fetching from AWS server')
  }
}
