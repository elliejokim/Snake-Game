
import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

kaboom({ 
    background: [51, 151, 255],
    width: 800,
    height: 600,
    scale: 1,
    global: true,
});

loadSprite("snake-skin", "sprites/snake.png");
loadSprite("coin", "sprites/coin.png");
loadSprite("background", "sprites/background.png");
loadSprite("fence-top", "sprites/fence-top.png");
loadSprite("fence-bottom", "sprites/fence-bottom.png");
loadSprite("fence-left", "sprites/fence-left.png");
loadSprite("fence-right", "sprites/fence-right.png");
loadSprite("post-top-left", "sprites/post-top-left.png");
loadSprite("post-top-right", "sprites/post-top-right.png");
loadSprite("post-bottom-left", "sprites/post-bottom-left.png");
loadSprite("post-bottom-right", "sprites/post-bottom-right.png");

layers(["background", "game"], "game");

scene("game", () => {
    const directions = { UP: "up", DOWN: "down", LEFT: "left", RIGHT: "right" };
    let current_direction = directions.RIGHT;
    let run_action = false;
    let snake_length = 3;
    let snake_body = [];
    let score = 0;
    let level = 1;
    let move_delay = 0.35;
    const scoreToWin = 30;
    const block_size = 40;

    const scoreText = add([
        text("Score: 0", { size: 20 }),
        pos(580, 220),
        fixed()
    ]);

    const levelText = add([
        text("Level: 1", { size: 20 }),
        pos(580, 250),
        fixed()
    ]);

    // Game mechanics will go here
});

go("game");
