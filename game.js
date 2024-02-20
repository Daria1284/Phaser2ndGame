// Конфігурація гри
var config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 1000,
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

// Завантаження ресурсів
function preload() {
  this.load.image('sky', 'assets/sky.png'); // Завантаження зображення неба
  this.load.image('ground', 'assets/platform.png'); // Завантаження зображення платформи
  this.load.spritesheet('dude', 'assets/girl.png', { frameWidth: 32, frameHeight: 48 }); // Завантаження спрайту гравця
  this.load.image('house', 'assets/house.png'); // Завантаження зображення будинка
}

/// Створення гри
function create() {
  this.add.image(500, 500, 'sky').setDisplaySize(1000, 1000); // Додавання зображення неба і встановлення розміру на весь екран

  // Створення платформ
  platforms = this.physics.add.staticGroup();
  // Розташовуємо платформу з самого низу екрану
  platforms.create(700, 950, 'ground').setScale(2).refreshBody();

 // Додавання зображення house на платформу
 this.add.image(100, 760, 'house');

  // Створення гравця
  player = this.physics.add.sprite(100, 450, 'dude');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  // Колізія гравця з платформами
  this.physics.add.collider(player, platforms);
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
}

// Оновлення гри
function update() {
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
      player.setVelocityY(-330); // Пристріл вгору, тільки коли гравець на платформі
  }
}
