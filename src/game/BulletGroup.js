import Phaser from '../lib/phaser.js'

class Bullet extends Phaser.Physics.Arcade.Group
{
    constructor(scene){
        super(scene);
    }
}

export default Bullet;