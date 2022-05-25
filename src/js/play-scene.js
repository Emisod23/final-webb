class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    create() {
        // variabel för att hålla koll på hur många gånger vi spikat oss själva
        this.spiked = 0;
        // ladda spelets bakgrundsbild, statisk
        // setOrigin behöver användas för att den ska ritas från top left
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.cameras.main.setSize(896, 448);
        this.cameras.main.setBounds(0, 0, 1536, 960);
        this.physics.world.setBounds(0, 0, 1536, 960);

        // skapa en tilemap från JSON filen vi preloadade
        const map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32});
        // ladda in tilesetbilden till vår tilemap
        const tileset = map.addTilesetImage('iceblock', 'tiles');

        // initiera animationer, detta är flyttat till en egen metod
        // för att göra create metoden mindre rörig
        this.initAnims();

        // keyboard cursors
        this.cursors = this.input.keyboard.createCursorKeys();
        this.bakgrund = map.createLayer('bakgrund', tileset);
        // Ladda lagret Platforms från tilemappen
        // och skapa dessa
        // sätt collisionen
        this.platforms = map.createLayer('plat', tileset);
        this.platforms.setCollisionByExclusion(-1, true);
        // platforms.setCollisionByProperty({ collides: true });
        // this.platforms.setCollisionFromCollisionGroup(
        //     true,
        //     true,
        //     this.platforms
        // );
        // platforms.setCollision(1, true, true);
        this.mat = this.physics.add.sprite(50, 100, 'mat').setImmovable(true).setFrame(2);
        this.mat.body.setAllowGravity(false);
        // skapa en spelare och ge den studs
        this.player = this.physics.add.sprite(50, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setCircle(32);

        // krocka med platforms lagret
        this.physics.add.collider(this.player, this.platforms);

        this.snow = this.physics.add.group({
        });
        this.physics.add.collider(this.platforms, this.snow, die, null, this);
        this.physics.add.overlap(this.player, this.snow, die2, null, this);
        function die(snow){
            snow.destroy();
        }
        function die2(player, snow){
            snow.destroy();
        }
        // krocka med platforms lagret
        // skapa en spelare och ge den studs
        this.physics.add.overlap(this.player, this.mat, this.collectMat, null, this);
        // skapa text på spelet, texten är tom
        // textens innehåll sätts med updateText() metoden
        this.text = this.add.text(16, 16, '', {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.text.setScrollFactor(0);
        this.updateText();

        // lägg till en keyboard input för W
        this.keyObj = this.input.keyboard.addKey('W', true, false);

        // exempel för att lyssna på events
        this.events.on('pause', function () {
            console.log('Play scene paused');
        });
        this.events.on('resume', function () {
            console.log('Play scene resumed');
        });
        this.cameras.main.startFollow(this.player);
    }

    // play scenens update metod
    update() {
        if(Math.random() > 0.8){
        var snowing = this.snow.create(Phaser.Math.FloatBetween(-10, 2000), -10, 'snowflakesmall').setVelocity(-20, 40);
        snowing.body.setAllowGravity(false);
    }
        this.snow.children.iterate(function(child){
            if(child != null){
                if (child.y > 900){
                    child.destroy();
                }
            }
        })
        // för pause
        if (this.keyObj.isDown) {
            // pausa nuvarande scen
            this.scene.pause();
            // starta menyscenene
            this.scene.launch('MenuScene');
        }

        // följande kod är från det tutorial ni gjort tidigare
        // Control the player with left or right keys
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else {
            // If no keys are pressed, the player keeps still
            this.player.setVelocityX(0);
            // Only show the idle animation if the player is footed
            // If this is not included, the player would look idle while jumping
            if (this.player.body.onFloor()) {
                this.player.play('idle', true);
            }
        }

        // Player can jump while walking any direction by pressing the space bar
        // or the 'UP' arrow
        if (
            (this.cursors.space.isDown || this.cursors.up.isDown) &&
            this.player.body.onFloor()
        ) {
            this.player.setVelocityY(-350);
            this.player.play('jump', true);
        }

        if (this.player.body.velocity.x > 0) {
            this.player.setFlipX(false);
        } else if (this.player.body.velocity.x < 0) {
            // otherwise, make them face the other side
            this.player.setFlipX(true);
        }
    }

    // metoden updateText för att uppdatera overlaytexten i spelet
    updateText() {
        this.text.setText(
            `Arrow keys to move. Space to jump. W to pause. Spiked: ${this.spiked}`
        );
    }

    // när spelaren landar på en spik, då körs följande metod
    playerHit(player, spike) {
        this.spiked++;
        player.setVelocity(0, 0);
        player.setX(50);
        player.setY(300);
        player.play('idle', true);
        let tw = this.tweens.add({
            targets: player,
            alpha: { start: 0, to: 1 },
            tint: { start: 0xff0000, to: 0xffffff },
            duration: 100,
            ease: 'Linear',
            repeat: 5
        });
        this.updateText();
    }

    collectMat(mat, player) {
        this.mat.disableBody(true, true);
    }

    // när vi skapar scenen så körs initAnims för att ladda spelarens animationer
    initAnims() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'WinterRun',
                start: 1,
                end: 6
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'WinterIdle',
                start: 1,
                end: 4
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'WinterJump',
                start: 1,
                end: 3
            }),
            frameRate: 5,
        });
    }
}

export default PlayScene;
