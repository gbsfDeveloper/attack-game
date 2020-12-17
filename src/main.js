import Phaser from './lib/phaser.js'
import Game from './scenes/game.js'
import WorldScene from './scenes/WorldScene.js'

export default new Phaser.Game({
    type:Phaser.AUTO,
    parent:'content',
    width:320,
    height:240,
    zoom:2,
    pixelArt:true,
    physics:{
        default:'arcade',
        arcade:{
            gravity:{
                y:0
            },
            debug:false
        }
    },
    scene:[Game, WorldScene]
})
