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
        
        // --------- PLAYER
        createPlayerAnimations(this.anims);
        this.players = this.physics.add.group({
            classType: Player
        });
        this.player = this.players.get(50, 100, 'player', 2);
        this.player.setCollideWorldBounds(true);
        this.dropItemSprite = this.physics.add.sprite(100, 100, 'things', 9);
        
        // --------- ENEMY
        createEnemyAnimations(this.anims);
        this.enemies = this.physics.add.group({
            classType: Enemy
        });
        this.enemy = this.enemies.get(50, 100, 'player', 21);
        this.enemy.body.onWorldBounds = true;
        this.enemy.setCollideWorldBounds(true);
        
        
        // limit camera to map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; 
        // don't walk on trees
        this.physics.add.collider(this.player, obstacles);
    }

    update(){
        
    }

    onMeetEnemy(player, zone){
        // we move the zone to some other location
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
        
        // shake the world
        // this.cameras.main.shake(300);
        
        // start battle 
    }
    
}

export default WorldScene;