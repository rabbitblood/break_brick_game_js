//currently using "tsc ./break_brick_game_js/index.ts" in terminal to generate js file
//init canvas
const canvas = <HTMLCanvasElement>document.getElementById("mainCanvas");
if (canvas == null) {
    throw new Error("canvas not found");
}
canvas.style.width = "100%";
canvas.style.height = "100vh";
const minSize = Math.min(Number.parseInt(window.getComputedStyle(canvas, null).getPropertyValue("height").replace("px", "")),
                            Number.parseInt(window.getComputedStyle(canvas, null).getPropertyValue("width").replace("px", "")));
canvas.setAttribute('height', minSize.toString() + "px");
canvas.setAttribute('width', minSize.toString() + "px");
canvas.style.width = minSize.toString() + "px";
canvas.style.height = minSize.toString() + "px";
var ctx = canvas.getContext("2d");

//game data
let isPlayerMovingLeft = false;
let isPlayerMovingRight = false;
let playerNumber = 1;

let gameObjectColliderArray: ICollidable[] = [];
let ballArray: circle[] = [];

enum GameObjectType {
    circle,
    player,
    brick,
    wall
}

interface IGameObject {
    name: string;
    xPos: number;
    yPos: number;
}

/**
 * @interface ICollidable
 * @description interface for all collidable objects, its hard to do collision with all kinda shapes,
 *              so we will use rectangle for all collidable objects
 */
interface ICollidable {
    width: number;
    height: number;
    gameObjectType: GameObjectType;
    isColliding(collidable: ICollidable): boolean;
    gameObject: IGameObject;
}

class brick implements ICollidable, IGameObject {
    name: string;
    xPos: number;
    yPos: number;
    width: number;
    height: number;
    gameObjectType: GameObjectType;
    gameObject: IGameObject;

    /**
     * @param yPos
     * @param xPos
     * @param width
     * @param height
     */
    constructor(yPos: number, xPos: number, width: number, height: number) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.gameObjectType = GameObjectType.brick;
        this.name = "brick";
        this.gameObject = this;
    }

    drawThis(canvasContext) {
        canvasContext.beginPath();
        canvasContext.moveTo(this.yPos, this.yPos)
        canvasContext.rect(this.xPos, this.yPos, this.width, this.height);
        canvasContext.fill();
    }

    isColliding(collidable: ICollidable): boolean {
        if (this.xPos < collidable.gameObject.xPos + collidable.width &&
            this.xPos + this.width > collidable.gameObject.xPos &&
            this.yPos < collidable.gameObject.yPos + collidable.height &&
            this.yPos + this.height > collidable.gameObject.yPos) {
            return true;
        }
        return false;
    }

}

class circle implements ICollidable, IGameObject {
    name: string;
    xPos: number;
    yPos: number;
    size: number;
    width: number;  
    height: number;
    gameObjectType: GameObjectType;
    movingDirectionX: number;
    movingDirectionY: number;
    gameObject: IGameObject;
    lastCollidedObject: ICollidable;

    /**
     * @param yPos 
     * @param xPos 
     * @param size 
     */
    constructor(yPos:number, xPos:number, size:number) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.size = size;
        this.gameObjectType = GameObjectType.circle;
        this.name = "circle";
        this.width = size*0.75;
        this.height = size*0.75;
        this.movingDirectionX = 0;
        this.movingDirectionY = 0;
        this.gameObject = this;
    }


    SetMovingdirection(yDirection: number, xDirection: number) {
        this.movingDirectionX = xDirection;
        this.movingDirectionY = yDirection;
    }

    drawThis(canvasContext) {
        canvasContext.beginPath();
        canvasContext.moveTo(this.yPos, this.yPos)
        canvasContext.arc(this.xPos, this.yPos, this.size, 0 * Math.PI, 2 * Math.PI);
        canvasContext.fill();
    }

    /**
     * will move according to the moving direction
     */
    move() {
        //if no moving direction is set, do nothing
        if (this.xPos == undefined || this.yPos == undefined || this.movingDirectionX == undefined || this.movingDirectionY == undefined) {
            return;
        }
        this.xPos += this.movingDirectionX;
        this.yPos += this.movingDirectionY;
    }

    isColliding(collidable: ICollidable): boolean {
        if (this.xPos <= collidable.gameObject.xPos + collidable.width &&
            this.xPos + this.width >= collidable.gameObject.xPos &&
            this.yPos <= collidable.gameObject.yPos + collidable.height &&
            this.yPos + this.height >= collidable.gameObject.yPos) {
            return true;
        }
        return false;
    }

    collissionHandler(collidable: ICollidable) {
        //make sure not to collide with itself
        if(collidable == this || collidable == this.lastCollidedObject){
            return;
        }

        if (this.isColliding(collidable)) 
        {
            this.lastCollidedObject = collidable;
            if (collidable.gameObjectType == GameObjectType.player) {
                //if the ball is colliding with the player, the ball flying direction will be changed
                //the ball will be flying to the position based on where it collides with the player
                let player = <playerBoard>collidable;

                if(player.name == "player 1" || player.name == "player 3")
                {
                    this.movingDirectionX = ((this.xPos + this.width / 2) - (player.xPos + player.displayWidth / 2)) / (player.width / 2);
                    this.movingDirectionY = -this.movingDirectionY;
                }
                else if(player.name == "player 2" || player.name == "player 4")
                {
                    this.movingDirectionX = -this.movingDirectionX;
                    this.movingDirectionY = ((this.yPos + this.height / 2) - (player.yPos + player.displayHeight / 2)) / (player.height / 2);
                }
                
            }
            else if (collidable.gameObjectType == GameObjectType.circle) // doesnt seem to work that way
            {
                //the ball will change the moving direction based on the x or y axis of the ball it collides with
                this.movingDirectionX = ((this.xPos + this.width / 2) - (collidable.gameObject.xPos + collidable.width / 2)) / (collidable.width / 2);
                this.movingDirectionY = ((this.yPos + this.height / 2) - (collidable.gameObject.yPos + collidable.height / 2)) / (collidable.height / 2);
            }
            else{
                //the ball will flip the moving direction based on the x or y axis it collides with

                //find out which face did this ball hit
                // find the difference between the center of the ball and the center of the colliding object
                let dx = (this.xPos + this.width / 2) - (collidable.gameObject.xPos + collidable.width / 2);
                let dy = (this.yPos + this.height / 2) - (collidable.gameObject.yPos + collidable.height / 2);

                // find the absolute differences between the x and y positions
                let absDx = Math.abs(dx);
                let absDy = Math.abs(dy);

                // check which face the ball hit based on which absolute difference is larger
                if (absDx > absDy) {
                    // ball hit either left or right face of colliding object
                    if (dx < 0) {
                        // ball hit right face of colliding object
                        this.movingDirectionX = -this.movingDirectionX;
                    } else {
                        // ball hit left face of colliding object
                        this.movingDirectionX = Math.abs(this.movingDirectionX);
                    }
                } else {
                    // ball hit either top or bottom face of colliding object
                    if (dy < 0) {
                        // ball hit bottom face of colliding object
                        this.movingDirectionY = -this.movingDirectionY;
                    } else {
                        // ball hit top face of colliding object
                        this.movingDirectionY = Math.abs(this.movingDirectionY);
                    }
                }
            }
        }
    }
}

class playerBoard implements ICollidable, IGameObject {
    name: string;
    img: HTMLImageElement;
    imageHeight: number;
    imageWidth: number;

    playerNumber: number;

    yPos: number;
    xPos: number;
    width: number;
    height: number;
    displayHeight: number;
    displayWidth: number;

    wallMargin: number;

    gameObjectType: GameObjectType;
    gameObject: IGameObject;

    /**
     * @param playerNumber  the player number of the board
     * @param canvas        the canvas that the board will be drawn on
     */
    constructor(playerNumber: number, canvas: HTMLCanvasElement) {
        this.gameObjectType = GameObjectType.player;
        this.img = new Image();
        this.playerNumber = playerNumber;
        this.wallMargin = 10;
        this.gameObject = this;

        //尝试用图片的宽高来控制板子的宽高 但是失败了 所以直接hardcode了， 
        //之后如果要改图片的话，需要重新hardcode 或者找到更好的方法
        //tried to do this.imageWidth = img.naturalWidth; but failed, its value is 0 even though the image element does have naturalWidth
        const boardImageWidth = 360;
        const boardImageHeight = 180;

        if (playerNumber == 1) {
            this.name = "player 1";
            this.height = this.displayHeight = 10;
            this.width = this.displayWidth = 50;

            this.xPos = canvas.width / 2 - this.displayWidth / 2;
            this.yPos = canvas.height - (this.displayHeight + this.wallMargin);

            this.img.src = "./imgs/board.png";
            this.imageWidth = boardImageWidth; 
            this.imageHeight = boardImageHeight;
        }
        else if (playerNumber == 2) {
            this.name = "player 2";
            this.height = this.displayHeight = 50;
            this.width = this.displayWidth = 10;

            this.xPos = 0 + this.wallMargin;
            this.yPos = canvas.height / 2 - this.displayHeight / 2;

            this.img.src = "./imgs/board_rotated.png";
            this.imageWidth = boardImageHeight;
            this.imageHeight = boardImageWidth;

        }
        else if (playerNumber == 3) {
            this.name = "player 3";
            this.height = this.displayHeight = 10;
            this.width = this.displayWidth = 50;

            this.xPos = canvas.width / 2 - this.displayWidth / 2;
            this.yPos = this.wallMargin;

            this.img.src = "./imgs/board.png";
            this.imageWidth = boardImageWidth;
            this.imageHeight = boardImageHeight;
        }
        else if (playerNumber == 4) {
            this.name = "player 4";
            this.height = this.displayHeight = 50;
            this.width = this.displayWidth = 10;

            this.xPos = canvas.width - this.wallMargin - this.displayWidth;
            this.yPos = canvas.height / 2 - this.displayHeight / 2;

            this.img.src = "./imgs/board_rotated.png";
            this.imageWidth = boardImageHeight;
            this.imageHeight = boardImageWidth;
        }
    }

    drawThis(canvasContext: CanvasRenderingContext2D) {
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

    isColliding(collidable: ICollidable): boolean {
        if (this.xPos < collidable.gameObject.xPos + collidable.width &&
            this.xPos + this.displayWidth > collidable.gameObject.xPos &&
            this.yPos < collidable.gameObject.yPos + collidable.height &&
            this.yPos + this.displayHeight > collidable.gameObject.yPos) {
            return true;
        }
        return false;
    }

}

function main() {
    let player = new playerBoard(playerNumber, canvas); // test player board, will be replace by a function or listener to do it
    gameObjectColliderArray.push(player);
    const timer = 500;
    let currentTimer = 0;

    const testBrickArray: brick[] = [];

    let testBrick1 = new brick(100, 100, 50, 50); testBrickArray.push(testBrick1); gameObjectColliderArray.push(testBrick1);
    let testBrick2 = new brick(200, 200, 50, 50); testBrickArray.push(testBrick2); gameObjectColliderArray.push(testBrick2);
    let testBrick3 = new brick(300, 300, 50, 50); testBrickArray.push(testBrick3); gameObjectColliderArray.push(testBrick3);
    let testBrick4 = new brick(400, 400, 50, 50); testBrickArray.push(testBrick4); gameObjectColliderArray.push(testBrick4);



    setInterval(() => {
        currentTimer += 10;
        window.requestAnimationFrame(() => {
            
            if (ctx == undefined) {
                throw new Error("ctx is undefined");
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);


            //draw game board
            ctx.moveTo(0, 0)
            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "purple";
            ctx.fill();
            ctx.fillStyle = "black";

            //call shootCircleFromTop() every .5 sec
            if (currentTimer >= timer) {
                currentTimer = 0;
                shootCircleFromTop();
            }
            //draw all test bricks
            ctx.fillStyle = "red";
            for (let i = 0; i < testBrickArray.length; i++) {
                testBrickArray[i].drawThis(ctx);
            }
            ctx.fillStyle = "black";

            //drwa all circles
            for (let i = 0; i < ballArray.length; i++) {
                
                ballArray[i].move();
                ballArray[i].drawThis(ctx);
                for(let j = 0; j < gameObjectColliderArray.length; j++) {
                    ballArray[i].collissionHandler(gameObjectColliderArray[j]);
                }
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

function shootCircleFromTop() {
    //use this function to test shooting a circle from the top of the screen
    //this will be used to test collision detection
    let testC = new circle(250, 250, 5);
    testC.SetMovingdirection(1,0);
    ballArray.push(testC);
    gameObjectColliderArray.push(testC);
}


addEventListener("keydown", (e) => {
    if (e.key == "a" || e.key == "ArrowLeft") {
        isPlayerMovingLeft = true;
    }
    else if (e.key == "d" || e.key == "ArrowRight") {
        isPlayerMovingRight = true;
    }
})

addEventListener("keyup", (e) => {
    if (e.key == "a" || e.key == "ArrowLeft") {
        isPlayerMovingLeft = false;
    }
    else if (e.key == "d" || e.key == "ArrowRight") {
        isPlayerMovingRight = false;
    }
})






main();