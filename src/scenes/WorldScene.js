import Phaser from '../lib/phaser.js'
import Bullet from '../game/Bullet.js'
import Enemy from '../game/Enemy.js'
import Player from '../game/Player.js'
import {createPlayerAnimations} from '../animations/playerAnimations.js'
import {createEnemyAnimations} from '../animations/enemyAnimations.js'

class WorldScene extends Phaser.Scene{
    constructor(){
        super('WorldScene');
    }

    preload(){

    }

    create(){
        // --------- MAP
        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('spritesheet', 'tiles',16,16,1,2);
        var grass = map.createStaticLayer('Grass', tiles, 0, 0);
        var obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
        obstacles.setCollisionByExclusion([-1]);    
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        
        // --------- ENEMY
        createEnemyAnimations(this.anims);
        this.enemies = this.physics.add.group({
            classType: Enemy,
            createCallback:(goEnemy)=>{
                goEnemy.body.onWorldBounds = true;
                goEnemy.setCollideWorldBounds(true);
            }
        });
        this.enemy = this.enemies.get(250, 100, 'player', 21);
        this.enemy2 = this.enemies.get(200, 150, 'player', 21);
        
        // --------- PLAYER
        createPlayerAnimations(this.anims);
        this.players = this.physics.add.group({
            classType: Player,
            createCallback:(player)=>{
                // player.body.onWorldBounds = true;
                player.setCollideWorldBounds(true);
            }
        });
        this.player = this.players.get(50, 100, 'player', 2);
        this.dropItemSprite = this.physics.add.sprite(100, 100, 'things', 9);
        // --------- PLAYER CAMERA
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; 
        
        // --------- COLLISIONS
        // --------- PLAYER COLLISIONS
        this.physics.add.collider(this.player, obstacles);

        // --------- TEST AREA AROUND
        this.ball = this.add.sprite();
        this.group = this.add.group({key:'things', frameQuantity: 1, frame:9});
        this.circle = new Phaser.Geom.Circle(this.player.x,this.player.y,20); 
        Phaser.Actions.PlaceOnCircle(this.group.getChildren(), this.circle);
        this.tween = this.tweens.addCounter({
            from: 20,
            to: 0,
            duration: 3000,
            delay: 2000,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });
        // console.dir(this.circle);
    }

    update(){
        Phaser.Actions.RotateAround(this.group.getChildren(), { x: this.player.x, y: this.player.y }, 0.02);
    }    

}

export default WorldScene;