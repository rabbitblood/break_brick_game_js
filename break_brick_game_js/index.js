var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
//init canvas
var canvas = document.getElementById("mainCanvas");
if (canvas == null) {
    throw new Error("canvas not found");
}
canvas.style.width = "100%";
canvas.style.height = "100vh";
var minSize = Math.min(Number.parseInt(window.getComputedStyle(canvas, null).getPropertyValue("height").replace("px", "")), Number.parseInt(window.getComputedStyle(canvas, null).getPropertyValue("width").replace("px", "")));
canvas.setAttribute('height', minSize.toString() + "px");
canvas.setAttribute('width', minSize.toString() + "px");
canvas.style.width = minSize.toString() + "px";
canvas.style.height = minSize.toString() + "px";
var ctx = canvas.getContext("2d");
//game data
var isPlayerMovingLeft = false;
var isPlayerMovingRight = false;
var playerNumber = 1;
var ballArray = [];
var GameObjectType;
(function (GameObjectType) {
    GameObjectType[GameObjectType["circle"] = 0] = "circle";
    GameObjectType[GameObjectType["player"] = 1] = "player";
    GameObjectType[GameObjectType["brick"] = 2] = "brick";
    GameObjectType[GameObjectType["wall"] = 3] = "wall";
})(GameObjectType || (GameObjectType = {}));
var circle = /** @class */ (function () {
    /**
     * @param yPos
     * @param xPos
     * @param size
     */
    function circle(yPos, xPos, size) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.size = size;
        this.gameObjectType = GameObjectType.circle;
        this.name = "circle";
        this.width = size * 0.75;
        this.height = size * 0.75;
        this.movingDirectionX = 0;
        this.movingDirectionY = 0;
        this.gameObject = this;
    }
    circle.prototype.SetMovingdirection = function (yDirection, xDirection) {
        this.movingDirectionX = xDirection;
        this.movingDirectionY = yDirection;
    };
    circle.prototype.drawThis = function (canvasContext) {
        canvasContext.beginPath();
        canvasContext.moveTo(this.yPos, this.yPos);
        canvasContext.arc(this.xPos, this.yPos, this.size, 0 * Math.PI, 2 * Math.PI);
        canvasContext.fill();
    };
    /**
     * will move according to the moving direction
     */
    circle.prototype.move = function () {
        //if no moving direction is set, do nothing
        if (this.xPos == undefined || this.yPos == undefined || this.movingDirectionX == undefined || this.movingDirectionY == undefined) {
            return;
        }
        this.xPos += this.movingDirectionX;
        this.yPos += this.movingDirectionY;
    };
    circle.prototype.isColliding = function (collidable) {
        if (this.xPos < collidable.gameObject.xPos + collidable.width &&
            this.xPos + this.width > collidable.gameObject.xPos &&
            this.yPos < collidable.gameObject.yPos + collidable.height &&
            this.yPos + this.height > collidable.gameObject.yPos) {
            return true;
        }
        return false;
    };
    circle.prototype.collissionHandler = function (collidable) {
        if (this.isColliding(collidable)) {
            if (collidable.gameObjectType == GameObjectType.player) {
                //if the ball is colliding with the player, the ball flying direction will be changed
                //the ball will be flying to the position based on where it collides with the player
                //the ball will be flying to the left if the collision is on the left side of the player based on the center of the player
                //the ball will be flying to the right if the collision is on the right side of the player based on the center of the player
                var player = collidable;
                if (player.name == "player 1" || player.name == "player 3") {
                    this.movingDirectionX = ((this.xPos + this.width / 2) - (player.xPos + player.displayWidth / 2)) / (player.width / 2);
                    this.movingDirectionY = -this.movingDirectionY;
                }
                else if (player.name == "player 2" || player.name == "player 4") {
                }
            }
        }
    };
    return circle;
}());
var playerBoard = /** @class */ (function () {
    /**
     * @param playerNumber  the player number of the board
     * @param canvas        the canvas that the board will be drawn on
     */
    function playerBoard(playerNumber, canvas) {
        this.gameObjectType = GameObjectType.player;
        this.img = new Image();
        this.playerNumber = playerNumber;
        this.wallMargin = 10;
        this.gameObject = this;
        //尝试用图片的宽高来控制板子的宽高 但是失败了 所以直接hardcode了， 
        //之后如果要改图片的话，需要重新hardcode 或者找到更好的方法
        //tried to do this.imageWidth = img.naturalWidth; but failed, its value is 0, so I hardcode it
        var boardImageWidth = 360;
        var boardImageHeight = 180;
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
    playerBoard.prototype.drawThis = function (canvasContext) {
        canvasContext.drawImage(this.img, 0, 0, this.imageWidth, this.imageHeight, this.xPos, this.yPos, this.displayWidth, this.displayHeight);
    };
    playerBoard.prototype.moveTo = function (direction) {
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
    ;
    playerBoard.prototype.isColliding = function (collidable) {
        if (this.xPos < collidable.gameObject.xPos + collidable.width &&
            this.xPos + this.displayWidth > collidable.gameObject.xPos &&
            this.yPos < collidable.gameObject.yPos + collidable.height &&
            this.yPos + this.displayHeight > collidable.gameObject.yPos) {
            return true;
        }
        return false;
    };
    return playerBoard;
}());
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var player, timer, currentTimer;
        return __generator(this, function (_a) {
            player = new playerBoard(playerNumber, canvas);
            timer = 200;
            currentTimer = 0;
            setInterval(function () {
                currentTimer += 10;
                window.requestAnimationFrame(function () {
                    if (ctx == undefined) {
                        return;
                    }
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    //draw game board
                    ctx.moveTo(0, 0);
                    ctx.rect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = "purple";
                    ctx.fill();
                    ctx.fillStyle = "black";
                    //call shootCircleFromTop() every 2 sec
                    if (currentTimer >= timer) {
                        currentTimer = 0;
                        shootCircleFromTop();
                    }
                    //drwa all circles
                    for (var i = 0; i < ballArray.length; i++) {
                        ballArray[i].drawThis(ctx);
                        ballArray[i].collissionHandler(player);
                        ballArray[i].move();
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
            return [2 /*return*/];
        });
    });
}
function shootCircleFromTop() {
    //use this function to test shooting a circle from the top of the screen
    //this will be used to test collision detection
    var testC = new circle(250, 250, 5);
    testC.SetMovingdirection(1, 0);
    ballArray.push(testC);
}
addEventListener("keydown", function (e) {
    if (e.key == "a" || e.key == "ArrowLeft") {
        isPlayerMovingLeft = true;
    }
    else if (e.key == "d" || e.key == "ArrowRight") {
        isPlayerMovingRight = true;
    }
});
addEventListener("keyup", function (e) {
    if (e.key == "a" || e.key == "ArrowLeft") {
        isPlayerMovingLeft = false;
    }
    else if (e.key == "d" || e.key == "ArrowRight") {
        isPlayerMovingRight = false;
    }
});
main();
