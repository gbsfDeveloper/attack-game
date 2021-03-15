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
        this.map = this.make.tilemap({ key: 'map' });
        // console.log(map);
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
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; 
        
        // --------- COLLISIONS
        // --------- PLAYER COLLISIONS
        this.physics.add.collider(this.player, obstacles);

        // --------- TEST AREA AROUND
        this.group = this.add.group({key:'things', frameQuantity: 10, frame:60});
        this.circle = new Phaser.Geom.Circle(this.player.x,this.player.y,10); 
        Phaser.Actions.PlaceOnCircle(this.group.getChildren(), this.circle);

        this.groupEnemy = this.add.group({key:'things', frameQuantity: 10, frame:60});
        this.circleEnemy = new Phaser.Geom.Circle(this.enemy.x,this.enemy.y,50); 
        Phaser.Actions.PlaceOnCircle(this.groupEnemy.getChildren(), this.circleEnemy);

        this.tween = this.tweens.addCounter({
            from: 20,
            to: 0,
            duration: 3000,
            delay: 2000,
            ease: 'Sine.easeInOut',
            repeat: -1,
            // yoyo: true
        });

        const graphics = new Phaser.GameObjects.Graphics(this);
        graphics.lineStyle(5, 0xFF00FF, 1.0);
        graphics.fillStyle(0xFFFFFF, 1.0);
        graphics.fillCircle(this.player.x,this.player.y,10);
        graphics.strokeRect(this.player.x,this.player.y,10);
        // console.dir(this.circle);
        graphics.lineStyle(5, 0xFF00FF, 1.0);
        graphics.fillStyle(0xFFFFFF, 1.0);
        graphics.fillRect(50, 50, 400, 200);
        graphics.strokeRect(50, 50, 400, 200);

        graphics.lineStyle(5, 0xFF00FF, 1.0);
        graphics.beginPath();
        graphics.moveTo(100, 100);
        graphics.lineTo(200, 200);
        graphics.closePath();
        graphics.strokePath();

    }
    getTileID(x,y){
        var tile = this.map.getTileAt(x, y, true);
        return tile.index;
    };
    update(){
        // ---------COLLISIONS BETWEEN PLAYER  ENEMIES
        let verifyIfEnemy = Phaser.Geom.Intersects.CircleToCircle(this.circle, this.circleEnemy)
        if(verifyIfEnemy){
            console.log("Lo toque");
            this.enemyGeneratePath(this.enemy,this.player);
            // this.enemy.changeWalkDirection("LEFT");
        }
        this.circle.setPosition(this.player.x, this.player.y);
        this.circleEnemy.setPosition(this.enemy.x, this.enemy.y);
        Phaser.Actions.PlaceOnCircle(this.group.getChildren(), this.circle);
        Phaser.Actions.PlaceOnCircle(this.groupEnemy.getChildren(), this.circleEnemy);
        // Phaser.Actions.RotateAround(this.group.getChildren(), { x: this.circle.x, y: this.circle.y }, 0.02);
    }    

    enemyGeneratePath = (enemy,player) =>{
        var fromX = Math.floor(enemy.x/32);
        var fromY = Math.floor(enemy.y/32);
        var toX = Math.floor(player.x/32);
        var toY = Math.floor(player.y/32);
        console.log('going from ('+fromX+','+fromY+') to ('+toX+','+toY+')');

        this.finder.findPath(fromX, fromY, toX, toY, ( path ) => {
            // console.warn(path);
            if (path === null) {
                console.warn("Path was not found.");
            } else {
                // console.log(path);
                this.enemyPathMove(enemy, path);
            }
        });
        this.finder.calculate(); // don't forget, otherwise nothing happens
    }

    enemyPathMove = (enemy, path) =>{
        console.log(path);
        var tweens = [];
        for(var i = 0; i < path.length-1; i++){
            var ex = path[i+1].x;
            var ey = path[i+1].y;
            tweens.push({
                targets: enemy,
                x: {value: ex * this.map.tileWidth, duration: 200},
                y: {value: ey * this.map.tileHeight, duration: 200}
            });
        }
    
        this.tweens.timeline({
            tweens: tweens
        });
    }
}

export default WorldScene;