import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

const k = kaboom({ 
    background: [51, 151, 255],
    width: 800,
    height: 600,
    scale: 1,
    global: true,
});

k.loadSprite("snake-skin", "sprites/snake.png");
k.loadSprite("coin", "sprites/coin.png");
k.loadSprite("background", "sprites/background.png");
k.loadSprite("fence-top", "sprites/fence-top.png");
k.loadSprite("fence-bottom", "sprites/fence-bottom.png");
k.loadSprite("fence-left", "sprites/fence-left.png");
k.loadSprite("fence-right", "sprites/fence-right.png");
k.loadSprite("post-top-left", "sprites/post-top-left.png");
k.loadSprite("post-top-right", "sprites/post-top-right.png");
k.loadSprite("post-bottom-left", "sprites/post-bottom-left.png");
k.loadSprite("post-bottom-right", "sprites/post-bottom-right.png");

k.layers(["background", "game"], "game");

// Initial Instructions screen
const startScreen = k.add([
    k.text(
        "SNAKE GAME\n\n▶ Click the screen and press SPACE to start.\n▶ Use arrow keys to move the snake.\n▶ Eat 5 coins to level up and move faster!\n▶ Avoid hitting walls or yourself!\n▶ Eat 30 coins to win!\n▶ Press P to Pause/Resume.",
        { size: 16, align: "left", width: 350, height: 400 }
    ),
    k.pos(10, 100),
    k.color(255, 255, 255),
    k.fixed(),
]);

k.keyPress("space", () => {
    k.destroy(startScreen);
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

    const scoreText = k.add([
        k.text("Score: 0", { size: 20 }),
        k.pos(580, 220),
        k.fixed()
    ]);

    const levelText = k.add([
        k.text("Level: 1", { size: 20 }),
        k.pos(580, 250),
        k.fixed()
    ]);

    const map = k.addLevel([
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
        pos: k.vec2(0, 0),
        "t": () => [k.sprite("fence-top"), k.area(), "wall"],
        "b": () => [k.sprite("fence-bottom"), k.area(), "wall"],
        "l": () => [k.sprite("fence-left"), k.area(), "wall"],
        "r": () => [k.sprite("fence-right"), k.area(), "wall"],
        "1": () => [k.sprite("post-top-left"), k.area(), "wall"],
        "2": () => [k.sprite("post-top-right"), k.area(), "wall"],
        "3": () => [k.sprite("post-bottom-left"), k.area(), "wall"],
        "4": () => [k.sprite("post-bottom-right"), k.area(), "wall"],
    });

    function respawn_snake() {
        snake_body.forEach(segment => k.destroy(segment));
        snake_body = [];
        snake_length = 3;
        current_direction = directions.RIGHT;
        for (let i = 1; i <= snake_length; i++) {
            snake_body.push(k.add([
                k.sprite("snake-skin"),
                k.pos(block_size, block_size * i),
                k.area(),
                "snake"
            ]));
        }
    }

    let food = null;

    function respawn_food() {
        let new_pos;
        do {
            new_pos = k.rand(k.vec2(1, 1), k.vec2(12, 12));
            new_pos.x = Math.floor(new_pos.x);
            new_pos.y = Math.floor(new_pos.y);
            new_pos = new_pos.scale(block_size);
        } while (
            new_pos.x <= block_size || new_pos.x >= 13 * block_size ||
            new_pos.y <= block_size || new_pos.y >= 12 * block_size
        );
        if (food) k.destroy(food);
        food = k.add([
            k.sprite("coin"),
            k.pos(new_pos),
            k.area(),
            "food"
        ]);
    }

    function updateScore() {
        scoreText.text = `Score: ${score}`;
        if (score % 5 === 0 && score !== 0) {
            level++;
            levelText.text = `Level: ${level}`;
            move_delay = Math.max(0.1, move_delay - 0.04);
            k.add([
                k.text(`Level ${level}!`, { size: 24 }),
                k.pos(160, 240),
                k.lifespan(2)
            ]);
        }
        if (score >= scoreToWin) {
            run_action = false;
            k.add([
                k.text("🎉 You Win!\nRefresh to play again.", { size: 26 }),
                k.pos(100, 200)
            ]);
        }
    }

    function respawn_all() {
        run_action = false;
        k.wait(0.5, () => {
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

    k.collides("snake", "food", () => {
        snake_length++;
        score++;
        updateScore();
        respawn_food();
    });

    function gameOver() {
        run_action = false;
        k.shake(12);
        k.add([
            k.text("💀 Game Over!\nRefresh to try again.", { size: 26 }),
            k.pos(80, 220)
        ]);
    }

    k.collides("snake", "wall", gameOver);
    k.collides("snake", "snake", gameOver);

    k.keyPress("up", () => {
        if (current_direction !== directions.DOWN) current_direction = directions.UP;
    });
    k.keyPress("down", () => {
        if (current_direction !== directions.UP) current_direction = directions.DOWN;
    });
    k.keyPress("left", () => {
        if (current_direction !== directions.RIGHT) current_direction = directions.LEFT;
    });
    k.keyPress("right", () => {
        if (current_direction !== directions.LEFT) current_direction = directions.RIGHT;
    });

    let isPaused = false;

    k.keyPress("p", () => {
        isPaused = !isPaused;
        if (isPaused) {
            k.add([k.text("Paused", { size: 24 }), k.pos(150, 200)]);
        } else {
            k.destroyAll("text");
        }
    });

    let timer = 0;

    k.action(() => {
        if (isPaused || !run_action) return;
        timer += k.dt();
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
        snake_body.push(k.add([
            k.sprite("snake-skin"),
            k.pos(head.pos.x + move_x, head.pos.y + move_y),
            k.area(),
            "snake"
        ]));

        if (snake_body.length > snake_length) {
            k.destroy(snake_body.shift());
        }
    });

    k.add([
        k.text(
            "INSTRUCTIONS:\n\n▶ Arrow keys: Move\n▶ Eat 5 coins to level up\n▶ Avoid walls and yourself\n▶ Eat 30 coins to win\n▶ Press P to Pause/Resume",
            { size: 14, width: 180 }
        ),
        k.pos(580, 60),
        k.color(255, 255, 255),
        k.fixed()
    ]);
}