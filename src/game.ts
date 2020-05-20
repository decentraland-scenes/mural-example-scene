import { Tile, tiles, tileNumbers } from './tile'
import { getMural } from './serverHandler'

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
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
engine.addEntity(scene)

// Tile
const planeShape = new PlaneShape()
planeShape.withCollisions = false

// Parameters for the mural
const MURAL_WIDTH = 32
const MURAL_HEIGHT = 16
const START_POS_X = -3.69
const START_POS_Y = 4.5
const TILE_SIZE = 0.25

let xPosition = START_POS_X
let yPosition = START_POS_Y
let tileIndex = 0

// Build mural
for (let i = 0; i < MURAL_HEIGHT; i++) {
  for (let j = 0; j < MURAL_WIDTH; j++) {
    const tile = new Tile(
      planeShape,
      new Transform({
        position: new Vector3(xPosition, yPosition, 0),
        scale: new Vector3(TILE_SIZE, TILE_SIZE, 1),
      }),
      tileIndex
    )
    tile.setParent(scene)
    tileIndex = tiles.push(tile)
    tileNumbers.push(null)
    xPosition += TILE_SIZE + 0.02 // Adding a small gap
  }
  xPosition = START_POS_X
  yPosition -= TILE_SIZE + 0.02
}

updateMural()

async function updateMural() {
  let currentTiles = await getMural()

  log(currentTiles)
  for (let i = 0; i < currentTiles.length; i++) {
    if (currentTiles[i] === null) {
      continue
    }
    tileNumbers[i] = currentTiles[i]
    tiles[i].setColor(currentTiles[i])
  }
}
