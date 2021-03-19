import Phaser from '../lib/phaser.js'
import Bullet from '../game/Bullet.js'
import Enemy from '../game/Enemy_PfM.js'
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
        this.map = this.make.tilemap({ key: 'map' });
        var tiles = this.map.addTilesetImage('tiles', 'tileset',16,16,1,2);
        var grass = this.map.createStaticLayer('floor', tiles, 0, 0);
        var obstacles = this.map.createStaticLayer('obstacles', tiles, 0, 0);
        obstacles.setCollisionByExclusion([-1]);    
        this.physics.world.bounds.width = this.map.widthInPixels;
        this.physics.world.bounds.height = this.map.heightInPixels;

        // ---------PATHFINDING
        this.finder = new EasyStar.js();
        var grid = [];
        for(var y = 0; y < this.map.height; y++){
            var col = [];
            for(var x = 0; x < this.map.width; x++){
                col.push(this.getTileID(x,y));
            }
            grid.push(col);
        }
        this.finder.setGrid(grid);
        this.finder.setAcceptableTiles([-1,0]);

        // --------- ENEMY
        createEnemyAnimations(this.anims);
        
        this.enemies = this.physics.add.group({
            classType: Enemy,
            createCallback:(goEnemy)=>{
                goEnemy.body.onWorldBounds = true;
                goEnemy.setCollideWorldBounds(true);
            }
        });
        // --------- Lista de posiciones de enemigos
        this.enemyList = [
            {x:150,y: 100,key: 'player',frame: 21},
            {x:350,y: 200,key: 'player',frame: 21},
            {x:250,y: 400,key: 'player',frame: 21},
            {x:250,y: 100,key: 'player',frame: 21},
            {x:300,y: 150,key: 'player',frame: 21},
            {x:400,y: 200,key: 'player',frame: 21}
        ]
        // Se crean las instacias de enemigos
        this.allEnemies = this.enemyList.map((enemy)=>{
            return this.enemies.get(enemy.x, enemy.y, enemy.key, enemy.frame);
        })
        
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
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; 
        // --------- PLAYER COLLISIONS
        this.physics.add.collider(this.player, obstacles);
    }

    getTileID(x,y){
        var tile = this.map.getTileAt(x, y, true);
        return tile.index;
    };

    update(){
        // ---------COLLISIONS BETWEEN PLAYER  ENEMIES
        this.allEnemies.map((enemy)=>{
            return enemy.seekPlayer(this.player,this.player.vision,this);
        });
    }    
}

export default WorldScene;