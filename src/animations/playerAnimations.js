import Phaser from '../lib/phaser.js'

export const createPlayerAnimations = (anims) =>{
    anims.create({
        key: 'left',
        frames: anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13]}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'right',
        frames: anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'up',
        frames: anims.generateFrameNumbers('player', { frames: [2, 8, 2, 14]}),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'down',
        frames: anims.generateFrameNumbers('player', { frames: [ 0, 6, 0, 12 ] }),
        frameRate: 10,
        repeat: -1
    });    
}