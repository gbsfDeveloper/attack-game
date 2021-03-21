import Phaser from './lib/phaser.js'
import Game from './scenes/game.js'
import WorldScene from './scenes/WorldScene.js'

window.GAMEAPP = {
    game: null,
    viewportWidth: 320, 
    viewportHeight: 240,
    worldWidth: 320,
    worldHeight: 240,
    main: function(){
        this.game = new Phaser.Game( this.config );
    },
    state: {},
    config:{
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
                debug:true
            }
        },
        scene:[Game, WorldScene]
    }
};

export default new Phaser.Game(
    window.GAMEAPP.config
);