// game.js

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
  x: 50,
  y: 50,
  width: 50,
  height: 50,
  speed: 5,
};

const backgroundImage = new Image();
backgroundImage.src = "assets/sky.jpg"; // Замініть шлях на ваш фоновий файл


function draw() {
  // Відображення фону
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

}