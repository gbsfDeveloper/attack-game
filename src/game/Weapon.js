import Phaser from '../lib/phaser.js'

class Weapon extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        this.setScale(0.75);
    }
}

export default Weapon;