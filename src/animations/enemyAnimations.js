import Phaser from '../lib/phaser.js'

export const createEnemyAnimations = (anims) =>{
    anims.create({
        key: 'enemyleft',
        frames: anims.generateFrameNumbers('player', { frames: [21, 22, 21, 34]}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'enemyright',
        frames: anims.generateFrameNumbers('player', { frames: [22, 28, 22, 34] }),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'enemyup',
        frames: anims.generateFrameNumbers('player', { frames: [23, 29, 23, 35]}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'enemydown',
        frames: anims.generateFrameNumbers('player', { frames: [21, 27, 21, 33] }),
        frameRate: 10,
        repeat: -1
    });    
}