import Phaser from '../lib/phaser.js'

export const createEnemyAnimations = (anims) =>{
    anims.create({
        key: 'ENEMYLEFT',
        frames: anims.generateFrameNumbers('player', { frames: [22, 28, 22, 34]}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'ENEMYRIGHT',
        frames: anims.generateFrameNumbers('player', { frames: [22, 28, 22, 34] }),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'ENEMYUP',
        frames: anims.generateFrameNumbers('player', { frames: [23, 29, 23, 35]}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'ENEMYDOWN',
        frames: anims.generateFrameNumbers('player', { frames: [21, 27, 21, 33] }),
        frameRate: 10,
        repeat: -1
    });    
}