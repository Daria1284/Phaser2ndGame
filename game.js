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
    this.load.spritesheet('dude1', 'assets/enemy.png', { frameWidth: 32, frameHeight: 48 }); // Завантаження спрайту гравця
    this.load.image('fon1', 'assets/fon+.jpg'); // Завантаження зображення неба
    this.load.image('stone', 'assets/stone.png'); // Завантаження зображення каміння
    this.load.image('tree', 'assets/tree.png'); // Завантаження зображення дерева
    this.load.image('bush', 'assets/bush.png'); // Завантаження зображення куща
}
// Константа, щоб визначити ширину фону
//const WORLD_WIDTH = 5000; // Змінено ширину світу для відображення додаткової платформи

/// Створення гри
function create() {
    //Створюємо фон з плиткою
    this.add.tileSprite(0,0,worldWidth,1080,'fon1').setOrigin(0,0);
    // Додавання зображення неба і встановлення розміру на весь екран
   // this.add.image(500, 500, 'sky').setDisplaySize(WORLD_WIDTH, 1000);

    // Створення платформ
    platforms = this.physics.add.staticGroup();
    //Додаємо землю на всю ширинуекрану
    for(var x = 0; x<worldWidth; x=x+800){
        console.log(x)
        platforms.create(x,1080-120,'ground').setOrigin(0,0).refreshBody();
    }

    // Розташовуємо першу платформу з самого низу екрану
    //platforms.create(700, 1100, 'ground').setScale(2).refreshBody();

    // Розташовуємо другу платформу далі вправо, за межами екрану
   // platforms.create(2200, 1100, 'ground').setScale(2).refreshBody(); // Додано другу платформу
    platforms.create(700, 800, 'ground1').setScale(2).refreshBody();
     platforms.create(1000, 600, 'ground1').setScale(2).refreshBody();
    platforms.create(1500, 800, 'ground1').setScale(2).refreshBody();
    platforms.create(2000, 650, 'ground1').setScale(2).refreshBody();
     platforms.create(2600, 550, 'ground1').setScale(2).refreshBody();

    // Додавання зображення house на першу платформу
    this.add.image(100, 900, 'house');

    // Створення гравця
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(false); // Вимкнення обмежень за межами світу гри
    // Створення гравця 2
    player1 = this.physics.add.sprite(100, 450, 'dude1');
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
 stones = this.physics.add.staticGroup();
 //Додаємо каміння на всю ширину екрану
 for(var x = 400; x<worldWidth; x=x+Phaser.Math.FloatBetween(900, 800)){
     console.log('stone x-'+ x)
     stones.create(x,1080-120,'stone').setOrigin(0,1).refreshBody();
 }
 //Колізія гравця з камінням
 this.physics.add.collider(player, stones);


// Створення платформ
trees = this.physics.add.staticGroup();
//Додаємо дерев на всю ширину екрану
for(var x = 700; x<worldWidth; x=x+Phaser.Math.FloatBetween(2000, 800)){
    console.log('x-'+ x)
    trees.create(x,1080-120,'tree').setOrigin(0,1).refreshBody();
}

// Створення платформ
bushes = this.physics.add.staticGroup();
//Додаємо кущів на всю ширину екрану
for(var x = 900; x<worldWidth; x=x+Phaser.Math.FloatBetween(1500, 800)){
    console.log(' x-'+ x)
    bushes.create(x,1080-120,'bush').setOrigin(0,1).refreshBody();
}
    // Створення та розміщення зображення "star" на верхніх платформах
    const stars = this.physics.add.group({
        key: 'star',
        repeat: 40,
         // Кількість зірок 
        setXY: { x: 250, y: 50, stepX: 70 } // Відстань між зірками 
    });


    // Налаштування властивостей зірок
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Колізія зірок з платформами
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
}

// Функція для обробки колізії зірок та гравця
function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);


}



// Оновлення гри
function update() {
    // Оновлення фону, якщо гравець дійшов до межі екрану
    if (player.x >= this.cameras.main.worldView.right) {
        this.add.image(this.cameras.main.worldView.right + 500, 500, 'sky').setDisplaySize(WORLD_WIDTH, 1000);
    }
   // Додайте логіку колізії гравця з каменями
   this.physics.world.collide(player, stones, function(player, stone) {
    // Перевірка, чи гравець "на платформі" (за умови, що камінь не рухається вгору)
    if (player.body.y < stone.body.y && player.body.y + player.body.height < stone.body.y + stone.body.height) {
        player.setVelocityY(0);
        player.setPosition(player.x, stone.body.y - player.body.height);
    }
});
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