//init canvas
const canvas = document.getElementById("mainCanvas");
canvas.style.width = "100%";
canvas.style.height = "100vh";
const minSize = Math.min(window.getComputedStyle(canvas, null).getPropertyValue("height").replace("px", ""),
    window.getComputedStyle(canvas, null).getPropertyValue("width").replace("px", ""));
canvas.setAttribute('height', minSize.toString() + "px");
canvas.setAttribute('width', minSize.toString() + "px");
canvas.style.width = minSize.toString() + "px";
canvas.style.height = minSize.toString() + "px";
var ctx = canvas.getContext("2d");

//game data
let isPlayerMovingLeft = false;
let isPlayerMovingRight = false;
let playerNumber = 4;

class circle {
    constructor(yPos, xPos, size) {
        this.yPos = yPos;
        this.xPos = xPos;
        this.size = size;
    }

    drawThis(canvasContext) {
        canvasContext.beginPath();
        canvasContext.moveTo(this.yPos, this.yPos)
        canvasContext.arc(this.xPos, this.yPos, this.size, 0 * Math.PI, 2 * Math.PI);
        canvasContext.fill();
    }

    /**
     * @param {string} direction can only be "top","bottom","left","right"
     */
    moveTo(direction) {
        if (direction == "top") {
            this.yPos = this.yPos - 1;
        }
        else if (direction == "bottom") {
            this.yPos = this.yPos + 1;
        }
        else if (direction == "left") {
            this.xPos = this.xPos - 1;
        }
        else if (direction == "right") {
            this.xPos = this.xPos + 1;
        }
    };
}

class playerBoard {
    /**
     * @param {int} playerNumber 1 - 4
     * @param {Element} canvas main canvas of this game
     */
    constructor(playerNumber, canvas) {

        this.img = new Image();
        this.imageHeight;
        this.imageWidth;

        this.playerNumber = playerNumber;

        this.yPos;
        this.xPos;
        this.displayHeight;
        this.displayWidth;

        this.wallMargin = 10;


        if (playerNumber == 1) {
            this.displayHeight = 10;
            this.displayWidth = 50;

            this.xPos = canvas.width / 2 - this.displayWidth / 2;
            this.yPos = canvas.height - (this.displayHeight + this.wallMargin);

            this.img.src = "./imgs/board.png";
            this.imageWidth = 360;
            this.imageHeight = 180;
        }
        else if (playerNumber == 2) {
            this.displayHeight = 50;
            this.displayWidth = 10;

            this.xPos = 0 + this.wallMargin;
            this.yPos = canvas.height / 2 - this.displayHeight / 2;

            this.img.src = "./imgs/board_rotated.png";
            this.imageWidth = 180;
            this.imageHeight = 360;

        }
        else if (playerNumber == 3) {
            this.displayHeight = 10;
            this.displayWidth = 50;

            this.xPos = canvas.width / 2 - this.displayWidth / 2;
            this.yPos = this.wallMargin;

            this.img.src = "./imgs/board.png";
            this.imageWidth = 360;
            this.imageHeight = 180;
        }
        else if (playerNumber == 4) {
            this.displayHeight = 50;
            this.displayWidth = 10;

            this.xPos = canvas.width - this.wallMargin - this.displayWidth;
            this.yPos = canvas.height / 2 - this.displayHeight / 2;

            this.img.src = "./imgs/board_rotated.png";
            this.imageWidth = 180;
            this.imageHeight = 360;
        }
    }

    drawThis(canvasContext) {
        canvasContext.drawImage(this.img, 0, 0, this.imageWidth, this.imageHeight, this.xPos, this.yPos, this.displayWidth, this.displayHeight);
    }

    moveTo(direction) {
        if (direction == "top") {
            this.yPos = this.yPos - 1;
        }
        else if (direction == "bottom") {
            this.yPos = this.yPos + 1;
        }
        else if (direction == "left") {
            this.xPos = this.xPos - 1;
        }
        else if (direction == "right") {
            this.xPos = this.xPos + 1;
        }
    };

    getCollider() {
        return new circle(this.yPos, this.xPos, this.displayWidth / 2);
    }

}


async function main() {
    let player = new playerBoard(playerNumber, canvas);
    let testC = new circle(50, 50, 50);
    testC.drawThis(ctx);
    let moveDir = "bottom";

    setInterval(() => {
        window.requestAnimationFrame(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);


            //draw game board
            ctx.moveTo(0, 0)
            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "purple";
            ctx.fill();

            //test circle movement
            testC.moveTo(moveDir);
            ctx.fillStyle = "black";
            testC.drawThis(ctx);
            if (testC.yPos > 150) {
                moveDir = "top"
            }
            else if (testC.yPos < 50) {
                moveDir = "bottom";
            }
            //draw player
            player.drawThis(ctx);
            //player movement
            if (player.playerNumber == 1) {
                if (isPlayerMovingLeft) {
                    if (player.xPos > 0) {
                        player.moveTo("left");
                    }
                }
                if (isPlayerMovingRight) {
                    if (player.xPos + player.displayWidth < canvas.width) {
                        player.moveTo("right");
                    }
                }
            }
            else if (player.playerNumber == 2) {
                if (isPlayerMovingLeft) {
                    if (player.yPos > 0) {
                        player.moveTo("top");
                    }
                }
                if (isPlayerMovingRight) {
                    if (player.yPos + player.displayHeight < canvas.height) {
                        player.moveTo("bottom");
                    }
                }
            }
            else if (player.playerNumber == 3) {
                if (isPlayerMovingLeft) {
                    if (player.xPos + player.displayWidth < canvas.width) {
                        player.moveTo("right");
                    }
                }
                if (isPlayerMovingRight) {
                    if (player.xPos > 0) {
                        player.moveTo("left");
                    }
                }
            }
            else if (player.playerNumber == 4) {
                if (isPlayerMovingLeft) {
                    if (player.yPos + player.displayHeight < canvas.height) {
                        player.moveTo("bottom");
                    }
                }
                if (isPlayerMovingRight) {
                    if (player.yPos > 0) {
                        player.moveTo("top");
                    }
                }
            }
        });

        //rotate canvas if player 2 - 4
        if (player.playerNumber == 2) {
            canvas.style.transform = 'rotate(-90deg)';
        }
        else if (player.playerNumber == 3) {
            canvas.style.transform = 'rotate(180deg)';
        }
        else if (player.playerNumber == 4) {
            canvas.style.transform = 'rotate(90deg)';
        }

    }, 10);
}



addEventListener("keydown", (e) => {
    if (e.key == "a") {
        isPlayerMovingLeft = true;
    }
    else if (e.key == "d") {
        isPlayerMovingRight = true;
    }
})

addEventListener("keyup", (e) => {
    if (e.key == "a") {
        isPlayerMovingLeft = false;
    }
    else if (e.key == "d") {
        isPlayerMovingRight = false;
    }
})

main();