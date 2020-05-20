// Setup for multiplayer
export const sceneMessageBus = new MessageBus()
export let tiles: Tile[] = []

// Colors to cycle through (7 main colours + white + black)
const colors: Color3[] = [
  new Color3(1.2, 1.2, 1.2), // Super white
  Color3.FromHexString('#ff363f'), // Red
  Color3.FromHexString('#ff881f'), // Orange
  Color3.FromHexString('#ffea00'), // Yellow
  Color3.FromHexString('#00b37b'), // Green
  Color3.FromHexString('#006a7a'), // Blue
  Color3.FromHexString('#875a95'), // Purple
  Color3.FromHexString('#e86cd2'), // Pink
  Color3.Black(),
]

export class Tile extends Entity {
  public color: Color3
  public material: Material = new Material()
  private colorIndex: number = 0
  private tileIndex: number

  constructor(model: PlaneShape, transform: Transform, tileIndex: number) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(transform)
    this.addComponent(this.material)
    this.material.albedoColor = colors[this.colorIndex]
    this.material.roughness = 1

    // Flip sound when changing tile color
    const sound = new Entity()
    sound.addComponent(new Transform())
    sound.getComponent(Transform).position = Camera.instance.position
    sound.addComponent(
      new AudioSource(new AudioClip('sounds/navigationForward.mp3'))
    )
    engine.addEntity(sound)

    // Tile ID
    this.tileIndex = tileIndex

    this.addComponent(
      new OnPointerDown(
        () => {
          sound.getComponent(AudioSource).playOnce()
          // Send tile and color index message to all players
          sceneMessageBus.emit('setTileColor', {
            tileIndex: this.tileIndex,
            colorIndex: this.colorIndex,
          })
        },
        { button: ActionButton.POINTER, hoverText: 'Change Color' }
      )
    )
  }

  public setColor(colorIndex: number): void {
    this.colorIndex < colors.length - 1
      ? (this.colorIndex = colorIndex + 1)
      : (this.colorIndex = 0)

    this.material.albedoColor = colors[this.colorIndex]
  }
}

// Receiving tile and color message from player
sceneMessageBus.on('setTileColor', (e) => {
  tiles[e.tileIndex].setColor(e.colorIndex)
})
