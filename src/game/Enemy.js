import Phaser from '../lib/phaser.js'

/** @enum {string} */
const  Directions = {
    UP:"UP",
    DOWN:"DOWN",
    LEFT:"LEFT",
    RIGHT:"RIGHT",
}

class Enemy extends Phaser.Physics.Arcade.Sprite
{
    direction = Directions.RIGHT;
    SPEED = 50;
    /**
     * Contructor of the Enemy class.
     * @constructor
     * @param {Scene} scene - Game Scene, default is the main scene.
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {string} texture - main texture.
     * @param {number} frame - Frame of the spritesheet.
     */
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        this.setScale(1);
        this.anims.play('enemyright', true);
        scene.physics.world.on('worldbounds', this.verifyWorldBounds, this);
    }
    /** 
     * before update
     * @param {string} t - time 
     * @param {string} dt - death time 
    */
    preUpdate(t, dt){
        super.preUpdate(t, dt);

        switch(this.direction){
            case Directions.UP:
                this.body.setVelocityY(-this.speed);
                break;
            case Directions.DOWN:
                this.body.setVelocityY(this.speed);
                break;
            case Directions.LEFT:
                this.body.setVelocityX(-this.speed);
                break;
            case Directions.RIGHT:
                this.body.setVelocityX(this.speed);
                break;
        }
    }

    verifyWorldBounds(object){
        const choiceDirections = ["UP", "DOWN", "RIGHT", "LEFT"];
        const random = Math.floor(Math.random() * choiceDirections.length);
        console.log(random, choiceDirections[random]);
        this.direction = Directions[choiceDirections[random]]
    }
}

export default Enemy;