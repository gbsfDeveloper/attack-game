import Phaser from '../lib/phaser.js'

class Game extends Phaser.Scene{

    constructor(){
        super('Game');
    }

    preload(){
        // map tiles
        this.load.image('tileset', 'assets/map/spritesheet-extruded.png');
        // map in json format
        this.load.tilemapTiledJSON('map', 'assets/main-map/map.json');
        // our two characters
        this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('pj_items', 'assets/pj_items.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('things', 'assets/things.png', { frameWidth: 16, frameHeight: 16 });
        // touch controls
        this.load.image('touch_up', 'assets/touch_controls/touch_up.png');
        this.load.image('touch_down', 'assets/touch_controls/touch_down.png');
        this.load.image('touch_left', 'assets/touch_controls/touch_left.png');
        this.load.image('touch_right', 'assets/touch_controls/touch_right.png');
        this.load.image('touch_a', 'assets/touch_controls/touch_a.png');
        this.load.image('touch_b', 'assets/touch_controls/touch_b.png');
    }

    create(){
        // start the WorldScene
        this.scene.start('WorldScene');
    }

}
export default Game;