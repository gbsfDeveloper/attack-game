import Phaser from '../lib/phaser.js'

class Game extends Phaser.Scene{

    constructor(){
        super('Game');
    }

    preload(){
        // map tiles
        this.load.image('tiles', 'assets/map/spritesheet-extruded.png');
        
        // map in json format
        this.load.tilemapTiledJSON('map', 'assets/map/map.json');
        
        // our two characters
        this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });
        
        this.load.spritesheet('things', 'assets/things.png', { frameWidth: 16, frameHeight: 16 });
    }

    create(){
        // start the WorldScene
        this.scene.start('WorldScene');
    }

}
export default Game;