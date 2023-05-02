//init canvas
const canvas = document.getElementById("mainCanvas");
canvas.style.width = "100%";
canvas.style.height = "100vh";
console.log(window.getComputedStyle(canvas, null).getPropertyValue("height").replace("px",""));
console.log(window.getComputedStyle(canvas, null).getPropertyValue("width").replace("px",""));
const minSize = Math.min(window.getComputedStyle(canvas, null).getPropertyValue("height").replace("px",""),
                    window.getComputedStyle(canvas, null).getPropertyValue("width").replace("px",""));
canvas.setAttribute('height', minSize.toString()+"px");
canvas.setAttribute('width', minSize.toString()+"px");
canvas.style.width = minSize.toString()+"px";
canvas.style.height = minSize.toString()+"px";
var ctx = canvas.getContext("2d");

//game data
let isPlayerMovingLeft = false;
let isPlayerMovingRight = false;

class circle{
    constructor(yPos, xPos, size)
    {
        this.yPos = yPos;
        this.xPos = xPos;
        this.size = size;
    }

    drawThis(canvasContext)
    {
        canvasContext.beginPath();
        canvasContext.moveTo(this.yPos,this.yPos)
        canvasContext.arc(this.xPos,this.yPos,this.size,0*Math.PI,2*Math.PI);
        canvasContext.fill();
    }

    /**
     * @param {string} direction can only be "top","bottom","left","right"
     */
    moveTo(direction)
    {
        if(direction == "top")
        {
            this.yPos = this.yPos - 1;
        }
        else if(direction =="bottom")
        {
            this.yPos = this.yPos + 1;
        }
        else if(direction =="left")
        {
            this.xPos = this.xPos - 1;
        }
        else if(direction =="right")
        {
            this.xPos = this.xPos + 1;
        }
    };
}

class playerBoard{
    /**
     * @param {int} playerNumber 1 - 4
     * @param {Element} canvas main canvas of this game
     */
    constructor(playerNumber, canvas)
    {
        this.img = new Image();
        this.img.src = "./imgs/board.png";

        this.playerNumber = playerNumber;

        this.yPos;
        this.xPos;

        this.displayHeight = 10;
        this.displayWidth = 50;

        this.wallMargin = 10;
        

        if(playerNumber == 1)
        {
            this.xPos = canvas.width/2 - this.displayWidth/2;
            this.yPos = canvas.height - (this.displayHeight+ this.wallMargin);

        }
        else if(playerNumber == 2)
        {
            this.xPos = 0+this.wallMargin;
            this.yPos = canvas.height/2 - this.displayHeight/2;
            canvas.style.transform = 'rotate(-90deg)';
        }
        else if(playerNumber == 3)
        {
            this.xPos = canvas.width/2 - this.displayWidth/2;
            this.yPos = this.wallMargin;
            canvas.style.transform = 'rotate(180deg)';
        }
        else if(playerNumber == 4)
        {            
            this.xPos = canvas.width - this.wallMargin - this.displayHeight;
            this.yPos = canvas.height/2 - this.displayHeight/2;
            canvas.style.transform = 'rotate(90deg)';
        }
    }

    drawThis(canvasContext)
    {
        if(this.playerNumber == 2 || this.playerNumber == 4)
        {
            //canvasContext.translate(canvas.width/2,canvas.height/2);
            //canvasContext.rotate(Math.PI/2);
            //canvasContext.translate(-canvas.width/2,-canvas.height/2);
            canvasContext.drawImage(this.img,0,0,360,180,this.xPos,this.yPos,this.displayWidth,this.displayHeight);
            //canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        }
        else{
            canvasContext.drawImage(this.img,0,0,360,180,this.xPos,this.yPos,this.displayWidth,this.displayHeight);

        }

    }

    moveTo(direction)
    {
        if(direction == "top")
        {
            this.yPos = this.yPos - 1;
        }
        else if(direction =="bottom")
        {
            this.yPos = this.yPos + 1;
        }
        else if(direction =="left")
        {
            this.xPos = this.xPos - 1;
        }
        else if(direction =="right")
        {
            this.xPos = this.xPos + 1;
        }
    };
}



let player = new playerBoard(2, canvas);//test player

async function main(){
    let c = new circle(50,50,50);
    c.drawThis(ctx);
    let moveDir = "bottom";


    setInterval(()=>{

        window.requestAnimationFrame(()=>{
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            //draw game board
            ctx.moveTo(0,0)
            ctx.rect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = "purple";
            ctx.fill();

            //test circle movement
            c.moveTo(moveDir);
            ctx.fillStyle = "black";
            c.drawThis(ctx);
            if(c.yPos>150){
                moveDir = "top"
            }
            else if(c.yPos<50)
            {
                moveDir = "bottom";
            }
            player.drawThis(ctx); 
            //player movement
            if(player.playerNumber == 1 || player.playerNumber == 2)
            {
                if(isPlayerMovingLeft)
                {
                    if(player.xPos > 0){
                        player.moveTo("left");
                    }
                }
                if(isPlayerMovingRight)
                {
                    if(player.xPos + player.displayWidth < canvas.width){
                        player.moveTo("right");
                    }
                }
            }
            else
            {
                if(isPlayerMovingLeft)
                {
                    if(player.xPos + player.displayWidth < canvas.width){
                        player.moveTo("right");
                    }
                }
                if(isPlayerMovingRight)
                {

                    if(player.xPos > 0){
                        player.moveTo("left");
                    }
                }
            }
        });   
        
    },10);



}

addEventListener("keydown",(e)=>{
    if(e.key == "a")
    {
        isPlayerMovingLeft = true;
    }
    else if(e.key == "d")
    {
        isPlayerMovingRight = true;
    }
})

addEventListener("keyup",(e)=>{
    if(e.key == "a")
    {
        isPlayerMovingLeft = false;
    }
    else if(e.key == "d")
    {
        isPlayerMovingRight = false;
    }
})

main();