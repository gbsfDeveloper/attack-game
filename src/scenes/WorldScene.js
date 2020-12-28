import Phaser from '../lib/phaser.js'
import Bullet from '../game/Bullet.js'
import {createPlayerAnimations} from '../animations/playerAnimations.js'
import {createEnemyAnimations} from '../animations/enemyAnimations.js'

class WorldScene extends Phaser.Scene{

    constructor(){
        super('WorldScene');
    }

    preload(){

    }

    create(){
        // create the map
        
        var map = this.make.tilemap({ key: 'map' });
                
        // first parameter is the name of the tilemap in tiled
        var tiles = map.addTilesetImage('spritesheet', 'tiles',16,16,1,2);

        // creating the layers
        var grass = map.createStaticLayer('Grass', tiles, 0, 0);
        var obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);

        // make all tiles in obstacles collidable
        obstacles.setCollisionByExclusion([-1]);    

        // our player sprite created through the phycis system
        this.playerLookAt = 'down';
        createPlayerAnimations(this.anims);
        this.player = this.physics.add.sprite(50, 100, 'player', 0);
        this.dropItemSprite = this.physics.add.sprite(100, 100, 'things', 9);
        
        // Enemy
        this.enemy = this.physics.add.sprite(60, 110, 'player', 21);
        createEnemyAnimations(this.anims);
        this.enemy.anims.play('enemydown', true);

        // don't go out of the map
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);

        // don't walk on trees
        this.physics.add.collider(this.player, obstacles);

        // limit camera to map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; // avoid tile bleed

        // user input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyZ = this.input.keyboard.on('keydown-Z', ()=>{this.shoot(this.player, this.playerLookAt)}, this);

        this.bullets = this.physics.add.group({
            classType: Bullet
        });
    }

    update(){
        //    this.controls.update(delta);

        this.player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-80);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(80);
        }

        // Vertical movement
        if (this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-80);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.setVelocityY(80);
        }        

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown)
        {
            this.isLookAt('left');
            this.player.anims.play('left', true);
            this.player.flipX = true;
        }
        else if (this.cursors.right.isDown)
        {
            this.isLookAt('right');
            this.player.anims.play('right', true);
            this.player.flipX = false;
        }
        else if (this.cursors.up.isDown)
        {
            this.isLookAt('up');
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.isLookAt('down');
            this.player.anims.play('down', true);
        }
        else
        {
            this.player.anims.stop();
        }
    }

    onMeetEnemy(player, zone){
        // we move the zone to some other location
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
        
        // shake the world
        // this.cameras.main.shake(300);
        
        // start battle 
    }

    shoot(sprite, lookAt){
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
        this.add.existing(bullet);
        
        bullet.body.setSize(bullet.width, bullet.height);
        this.physics.world.enable(bullet);
        return bullet;
    }

    isLookAt(lookAt){
        this.playerLookAt = lookAt; 
    }
    
}

export default WorldScene;