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

    function respawn_snake() {
        snake_body.forEach(segment => destroy(segment));
        snake_body = [];
        snake_length = 3;
        current_direction = directions.RIGHT;
        for (let i = 1; i <= snake_length; i++) {
            snake_body.push(add([
                sprite("snake-skin"),
                pos(block_size, block_size * i),
                area(),
                "snake"
            ]));
        }
    }

    let food = null;

    function respawn_food() {
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
        if (food) destroy(food);
        food = add([
            sprite("coin"),
            pos(new_pos),
            area(),
            "food"
        ]);
    }

    function updateScore() {
        scoreText.text = `Score: ${score}`;
        if (score % 5 === 0 && score !== 0) {
            level++;
            levelText.text = `Level: ${level}`;
            move_delay = Math.max(0.1, move_delay - 0.04);
            add([
                text(`Level ${level}!`, { size: 24 }),
                pos(160, 240),
                lifespan(2)
            ]);
        }
        if (score >= scoreToWin) {
            run_action = false;
            add([
                text("🎉 You Win!\nRefresh to play again.", { size: 26 }),
                pos(100, 200)
            ]);
        }
    }

    function respawn_all() {
        run_action = false;
        wait(0.5, () => {
            score = 0;
            level = 1;
            move_delay = 0.35;
            updateScore();
            respawn_snake();
            respawn_food();
            run_action = true;
        });
    }

    respawn_all();

    collides("snake", "food", () => {
        snake_length++;
        score++;
        updateScore();
        respawn_food();
    });

    function gameOver() {
        run_action = false;
        shake(12);
        add([
            text("💀 Game Over!\nRefresh to try again.", { size: 26 }),
            pos(80, 220)
        ]);
    }

    collides("snake", "wall", gameOver);
    collides("snake", "snake", gameOver);

    keyPress("up", () => {
        if (current_direction !== directions.DOWN) current_direction = directions.UP;
    });
    keyPress("down", () => {
        if (current_direction !== directions.UP) current_direction = directions.DOWN;
    });
    keyPress("left", () => {
        if (current_direction !== directions.RIGHT) current_direction = directions.LEFT;
    });
    keyPress("right", () => {
        if (current_direction !== directions.LEFT) current_direction = directions.RIGHT;
    });

    let isPaused = false;

    keyPress("p", () => {
        isPaused = !isPaused;
        if (isPaused) {
            add([text("Paused", { size: 24 }), pos(150, 200)]);
        } else {
            destroyAll("text");
        }
    });

    let timer = 0;

    action(() => {
        if (isPaused || !run_action) return;
        timer += dt();
        if (timer < move_delay) return;
        timer = 0;

        let move_x = 0;
        let move_y = 0;

        switch (current_direction) {
            case directions.DOWN: move_y = block_size; break;
            case directions.UP: move_y = -block_size; break;
            case directions.LEFT: move_x = -block_size; break;
            case directions.RIGHT: move_x = block_size; break;
        }

        const head = snake_body[snake_body.length - 1];
        snake_body.push(add([
            sprite("snake-skin"),
            pos(head.pos.x + move_x, head.pos.y + move_y),
            area(),
            "snake"
        ]));

        if (snake_body.length > snake_length) {
            destroy(snake_body.shift());
        }
    });

    add([
        text(
            "INSTRUCTIONS:\n\n▶ Arrow keys: Move\n▶ Eat 5 coins to level up\n▶ Avoid walls and yourself\n▶ Eat 30 coins to win\n▶ Press P to Pause/Resume",
            { size: 14, width: 180 }
        ),
        pos(580, 60),
        color(255, 255, 255),
        fixed()
    ]);
}