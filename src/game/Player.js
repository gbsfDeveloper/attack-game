import Phaser from '../lib/phaser.js'
import Bullet from '../game/Bullet.js'
import Weapon from '../game/Weapon.js'

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
        this.scene = scene;
        this.hit = 0;
        this.lookAt = Directions.DOWN;
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keyX = scene.input.keyboard.on('keydown-X', ()=>{this.shoot(this, this.lookAt, scene)}, this);
        this.keyZ = scene.input.keyboard.on('keydown-Z', ()=>{this.attack(this, this.lookAt, scene)}, this);
        this.vision = new Phaser.Geom.Circle(this.x,this.y,10);
        this.bullets = scene.physics.add.group({
            classType: Bullet
        });
        this.weapons = scene.physics.add.group({
            classType: Weapon
        });
        
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt);

        if(this.scene.enemies != undefined){
            // Daño al tocarlo los proyectiles
            this.scene.physics.add.collider(this.scene.enemies, this,this.takeDamage,undefined,this);
        }

        if(this.hit >0){
            this.setTint(0xff0000);
            ++this.hit;
            if(this.hit>10){
                this.setTint(0xffffff);
                this.hit = 0;
                this.tintFill = false;
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
            this.anims.play('idleud', true);
            // this.anims.stop();
        }

        this.vision.setPosition(this.x, this.y);

    }

    attack(sprite, lookAt, scene){
        let y = "";
        let x = "";
        if(lookAt === 'right'){
            y = sprite.y;
            x = sprite.x + sprite.displayHeight / 2;
        }
        else if(lookAt === 'left'){
            y = sprite.y;
            x = sprite.x - sprite.displayHeight / 2;
        }
        else if(lookAt === 'up'){
            x = sprite.x;
            y = sprite.y - sprite.displayHeight / 2;
        }
        else if(lookAt === 'down'){
            x = sprite.x;
            y = sprite.y + sprite.displayHeight / 2;
        }
        const weapon = this.weapons.get(x, y, 'pj_items', 94);
        weapon.setActive(true);
        weapon.setVisible(true);
        if(lookAt === 'right'){
            weapon.setFlipX(false);
        }
        if(lookAt === 'left'){
            weapon.setFlipX(true);
        }
        if(lookAt === 'up'){
            weapon.setFlipY(false);
        }
        if(lookAt === 'down'){
            weapon.setFlipY(true);
        }
        scene.add.existing(weapon);
        weapon.body.setSize(weapon.width, weapon.height);
        scene.physics.world.enable(weapon);
        setTimeout(function(){ weapon.destroy() }, 100);
        return weapon;
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

    takeDamage(obj1, obj2){
        const enemy = obj2;
        const dx = this.x - enemy.x;
        const dy = this.y - enemy.y;
        const dir = new Phaser.Math.Vector2(dx,dy).normalize().scale(100);
        this.body.setVelocity(dir.x, dir.y);
        this.hit = 1;
        
    }
}

export default Player;