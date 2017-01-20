# Pong Game Project

Pong is one of the earliest arcade video games and the very first sports arcade video game. It is a table tennis sports game featuring simple two-dimensional graphics. There are usually two playing paddles and the users are required to move the paddles to hit the ball.
Once the ball is missed, the other user gets a score.

###Code Example
Here is a function that does the major updates to the ball, player and scores
```
update(dt){
        //checks if the scores of either player is 10
        if (this.players[0].score === 10 || this.players[1].score === 10){
            this.startSound.pause();
            this.winSound.play();
            this.players.score = 0;
            this.pause ();
        }

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
            this.pause();
        }
        //changes the movement of the computer
        const compPos = this.players[0].pos.x + (this.players[0].size.x / 2);
        if (compPos < this.ball.pos.x - 30){
            this.players[0].pos.x = this.players[0].pos.x + 2;
        } 
        else if (compPos > this.ball.pos.x + 30){
            this.players[0].pos.x = this.players[0].pos.x - 2;
        } 
```   

###Motivation
This project is in fulfillment of the Andela Bootcamp requirement

###Dependencies
This game was built using
* HTML5 Canvas
* Vanilla JS (ECMA Script 6)

###License

None.
