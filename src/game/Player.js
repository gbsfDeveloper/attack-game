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
        this.hit = 0;
        this.lookAt = Directions.DOWN;
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keyZ = scene.input.keyboard.on('keydown-Z', ()=>{this.shoot(this, this.lookAt, scene)}, this);
        this.bullets = scene.physics.add.group({
            classType: Bullet
        });
        scene.physics.add.collider(scene.enemies, this,this.damageToPlayer,undefined,this);
    }

    preUpdate(t, dt){
        // console.log(this.x);
        super.preUpdate(t, dt);
        
        if(this.hit >0){
            ++this.hit;
            if(this.hit>10){
                this.hit = 0;
            }
            return
        }

        this.body.setVelocity(0);
        // Horizontal movement
        if (this.cursors.left.isDown && !this.cursors.right.isDown)
        {
            this.body.setVelocityX(-80);
        }
        if (this.cursors.right.isDown && !this.cursors.left.isDown)
        {
            this.body.setVelocityX(80);
        }
        // Vertical movement
        if (this.cursors.up.isDown && !this.cursors.down.isDown)
        {
            this.body.setVelocityY(-80);
        }
        if (this.cursors.down.isDown && !this.cursors.up.isDown)
        {
            this.body.setVelocityY(80);
        }        

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown && !this.cursors.right.isDown)
        {
            this.setLookAt('left');
            this.anims.play('left', true);
            this.flipX = true;
        }
        else if (this.cursors.right.isDown && !this.cursors.left.isDown)
        {
            this.setLookAt('right');
            this.anims.play('right', true);
            this.flipX = false;
        }
        else if (this.cursors.up.isDown && !this.cursors.down.isDown)
        {
            this.setLookAt('up');
            this.anims.play('up', true);
        }
        else if (this.cursors.down.isDown && !this.cursors.up.isDown)
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

    damageToPlayer(obj1, obj2){
        const enemy = obj2;
        
        const dx = this.x - enemy.x;
        const dy = this.y - enemy.y;
        const dir = new Phaser.Math.Vector2(dx,dy).normalize().scale(100);
        this.body.setVelocity(dir.x, dir.y);
        this.hit = 1;
        // console.log("Lo toque");
        // console.dir(obj1);
        // console.dir(obj2);
    }
    update(){
        console.log("xDDDD");
    }
}

export default Player;