import Phaser from '../lib/phaser.js'

const  Directions = {
    IDLE:"IDLE",
    UP:"UP",
    DOWN:"DOWN",
    LEFT:"LEFT",
    RIGHT:"RIGHT",
}
class EnemyPFM extends Phaser.Physics.Arcade.Sprite
{
    direction = Directions.IDLE;
    SPEED = 30;

    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        this.setScale(1);
        // scene.physics.world.on('worldbounds', this.attackPlayer, this);
        // scene.time.addEvent({
        //     delay:2000,
        //     callback:()=>{this.attackPlayer()},
        //     callbackScope:this,
        //     loop:true
        // });
        this.followPlayer = false;
        // Detection of player
        this.detection = new Phaser.Geom.Circle(this.x,this.y,50);
        this.graphics = scene.add.graphics({ fillStyle: { color: 0xff0000 , alpha:0.2}});
    }

    preUpdate(t, dt){
        super.preUpdate(t, dt);

        switch(this.direction){
            case Directions.IDLE:
                // this.anims.play(`ENEMY${Directions.LEFT}`, true);
                this.body.setVelocityX(0);
                this.body.setVelocityY(0);
                break;
            case Directions.LEFT:
                this.anims.play(`ENEMY${Directions.LEFT}`, true);
                this.body.setVelocityX(-this.SPEED);
                this.flipX = true;
                break;
            case Directions.RIGHT:
                this.anims.play(`ENEMY${Directions.RIGHT}`, true);
                this.body.setVelocityX(this.SPEED);
                this.flipX = false;
                break;
            case Directions.UP:
                this.anims.play(`ENEMY${Directions.UP}`, true);
                this.body.setVelocityY(-this.SPEED);
                break;
            case Directions.DOWN:
                this.anims.play(`ENEMY${Directions.DOWN}`, true);
                this.body.setVelocityY(this.SPEED);
                break;
        }
        // Detection of player
        this.detection.setPosition(this.x, this.y);
        this.graphics.clear();
        this.graphics.fillCircleShape(this.detection);
    }

    seekPlayer = ( player, playerVision, scene ) =>{
        let seekPlayer = Phaser.Geom.Intersects.CircleToCircle(playerVision, this.detection);
        if(seekPlayer){
            this.enemyGeneratePath(player,scene);
        }
    }

    getWalkDirection(){
        return this.direction;
    }

    changeWalkDirection(DIRECTION){
        const choiceDirections = ["UP", "DOWN", "RIGHT", "LEFT"];
        const random = Math.floor(Math.random() * choiceDirections.length);
        // console.log(random, choiceDirections[random]);
        // this.direction = Directions[choiceDirections[DIRECTION]]
        this.direction = Directions[DIRECTION]
    }

    enemyGeneratePath = ( player, scene ) =>{
        var fromX = Math.floor(this.x/scene.map.tileWidth);
        var fromY = Math.floor(this.y/scene.map.tileWidth);
        var toX = Math.floor(player.x/scene.map.tileWidth);
        var toY = Math.floor(player.y/scene.map.tileWidth);
        // console.log('going from ('+fromX+','+fromY+') to ('+toX+','+toY+')');
        scene.finder.findPath(fromX, fromY, toX, toY, ( path ) => {
            if (path === null) {
                console.warn("Path was not found.");
            } else {
                this.enemyPathMove(path, scene);
            }
        });
        scene.finder.calculate();
    }

    enemyPathMove = ( path, scene ) =>{
        if(this.followPlayer === false){
            this.followPlayer = true;
            var tweens = [];
            for(var i = 0; i < path.length - 1; i++){
                var ex = path[i + 1].x;
                var ey = path[i + 1].y;
                tweens.push({
                    targets: this,
                    x: {value: ex * scene.map.tileWidth, duration: 400},
                    y: {value: ey * scene.map.tileHeight, duration: 400}
                });
            }
            let timeline = scene.tweens.timeline({
                tweens:tweens
            });
            timeline.on('complete', ()=>{
                this.followPlayer = false;
            });
        }

    }
}

export default EnemyPFM;