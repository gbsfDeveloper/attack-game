import Phaser from '../lib/phaser.js'
import Bullet from '../game/Bullet.js'

class WorldScene extends Phaser.Scene{

    constructor(){
        super('WorldScene');
    }

    preload(){

    }

    create(){
        // create the map
        this.playerLookAt = 'down';


        var map = this.make.tilemap({ key: 'map' });
                
        // first parameter is the name of the tilemap in tiled
        var tiles = map.addTilesetImage('spritesheet', 'tiles',16,16,1,2);

        // creating the layers
        var grass = map.createStaticLayer('Grass', tiles, 0, 0);
        var obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);

        // make all tiles in obstacles collidable
        obstacles.setCollisionByExclusion([-1]);

        //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13]}),
            frameRate: 10,
            repeat: -1
        });

        // animation with key 'right'
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { frames: [2, 8, 2, 14]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 6, 0, 12 ] }),
            frameRate: 10,
            repeat: -1
        });        

        // our player sprite created through the phycis system
        this.player = this.physics.add.sprite(50, 100, 'player', 0);
        this.dropItemSprite = this.physics.add.sprite(100, 100, 'things', 9);

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

        // where the enemies will be
        // this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        // for(var i = 0; i < 30; i++) {
        //     var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        //     var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
        //     // parameters are x, y, width, height
        //     this.spawns.create(x, y, 20, 20);            
        // }        
        // add collider
        // this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
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
        console.log(lookAt);
        console.log("HE disparado");
        let y = "";
        let x = "";
        if(lookAt === 'right'){
             y = sprite.y;
             x = sprite.x + sprite.displayHeight;
        }
        else if(lookAt === 'left'){
             y = sprite.y;
             x = sprite.x - sprite.displayHeight;
        }
        else if(lookAt === 'up'){
             x = sprite.x;
             y = sprite.y - sprite.displayHeight;
        }
        else if(lookAt === 'down'){
             x = sprite.x;
             y = sprite.y + sprite.displayHeight;
        }

        const bullet = this.bullets.get(x, y, 'things', 9);
        bullet.setActive(true);
        bullet.setVisible(true);
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