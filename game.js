
import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

const k = kaboom({ 
    background: [51, 151, 255],
    width: 800,
    height: 600,
    scale: 1,
    global: true,
});

loadSprite("snake-skin", "./sprites/snake.png");
loadSprite("coin", "./sprites/coin.png");
loadSprite("background", "./sprites/background.png");
loadSprite("fence-top", "./sprites/fence-top.png");
loadSprite("fence-bottom", "./sprites/fence-bottom.png");
loadSprite("fence-left", "./sprites/fence-left.png");
loadSprite("fence-right", "./sprites/fence-right.png");
loadSprite("post-top-left", "./sprites/post-top-left.png");
loadSprite("post-top-right", "./sprites/post-top-right.png");
loadSprite("post-bottom-left", "./sprites/post-bottom-left.png");
loadSprite("post-bottom-right", "./sprites/post-bottom-right.png");

k.layers(["background", "game"], "game");

// Initial Instructions screen
const startScreen = add([
    text(
        "SNAKE GAME\n\n▶ Click the screen and press SPACE to start.\n▶ Use arrow keys to move the snake.\n▶ Eat 5 coins to level up and move faster!\n▶ Avoid hitting walls or yourself!\n▶ Eat 30 coins to win!\n▶ Press P to Pause/Resume.",
        { size: 16, align: "left", width: 350, height: 400 }
    ),
    pos(10, 100),
    color(255, 255, 255),
    fixed(),
]);

keyPress("space", () => {
    destroy(startScreen);
    startGame();
});

function startGame() {
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

    const map = addLevel([
        "1tttttttttttt2",
        "l            r",
        "l            r",
        "l            r",
        "l            r",
        "l            r",
        "l            r",
        "l            r",
        "l            r",
        "l            r",
        "l            r",
        "l            r",
        "3bbbbbbbbbbbb4",
    ], {
        width: block_size,
        height: block_size,
        pos: vec2(0, 0),
        "t": () => [sprite("fence-top"), area(), "wall"],
        "b": () => [sprite("fence-bottom"), area(), "wall"],
        "l": () => [sprite("fence-left"), area(), "wall"],
        "r": () => [sprite("fence-right"), area(), "wall"],
        "1": () => [sprite("post-top-left"), area(), "wall"],
        "2": () => [sprite("post-top-right"), area(), "wall"],
        "3": () => [sprite("post-bottom-left"), area(), "wall"],
        "4": () => [sprite("post-bottom-right"), area(), "wall"],
    });

    // Game mechanics implementation
    respawn_all();
}

go("game");
