var fondojuego;
var nave;
var cursores;
var balas;
var tiempoBala = 0;
var botonDisparo;

var enemigos;

var soundtrack;
var sonido;
var explosion;

var juego = new Phaser.Game(370, 550, Phaser.CANVAS, 'bloque_juego');

var estadoPrincipal = {
    preload: function () {
        //carga todos los recursos
        juego.load.image('fondo', 'img/bg.jpg');
        juego.load.image('personaje', 'img/nave.png');
        juego.load.image('laser', 'img/laser.png');
        juego.load.image('enemigo', 'img/ovni.png');

        this.load.audio('sonido', 'audio/laser.mp3');
        this.load.audio('ost', 'audio/contra.mp3');
    },

    create: function () {
        //mostrar pantalla
        fondoJuego = juego.add.tileSprite(0, 0, 370, 550, 'fondo');
        nave = juego.add.sprite(juego.width / 2, 500, 'personaje');
        nave.anchor.setTo(0.5);

        cursores = juego.input.keyboard.createCursorKeys();
        botonDisparo = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        balas = juego.add.group();
        balas.enableBody = true;
        balas.physicsBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(20, 'laser');
        balas.setAll('anchor.x', 0.5);
        balas.setAll('anchor.y', 1);
        balas.setAll('outOfBoundsKill', true);
        balas.setAll('checkWorldBounds', true);

        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;

        //crear enemigos y mostrarlos en la pantalla
        for (var y = 0; y < 6; y++) {
            for (var x = 0; x < 7; x++) {
                var enemigo = enemigos.create(x * 40, y * 20, 'enemigo');
                enemigo.anchor.setTo(0.5);
            }
        }

        enemigos.x = 50;
        enemigos.y = 30;

        var animacion = juego.add.tween(enemigos).to({ x: 100 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        juego.physics.startSystem(Phaser.Physics.ARCADE);
        juego.physics.arcade.enable(nave);
        nave.body.collideWorldBounds = true;


        this.sonido = this.sound.add('sonido');
        this.soundtrack = this.sound.add('ost');
        this.soundtrack.loop = true;
        this.soundtrack.play();
    },

    update: function () {
        //animacion del juego
        fondoJuego.tilePosition.x -= 3;


        if (cursores.right.isDown) {
            nave.position.x += 3;
        }
        else if (cursores.left.isDown) {
            nave.position.x -= 3;
        }
        else if (cursores.up.isDown) {
            nave.position.y -= 3;
        }
        else if (cursores.down.isDown) {
            nave.position.y += 3;
        }

        var bala;
        if (botonDisparo.isDown) {
            this.sonido.play();

            if (juego.time.now > tiempoBala) {
                bala = balas.getFirstExists(false);
            }
            if (bala) {
                bala.reset(nave.x, nave.y);
                bala.body.velocity.y = -300;
                tiempoBala = juego.time.now + 100;
            }
        }

        //colision de enemigos
        juego.physics.arcade.overlap(balas, enemigos, colision, null, this);
    }
};

function colision(bala, enemigo) {

    bala.kill();
    enemigo.kill();
}

juego.state.add('principal', estadoPrincipal);
juego.state.start('principal');