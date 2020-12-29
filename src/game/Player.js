import Phaser from '../lib/phaser.js'
import Bullet from '../game/Bullet.js'

/** @enum {string} */
const  Directions = {
    UP:"UP",
    DOWN:"DOWN",
    LEFT:"LEFT",
    RIGHT:"RIGHT",
}

class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        this.lookAt = Directions.DOWN;
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keyZ = scene.input.keyboard.on('keydown-Z', ()=>{this.shoot(this, this.lookAt, scene)}, this);
        this.bullets = scene.physics.add.group({
            classType: Bullet
        });
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt);
        this.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.body.setVelocityX(-80);
        }
        else if (this.cursors.right.isDown)
        {
            this.body.setVelocityX(80);
        }

        // Vertical movement
        if (this.cursors.up.isDown)
        {
            this.body.setVelocityY(-80);
        }
        else if (this.cursors.down.isDown)
        {
            this.body.setVelocityY(80);
        }        

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown)
        {
            this.setLookAt('left');
            this.anims.play('left', true);
            this.flipX = true;
        }
        else if (this.cursors.right.isDown)
        {
            this.setLookAt('right');
            this.anims.play('right', true);
            this.flipX = false;
        }
        else if (this.cursors.up.isDown)
        {
            this.setLookAt('up');
            this.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.setLookAt('down');
            this.anims.play('down', true);
        }
        else
        {
            this.anims.stop();
        }

    }

    shoot(sprite, lookAt, scene){
        // console.log(lookAt);
        // console.log("HE disparado");
        let y = "";
        let x = "";
        let bulletVelocityX = 0;
        let bulletVelocityY = 0;
        if(lookAt === 'right'){
            y = sprite.y;
            x = sprite.x + sprite.displayHeight;
            bulletVelocityX = 100;
            bulletVelocityY = 0;
            }
        else if(lookAt === 'left'){
            y = sprite.y;
            x = sprite.x - sprite.displayHeight;
            bulletVelocityX = -100;
            bulletVelocityY = 0;
        }
        else if(lookAt === 'up'){
            x = sprite.x;
            y = sprite.y - sprite.displayHeight;
            bulletVelocityX = 0;
            bulletVelocityY = -100;
        }
        else if(lookAt === 'down'){
            x = sprite.x;
            y = sprite.y + sprite.displayHeight;
            bulletVelocityX = 0;
            bulletVelocityY = 100;
        }

        const bullet = this.bullets.get(x, y, 'things', 9);
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.setVelocity(bulletVelocityX,bulletVelocityY);
        scene.add.existing(bullet);
        bullet.body.setSize(bullet.width, bullet.height);
        scene.physics.world.enable(bullet);
        return bullet;
    }

    setLookAt(lookAt){
        this.lookAt = lookAt; 
    }
}

export default Player;