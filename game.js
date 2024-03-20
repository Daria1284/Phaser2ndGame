// Конфігурація гри
var config = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload, // Передзавантаження ресурсів
        create: create, // Створення гри
        update: update // Оновлення гри
    }
};

// Ініціалізація гри
var game = new Phaser.Game(config);
var score = 0; // Початковий рахунок гравця
var scoreText; // Текст рахунку
var canMove = true; // Змінна, що визначає, чи може гравець рухатися
var worldWidth = 9600;
var powers;
var life = 5;
// Функція для оновлення розмірів гри при зміні розмірів вікна браузера
window.addEventListener('resize', function () {
    game.scale.resize(window.innerWidth, window.innerHeight);
});

// Завантаження ресурсів
function preload() {
    this.load.image('sky', 'assets/sky.png'); // Завантаження зображення неба
    this.load.image('ground', 'assets/platform.png'); // Завантаження зображення платформи
    this.load.spritesheet('dude', 'assets/girl.png', { frameWidth: 32, frameHeight: 48 }); // Завантаження спрайту гравця
    this.load.image('house', 'assets/house.png'); // Завантаження зображення будинка
    this.load.image('ground1', 'assets/platform1.png'); // Завантаження зображення платформи
    this.load.image('star', 'assets/star.png'); // Завантаження зображення платформи
    this.load.spritesheet('enemy', 'assets/enemy.png', { frameWidth: 32, frameHeight: 48 }); // Завантаження спрайту гравця
    this.load.image('fon1', 'assets/fon+.jpg'); // Завантаження зображення неба
    this.load.image('stone', 'assets/stone.png'); // Завантаження зображення каміння
    this.load.image('tree', 'assets/tree.png'); // Завантаження зображення дерева
    this.load.image('bush', 'assets/bush.png'); // Завантаження зображення куща
    this.load.image('mushroom', 'assets/mushroom.png'); // Завантаження зображення куща
    this.load.image('platformStart', 'assets/platformStart.png'); // Завантаження зображення початкової платформи
    this.load.image('platformOne', 'assets/platformOne.png'); // Завантаження зображення середньої платформи
    this.load.image('platformFinish', 'assets/platformFinish.png'); // Завантаження зображення кінцевої платформи
    this.load.image('power', 'assets/power.png'); // Завантаження зображення життя
    this.load.image('bomb', 'assets/bomb.png'); // Завантаження зображення бомби
}
// Константа, щоб визначити ширину фону
//const WORLD_WIDTH = 5000; // Змінено ширину світу для відображення додаткової платформи

/// Створення гри
function create() {
    //Створюємо фон з плиткою
    this.add.tileSprite(0, 0, worldWidth, 1080, 'fon1').setOrigin(0, 0);


    // Створення платформ
    platforms = this.physics.add.staticGroup();
    //Додаємо землю на всю ширину екрану
    for (var x = 0; x < worldWidth; x = x + 120) {
        //console.log(x)
        platforms.create(x, 1080 - 120, 'ground').setOrigin(0, 0).refreshBody();
    }
    //Додавання верхніх платформ
    for (var x = 0; x < worldWidth; x = x + Phaser.Math.Between(600, 700)) {
        var y = Phaser.Math.FloatBetween(700, 93 * 8)

        platforms.create(x, y, 'platformStart');

        var i;
        for (i = 1; i < Phaser.Math.Between(0, 5); i++) {
            platforms.create(x + 128 * i, y, 'platformOne');
        }
        platforms.create(x + 128 * i, y, 'platformFinish');
    }


    // Додавання зображення house на першу платформу
    this.add.image(100, 900, 'house');

    // Створення гравця
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(false); // Вимкнення обмежень за межами світу гри
    player.setDepth(5);

    // Створення гравця 2
    player1 = this.physics.add.sprite(500, 500, 'enemy');
    player1.setBounce(0.2);
    player1.setCollideWorldBounds(false); // Вимкнення обмежень за межами світу гри

    // Колізія гравця з платформами
    this.physics.add.collider(player, platforms);
    cursors = this.input.keyboard.createCursorKeys();
    // Колізія гравця з платформами
    this.physics.add.collider(player1, platforms);
    cursors = this.input.keyboard.createCursorKeys();

    // Налаштування анімацій гравця
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

     // Налаштування анімацій гравця


    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // Налаштування камери
    this.cameras.main.setBounds(0, 0, worldWidth, window.innerHeight);
    this.physics.world.setBounds(0, 0, worldWidth, window.innerHeight);

    // Слідкування камери за гравцем
    this.cameras.main.startFollow(player);

    // Створення платформ
    mushrooms = this.physics.add.staticGroup();
    //Додаємо грибочки на всю ширину екрану
    for (var x = 870; x < worldWidth; x = x + Phaser.Math.FloatBetween(1500, 800)) {
        // console.log(' x-'+ x)
        mushrooms.create(x, 1080 - 120, 'mushroom').setOrigin(0, 1).setDepth(Phaser.Math.FloatBetween(0, 10)).refreshBody();
    }


    // Створення платформ
    stones = this.physics.add.staticGroup();
    //Додаємо каміння на всю ширину екрану
    for (var x = 400; x < worldWidth; x = x + Phaser.Math.FloatBetween(900, 800)) {
        // console.log('stone x-'+ x)
        stones.create(x, 1080 - 120, 'stone').setOrigin(0, 1).refreshBody();
    }
    //Колізія гравця з камінням
    this.physics.add.collider(player, stones);


    // Створення платформ
    trees = this.physics.add.staticGroup();
    //Додаємо дерев на всю ширину екрану
    for (var x = 700; x < worldWidth; x = x + Phaser.Math.FloatBetween(2000, 800)) {
        // console.log('x-'+ x)
        trees.create(x, 1080 - 120, 'tree').setOrigin(0, 1).refreshBody();
    }

    // Створення платформ
    bushes = this.physics.add.staticGroup();
    //Додаємо кущів на всю ширину екрану
    for (var x = 900; x < worldWidth; x = x + Phaser.Math.FloatBetween(1500, 800)) {
        //console.log(' x-'+ x)
        bushes.create(x, 1080 - 120, 'bush').setOrigin(0, 1).setDepth(5).refreshBody();
    }
    powers = this.physics.add.group({
        key: 'power',
        repeat: 5,
        setXY: { x: 2000, y: 50, stepX: 1500 }
    });

    powers.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setGravityY(300);
    });

    this.physics.add.collider(stones, powers); // Колізія каменів з power
    this.physics.add.collider(powers, platforms);
    this.physics.add.overlap(player, powers, collectPower, null, this);

    // Функція для обробки колізії з елементами "power"
    function collectPower(player, power) {
        power.disableBody(true, true);

        if (canMove) {
            // Збільшення "Live" при збиранні елементів
            life += 1;
            liveText.setText(showLife()); // Оновлення тексту "Live"
        }
    }

    // Створення тексту "Live"
    liveText = this.add.text(window.innerWidth - 16, 16, showLife(), { fontSize: '40px', fill: '#000' }).setOrigin(1, 0).setScrollFactor(0);

    // Створення та розміщення зображення "star" на верхніх платформах
    const stars = this.physics.add.group({
        key: 'star',
        repeat: 100,
        // Кількість зірок 
        setXY: { x: 250, y: 50, stepX: 70 } // Відстань між зірками 
    });


    // Налаштування властивостей зірок
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setGravityY(300); // Додаємо гравітацію для падіння зірок
    });
    this.physics.add.collider(stones, stars); // Колізія каменів з зірками
    // Колізія зірок з платформами
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' }).setOrigin(0, 0).setScrollFactor(0);

    function collectStar(player, star) {
        star.disableBody(true, true);
    
        //  Add and update the score
        score += 10;
        scoreText.setText('Score: ' + score);
        timerOn = true;
        if (stars.countActive(true) === 0) {
            //  A new batch of stars to collect
            stars.children.iterate(function (child) {
    
                child.enableBody(true, child.x, 0, true, true);
    
            });
    
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    
    
        }
    }
    //Додаємо бомби
    //bombs = this.physics.add.group();
 bombs = this.physics.add.group({
        key: 'bomb',
        repeat: 50,
        setXY: { x: 250, y: 350, stepX: 100 }
    });

    bombs.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        .setBounce(0.999)
        .setCollideWorldBounds(true)
        .setVelocity(Phaser.Math.Between(-200, 200), 100)

    });
    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    //  this.physics.add.collider(vorog, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    // this.physics.add.collider(player, vorog, hitBomb, null, this);
}



// Оновлення гри
function update() {
    // Оновлення фону, якщо гравець дійшов до межі екрану
    if (player.x >= this.cameras.main.worldView.right) {
        this.add.image(this.cameras.main.worldView.right + 500, 500, 'sky').setDisplaySize(WORLD_WIDTH, 1080);
    }

    // Додайте логіку колізії гравця з каменями
    this.physics.world.collide(player, stones, function (player, stone) {
        // Перевірка, чи гравець "на платформі" (за умови, що камінь не рухається вгору)
        if (player.body.y < stone.body.y && player.body.y + player.body.height < stone.body.y + stone.body.height) {
            player.setVelocityY(0);
            player.setPosition(player.x, stone.body.y - player.body.height);
        }
    });
    // Рух гравця dude1 вправо
    player1.setVelocityX(160); // Встановлюємо горизонтальну швидкість вправо

    // Опційно: якщо потрібно, ви можете також додати анімацію для гравця dude1
    //player1.anims.play('right', true);
    // Перевірка, чи гравець може рухатися
    if (canMove) {
        if (cursors.left.isDown) {
            player.setVelocityX(-160); // Рух вліво
            player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160); // Рух вправо
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0); // Зупинка гравця
            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-380); // Пристріл вгору, тільки коли гравець на платформі
        }
    }

}
function hitBomb(player, bomb) {
    life -= 1;
    liveText.setText(showLife());
    player.anims.play('turn');
    if (life === 0) {
        canMove = false; // Зупинка можливості рухатися гравця
        player.setVelocityX(0); // Зупинка руху по горизонталі
        player.setVelocityY(0); // Зупинка руху по вертикалі
        player.anims.stop(); // Зупинка анімації гравця
    }
}

function refreshBody() {
    console.log('game over')
    this.scene.restart();
};
// Функція для відображення кількості життів
function showLife() {
    var lifeLine = 'Life:';
    for (var i = 0; i < life; i++) {
        lifeLine += '💕';
    }
    return lifeLine;
}