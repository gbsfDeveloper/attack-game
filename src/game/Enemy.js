import Phaser from '../lib/phaser.js'

const  Directions = {
    UP:"up",
    DOWN:"down",
    LEFT:"left",
    RIGHT:"right"
}

class Enemy extends Phaser.Physics.Arcade.Sprite
{
    direction = Directions.RIGHT;
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        this.setScale(1);
        this.anims.play('enemyright', true);
    }
    preUpdate(t, dt){
        super.preUpdate(t, dt);

        switch(this.direction){
            case Directions.UP:
                this.body.setVelocityY(-80);
                break;
            case Directions.DOWN:
                this.body.setVelocityY(80);
                break;
            case Directions.LEFT:
                this.body.setVelocityX(-80);
                break;
            case Directions.RIGHT:
                this.body.setVelocityX(80);
                break;
        }
    }
}

export default Enemy;