import { Tile, tiles, tileNumbers } from './tile'
import { getMural, muralChanger } from './serverHandler'
import * as utils from '@dcl/ecs-scene-utils'

// Base scene
const baseScene = new Entity()
baseScene.addComponent(new GLTFShape('models/baseScene.glb'))
baseScene.addComponent(new Transform())
engine.addEntity(baseScene)

// For transforming the mural
const scene = new Entity()
scene.addComponent(
  new Transform({
    position: new Vector3(8, 0, 8),
    rotation: Quaternion.Euler(0, 90, 0),
  })
)
engine.addEntity(scene)

// Tile
const boxShape = new BoxShape()
boxShape.withCollisions = false

// Parameters for the mural
const MURAL_WIDTH = 33
const MURAL_HEIGHT = 16
const START_POS_X = -4.445
const START_POS_Y = 4.5
const TILE_SIZE = 0.25

let xPosition = START_POS_X
let yPosition = START_POS_Y
let tileIndex = 0

// For brick pattern
// let isRed = true

// Build mural
for (let i = 0; i < MURAL_HEIGHT; i++) {
  for (let j = 0; j < MURAL_WIDTH; j++) {
    // For brick pattern
    // let colorIndex: number
    // if (i % 2 !== 0) isRed = !isRed
    // if (j % 2 !== 0) isRed = !isRed
    // isRed ? (colorIndex = 1) : (colorIndex = 2)

    const tile = new Tile(
      boxShape,
      new Transform({
        position: new Vector3(xPosition, yPosition, 0),
        scale: new Vector3(TILE_SIZE, TILE_SIZE, 0.125),
      }),
      tileIndex
      // colorIndex // For brick pattern
    )
    tile.setParent(scene)
    tileIndex = tiles.push(tile)
    tileNumbers.push(null)
    xPosition += TILE_SIZE + 0.02 // Adding a small gap
  }
  xPosition = START_POS_X
  yPosition -= TILE_SIZE + 0.02
}

updateMural().catch((error) => log(error))

async function updateMural() {
  const currentTiles = await getMural()

  log(currentTiles)
  for (let i = 0; i < currentTiles.length; i++) {
    if (currentTiles[i] === null) {
      continue
    }
    tileNumbers[i] = currentTiles[i]
    tiles[i].setColor(currentTiles[i])
  }
}

const triggerBox = new utils.TriggerBoxShape(
  new Vector3(15, 8, 15),
  Vector3.Zero()
)

const trigger = new Entity()
trigger.addComponent(new Transform({ position: new Vector3(8, 0, 8) }))

trigger.addComponent(
  new utils.TriggerComponent(triggerBox, {
    onCameraEnter: () => {
      log('triggered refresh')
      updateMural().catch((error) => log(error))
    },
  })
)
engine.addEntity(trigger)

muralChanger.addComponentOrReplace(
  new utils.Interval(10000, () => {
    if (!muralChanger.hasComponent(utils.Delay)) {
      updateMural().catch((error) => log(error))
    } else {
      log('not updated bc currently changing')
    }
  })
)
