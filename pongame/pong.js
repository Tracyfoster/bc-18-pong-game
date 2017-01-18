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
//        this.vel = new Vec;
        this.score = 0;
    }    
}

class Pong
{
    constructor(canvas)
    {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        this.ball = new Ball();

        this.players = [
            new Player,
            new Player,
        ];

        this.players[0].pos.y = 10;
        this.players[1].pos.y = this._canvas.height - 10;
        this.players.forEach(player => {
            player.pos.x = this._canvas.width / 2;
        }); 


        let lastTime;
        const callback = (millis) => {
            if (lastTime) {
                this.update((millis - lastTime) / 1000);
            }
            lastTime = millis;
            requestAnimationFrame(callback);
        }
        callback(); 
        this.reset();
    }

    collide(player, ball) {
        if (player.left < ball.right && player.right > ball.left && 
             player.top < ball.bottom && player.bottom > ball.top){
            ball.vel.y = -ball.vel.y;
            ball.vel.len *= 1.05;  
        }
    }

    draw (){
        this._context.fillStyle = '#eee';
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);     

        this.drawRect(this.ball); 

        this.players.forEach(player => this.drawRect(player))
    }

    drawRect(rect){
        this._context.fillStyle = '#0095DD';
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }
    
    reset(){
        this.ball.pos.x = this._canvas.width / 2;
        this.ball.pos.y = this._canvas.height / 2;
        this.ball.vel.x = 0;
        this.ball.vel.y = 0;
    }

    start(){
        if (this.ball.vel.x === 0 && this.ball.vel.x === 0)
            this.ball.vel.x = 300 * (Math.random() > .5 ? 1 : -1);
            this.ball.vel.y = 300 * (Math.random() * 2 - 1);
            this.ball.vel.len = 200;
    }
    update(dt){
        this.ball.pos.x += this.ball.vel.x * dt;
        this.ball.pos.y += this.ball.vel.y * dt

        if (this.ball.left < 0 || this.ball.right > this._canvas.width){
            this.ball.vel.x = -this.ball.vel.x
        }
        if (this.ball.top < 0 || this.ball.bottom > this._canvas.height){
            const playerId = this.ball.vel.y < 0 | 0;
            this.players[playerId].score++;
            console.log(playerId);
            this.reset();
        }

        this.players[0].pos.x = this.ball.pos.x;

        this.players.forEach(player => this.collide(player, this.ball));

        this.draw(); 
    }
}

const canvas = document.getElementById('myCanvas');

const pong = new Pong(canvas);  

canvas.addEventListener("mousemove", event =>{
    pong.players[1].pos.x = event.offsetX;
});

canvas.addEventListener("click", event =>{
    pong.start();
}); 
