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
        let NoEnemies = Phaser.Math.Between(1, 5);
       
        this.enemyList = [];
        for (let i = 0; i <= NoEnemies; i++) {
            let RNDX = Phaser.Math.Between(50, 300);
            let RDXY = Phaser.Math.Between(50, 200);
            this.enemyList.push({x:RNDX,y: RDXY,key: 'player',frame: 21})
        } 
        // Se crean las instacias de enemigos
        this.allEnemies = this.enemyList.map((enemy)=>{
            return this.enemies.get(enemy.x, enemy.y, enemy.key, enemy.frame);
        })
        
        // ---------- TOUCH CONTROLS
        // this.touch_up = this.physics.add.sprite(50, 175, 'touch_up');
        // this.touch_up.setScale(0.4);
        // this.touch_up.setScrollFactor(0,0);
        // this.touch_down = this.physics.add.sprite(50, 215, 'touch_down');
        // this.touch_down.setScale(0.4);
        // this.touch_down.setScrollFactor(0,0);
        // this.touch_right = this.physics.add.sprite(70, 195, 'touch_right');
        // this.touch_right.setScale(0.4);
        // this.touch_right.setScrollFactor(0,0);
        // this.touch_left = this.physics.add.sprite(30, 195, 'touch_left');
        // this.touch_left.setScale(0.4);
        // this.touch_left.setScrollFactor(0,0);
        // this.touch_a = this.physics.add.sprite(250, 195, 'touch_a');
        // this.touch_a.setScale(0.4);
        // this.touch_a.setScrollFactor(0,0);
        // this.touch_b = this.physics.add.sprite(290, 195, 'touch_b');
        // this.touch_b.setScale(0.4);
        // this.touch_b.setScrollFactor(0,0);
        
        // // -------- TOUCH EVENTS
        // this.touch_up.setInteractive().on('pointerup', function(pointer, localX, localY, event){
        //     console.log("UP");
        // });
        // this.touch_down.setInteractive().on('pointerup', function(pointer, localX, localY, event){
        //     console.log("DOWN");
        // });
        // this.touch_right.setInteractive().on('pointerup', function(pointer, localX, localY, event){
        //     console.log("RIGHT");
        // });
        // this.touch_left.setInteractive().on('pointerup', function(pointer, localX, localY, event){
        //     console.log("LEFT");
        // });
        // this.touch_a.setInteractive().on('pointerup', function(pointer, localX, localY, event){
        //     console.log("A");
        // });
        // this.touch_b.setInteractive().on('pointerup', function(pointer, localX, localY, event){
        //     console.log("B");
        // });
        
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