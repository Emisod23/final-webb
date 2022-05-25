class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // säg åt phaser att lägga till /assets i alla paths
        this.load.setBaseURL('/assets');
        this.load.image('background', '/images/background.PNG');
        this.load.image('spike', '/images/spike.png');
        this.load.atlas(
            'player',
            '/images/Hero.png',
            '/images/Hero.json'
        );
        this.load.atlas(
            'foe',
            '/images/jefrens_foe.png',
            '/images/jefrens_foe.json'
        );
        this.load.image('tiles', '/tilesets/iceblock.png');
        this.load.image('snowflakesmall', '/images/snowflakesmall.png');
        this.load.spritesheet('mat', '/images/mat.png', { frameWidth: 64, frameHeight: 64 }, );
        // här laddar vi in en tilemap med spelets "karta"
        this.load.tilemapTiledJSON('map', '/tilemaps/winter.json');
    }

    create() {
        this.scene.start('PlayScene');
    }
}

export default PreloadScene;