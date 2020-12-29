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
        this.anims.play(`ENEMY${Directions.RIGHT}`, true);
        scene.physics.world.on('worldbounds', this.changeDirection, this);
        scene.time.addEvent({
            delay:2000,
            callback:()=>{this.setTimeDirection(scene)},
            callbackScope:this
        })
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt);

        switch(this.direction){
            case Directions.LEFT:
                this.anims.play(`ENEMY${Directions.LEFT}`, true);
                this.body.setVelocityX(-this.SPEED);
                this.flipX = true;
                break;
            case Directions.RIGHT:
                this.anims.play(`ENEMY${Directions.RIGHT}`, true);
                this.body.setVelocityX(this.SPEED);
                this.flipX = false;
                break;
            case Directions.UP:
                this.anims.play(`ENEMY${Directions.UP}`, true);
                this.body.setVelocityY(-this.SPEED);
                break;
            case Directions.DOWN:
                this.anims.play(`ENEMY${Directions.DOWN}`, true);
                this.body.setVelocityY(this.SPEED);
                break;
        }
    }

    changeDirection(object){
        const choiceDirections = ["UP", "DOWN", "RIGHT", "LEFT"];
        const random = Math.floor(Math.random() * choiceDirections.length);
        console.log(random, choiceDirections[random]);
        this.direction = Directions[choiceDirections[random]]
    }

    setTimeDirection(scene){
        this.changeDirection();
        console.log("activado");
        scene.time.addEvent({
            delay:2000,
            callback:()=>{this.setTimeDirection(scene)},
            callbackScope:this
        })
    }
}

export default Enemy;