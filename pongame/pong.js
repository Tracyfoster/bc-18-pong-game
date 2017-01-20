class Vec
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
    get len(){
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    set len(value){
        const fact = value / this.len;
        this.x *= fact;
        this.y *= fact;
    }
}

class Rect
{
    constructor(w, h)
    {
        this.pos = new Vec();
        this.size = new Vec(w, h);
    }
    get left()
    {
        return this.pos.x - this.size.x / 2;
    }
    get right()
    {
        return this.pos.x + this.size.x / 2;
    }
    get top()
    {
        return this.pos.y - this.size.y / 2;
    }
    get bottom()
    {
        return this.pos.y + this.size.y / 2;
    }
}

class Ball extends Rect
{
    constructor()
    {
        super(10, 10);
        this.vel = new Vec;
    }
}

class Player extends Rect
{
    constructor()
    {
        super(100, 10);
        this.score = 0;
        this.vel = new Vec;
        this.name = "";

    }
}

class Pong
{
    constructor(canvas)
    {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");

        this.ball = new Ball();

        this.players = [
            new Player,
            new Player,
        ];

        this.players[0].pos.y = 10;
        this.players[0].vel.x = 50;
        this.players[0].name = prompt('Player1: Please enter your name').toUpperCase();
        this.players[1].pos.y = this._canvas.height - 10;
        this.players[1].vel.x = 50;
        this.players[1].name = prompt('Player2: Please enter your name').toUpperCase();
        this.players.forEach(player => {
            player.pos.x = this._canvas.width / 2;
        }); 


        let lastTime = null;
        this._frameCallback = (millis) => {
            if (lastTime !== null) {
                const diff = millis - lastTime;
                this.update(diff / 1000);
            }
            lastTime = millis;
            requestAnimationFrame(this._frameCallback);
        };

        this.CHAR_PIXEL = 5;
        this.CHARS = [
            "111101101101111",
            "010010010010010",
            "111001111100111",
            "111001111001111",
            "101101111001001",
            "111100111001111",
            "111100111101111",
            "111001001001001",
            "111101111101111",
            "111101111001111",
        ].map(str => {
            const canvas = document.createElement("canvas");
            canvas.height = this.CHAR_PIXEL * 5;
            canvas.width = this.CHAR_PIXEL * 3;
            const context = canvas.getContext("2d");
            context.fillStyle = "#0095DD";
            str.split("").forEach((fill, i) => {
                if (fill === "1") {
                    context.fillRect((i % 3) * this.CHAR_PIXEL, (i / 3 | 0) * this.CHAR_PIXEL, this.CHAR_PIXEL, this.CHAR_PIXEL);
                }
            });
            return canvas;
        });
        this.startSound = new Audio("start.wav");
        this.winSound = new Audio("winner.mp3");
        this.hit = new Audio("pop.mp3");

        this.paused();
    }
    clear(){
        this._context.fillStyle = '#333';
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }

    collide(player, ball) {
        if (player.left < ball.right && player.right > ball.left && 
             player.top < ball.bottom && player.bottom > ball.top){
            this.hit.play();
            const len = ball.vel.len;
            ball.vel.y = -ball.vel.y ;
            ball.vel.x = 300 * (Math.random() - .5);
            ball.vel.len = len * 1.05;  
        }
    }

    instrust (){
        this._context.fillStyle = "#333";
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

        this._context.font = "40px serif"
        this._context.fillStyle = "#fff";
        this._context.fillText("Welcome to Pong!", 150, 60);

        this._context.font = "25px serif"
        this._context.fillStyle = "#fff";
        this._context.fillText("Here are some instructions to play the game.", 70, 130);

        this._context.font = "20px serif"
        this._context.fillStyle = "#fff";
        this._context.fillText("Player 1: Use \"A\" to move left and \"D\" to move right.", 100, 170);
        this._context.fillText("Player 2: Use the arrow keys to move left and right.", 100, 200);
        this._context.fillText("To pause the game, use \"Spacebar\".", 100, 230);
        this._context.fillText("To reset the game, use \"Escape\".", 100, 260);
        this._context.fillText("To start the game, click the mouse. ", 100, 290);
        this._context.fillText("To resume the game, use the \"Enter\" key.", 100, 320);
        this._context.fillText("To go back to the instructions, use the \"Tab\" key.", 100, 350);
    }

    draw (){
        //this.clear();
        this._context.fillStyle = "#333";
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);     

        this.drawRect(this.ball); 

        this.players.forEach(player => this.drawRect(player));

        this.drawScore();

        this.drawUser()

        if (this.players[0].score > 4 || this.players[1].score > 4){
            this.startSound.pause();
        } else{
            this.startSound.play();
        }   

        this.players.forEach(player => {
            if (this.players[0].score === 9) {
                this.drawWinner(this.players[0].name);
            }
            if (this.players[1].score === 9) {
                this.drawWinner(this.players[1].name);
            }
         }); 
    }

    drawRect(rect){
        this._context.fillStyle = "#0095DD";
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }

    drawScore()
    {
        const align = this._canvas.height / 3;
        this.players.forEach((player, index) => {
            const chars = player.score.toString().split("");
            const offset = align * (index + 1) - ((this.CHAR_PIXEL * 4) * chars.length / 2) - this.CHAR_PIXEL / 2;
            chars.forEach((char, pos) => {
                this._context.drawImage(this.CHARS[char|0], 10, offset + pos * (this.CHAR_PIXEL * 4));
            });
        });
    }
    drawUser() {
        this.players.forEach(player => {
            this._context.font = "16px Arial";
            this._context.fillStyle = "#0095DD";
            this._context.fillText(this.players[0].name, 10, 30);
            this._context.fillText(this.players[1].name, 10, this._canvas.height - 20);
        });
    }    

    drawWinner(name){
        this.winSound.play();
        this._context.fillStyle = "#333";
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

        this._context.font = "50px serif"
        this._context.fillStyle = "#fff";
        this._context.fillText(name + " " +" wins!", 150, 150);

        this._context.font = "25px serif"
        this._context.fillStyle = "#fff";
        this._context.fillText("Press the \"Escape\" to play again", 150, 250);
    }    
    
    paused(){
        this.startSound.pause();
        this.ball.pos.x = this._canvas.width / 2;
        this.ball.pos.y = this._canvas.height / 2;
        this.ball.vel.x = 0;
        this.ball.vel.y = 0;
    }
    reset(){
        this.ball.pos.x = this._canvas.width / 2;
        this.ball.pos.y = this._canvas.height / 2;
        this.ball.vel.x = 0;
        this.ball.vel.y = 0;
        this.players[0].score = 0;
        this.players[1].score = 0;
    }

    play(){
        if (this.ball.vel.x === 0 && this.ball.vel.x === 0)
            this.ball.vel.x = 400 * (Math.random() > .5 ? 1 : -1);
            this.ball.vel.y = 400 * (Math.random() * 2 - 1);
            this.ball.vel.len = 300;
    }
    
    start(){
        requestAnimationFrame(this._frameCallback);
    }
    

    
    update(dt){
        //checks if the scores of either player is 10
          

        //updates the position of the ball    
        this.ball.pos.x += this.ball.vel.x * dt;
        this.ball.pos.y += this.ball.vel.y * dt

        //checks the collision and if ball is missed, updates the score    
        if (this.ball.left < 0 || this.ball.right > this._canvas.width){
            this.ball.vel.x = -this.ball.vel.x
        }
        if (this.ball.top < 0 || this.ball.bottom > this._canvas.height){
            const playerId = this.ball.vel.y < 0 | 0;
            this.players[playerId].score++;
            console.log(playerId);
            this.paused();
        }

        this.players.forEach(player => this.collide(player, this.ball));

        this.draw(); 
    }
}

const canvas = document.getElementById("myCanvas");

const pong = new Pong(canvas);  

canvas.addEventListener("mousemove", event =>{
    const scale = event.offsetX / event.target.getBoundingClientRect().width;
    pong.players[1].pos.x = canvas.width * scale;
});

canvas.addEventListener("click", event =>{
    pong.play();
});

document.addEventListener('keydown', event =>{
    console.log(event);
    if (event.code === "KeyD" && pong.players[0].right < canvas.width){
        pong.players[0].pos.x += pong.players[0].vel.x ;
    } 
    if (event.code === "KeyA" && pong.players[0].left > 0){
        pong.players[0].pos.x -= pong.players[0].vel.x;
    }        
    if (event.code === "ArrowRight" && pong.players[1].right < canvas.width){
        pong.players[1].pos.x += pong.players[1].vel.x;
    } 
    if (event.code === "ArrowLeft" && pong.players[1].left > 0){
        pong.players[1].pos.x -= pong.players[1].vel.x;
    } 
    if (event.code === "Space"){
       pong.paused(); 
    }    

    if (event.code === "Escape"){
       pong.reset(); 
    }
    if (event.code === "Tab"){
       pong.instrust(); 
    }    
    if (event.code === "Enter"){
       pong.start(); 
    }
});  
document.addEventListener('keyup', event =>{
    delete event.code;
});

pong.instrust();
