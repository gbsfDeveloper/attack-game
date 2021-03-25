import Phaser from '../lib/phaser.js'

class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        this.setScale(1);
    }
}

export default Bullet;