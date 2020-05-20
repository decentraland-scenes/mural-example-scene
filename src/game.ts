import { Tile, tiles } from './tile'

// Base scene
const baseScene = new Entity()
baseScene.addComponent(new GLTFShape('models/baseScene.glb'))
baseScene.addComponent(new Transform())
engine.addEntity(baseScene)

// Tile
const planeShape = new PlaneShape()
planeShape.withCollisions = false

// Parameters for the mural
const MURAL_WIDTH = 32
const MURAL_HEIGHT = 16
const START_POS_X = 3.69
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
        position: new Vector3(xPosition, yPosition, 8),
        scale: new Vector3(TILE_SIZE, TILE_SIZE, 1),
      }),
      tileIndex
    )
    tileIndex = tiles.push(tile)
    xPosition += TILE_SIZE + 0.02 // Adding a small gap
  }
  xPosition = START_POS_X
  yPosition -= TILE_SIZE + 0.02
}
