import Phaser from '../lib/phaser.js'

const  Directions = {
    UP:"UP",
    DOWN:"DOWN",
    LEFT:"LEFT",
    RIGHT:"RIGHT",
}
class Enemy extends Phaser.Physics.Arcade.Sprite
{
    direction = Directions.RIGHT;
    SPEED = 30;

    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        this.setScale(1);
        this.anims.play('enemyright', true);
        scene.physics.world.on('worldbounds', this.verifyWorldBounds, this);
        scene.time.addEvent({
            delay:2000,
            callback:()=>{this.timeEvent(scene)},
            callbackScope:this
        })
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt);

        switch(this.direction){
            case Directions.UP:
                this.body.setVelocityY(-this.SPEED);
                break;
            case Directions.DOWN:
                this.body.setVelocityY(this.SPEED);
                break;
            case Directions.LEFT:
                this.body.setVelocityX(-this.SPEED);
                break;
            case Directions.RIGHT:
                this.body.setVelocityX(this.SPEED);
                break;
        }
    }

    verifyWorldBounds(object){
        const choiceDirections = ["UP", "DOWN", "RIGHT", "LEFT"];
        const random = Math.floor(Math.random() * choiceDirections.length);
        console.log(random, choiceDirections[random]);
        this.direction = Directions[choiceDirections[random]]
    }

    timeEvent(scene){
        this.verifyWorldBounds();
        console.log("activado");
        scene.time.addEvent({
            delay:2000,
            callback:()=>{this.timeEvent(scene)},
            callbackScope:this
        })
    }
}

export default Enemy;