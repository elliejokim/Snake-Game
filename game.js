
kaboom({
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

layers(["background", "game"], "game");

let snake_body = [];
let snake_length = 3;
let current_direction;
let run_action = false;
let score = 0;
let level = 1;
let move_delay = 0.35;
const directions = { UP: "up", DOWN: "down", LEFT: "left", RIGHT: "right" };

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

function respawn_snake() {
    snake_body.forEach(segment => destroy(segment));
    snake_body = [];
    snake_length = 3;
    current_direction = directions.RIGHT;
    for (let i = 1; i <= snake_length; i++) {
        snake_body.push(add([
            sprite("snake-skin"),
            pos(40, 40 * i),
            area(),
            "snake"
        ]));
    }
}

function respawn_food() {
    const block_size = 40;
    let new_pos;
    do {
        new_pos = rand(vec2(1, 1), vec2(12, 12));
        new_pos.x = Math.floor(new_pos.x);
        new_pos.y = Math.floor(new_pos.y);
        new_pos = new_pos.scale(block_size);
    } while (
        new_pos.x <= block_size || new_pos.x >= 13 * block_size ||
        new_pos.y <= block_size || new_pos.y >= 12 * block_size
    );

    return add([
        sprite("coin"),
        pos(new_pos),
        area(),
        "food"
    ]);
}

function respawn_all() {
    run_action = false;
    wait(0.5, () => {
        score = 0;
        level = 1;
        move_delay = 0.35;
        respawn_snake();
        respawn_food();
        run_action = true;
    });
}

function startGame() {
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

    respawn_all();
}

keyPress("space", () => {
    destroy(startScreen);
    startGame();
});

