<template>
  <canvas 
    id="pingpong-canvas"
    :width="canvasWidth"
    :height="canvasHeight"

    @mousemove="trackPosition"
    @mousedown="btnClick"
  >
  
  </canvas>
  <!-- <audio preload="true" id="collide">
    <source src="https://dl.dropbox.com/u/26141789/canvas/pingpong/Metal%20Cling%20-%20Hit.mp3" />
    <source src="https://dl.dropbox.com/u/26141789/canvas/pingpong/Metal%20Cling%20-%20Hit.wav" />
  </audio> -->
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue';
import Component from 'vue-class-component';

const Props = Vue.extend({
  props: {
    canvasWidth: {
      required: true,
      type: Number,
    },
    canvasHeight: {
      required: true,
      type: Number,
    },
  },
});

const add = (a: number, b: number) => a + b;
const sub = (a: number, b: number) => a - b;

class Paddle {
  height: number;
  width: number;
  x: number;
  y: number;

  constructor(
    position: string,
    canvasWidth: number,
    canvasHeight: number
  ) {
    this.height = 5;
    this.width = 150;

    this.x = (canvasWidth / 2) - (this.width / 2);
    this.y = (position === 'top') ? 0 : (canvasHeight - this.height);
  }
}

class Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  constructor(
    x: number,
    y: number,
    m: number
  ) {
    this.x = x || 0;
    this.y = y || 0;
    
    this.radius = 1.2;
    
    this.vx = -1.5 + Math.random() * 3;
    this.vy = m * Math.random() * 1.5;
  }
}

@Component
export default class PingPong extends Props {
  ctx: CanvasRenderingContext2D = new CanvasRenderingContext2D();
  mouse = { x: 0, y: 0, };
  points = 0;
  multiplier = 1;
  flag = false;
  over = false;
  paddleHit: 'left' | 'right' = 'left';
  paddles: Paddle[] = [
    new Paddle(
      'bottom',
      this.canvasWidth,
      this.canvasHeight
    ),
    new Paddle(
      'top',
      this.canvasWidth,
      this.canvasHeight
    )
  ];

  particle = new Particle(0, 0, 0);
  particlesCount = 20;
  particles: Particle[] = [];
      
  ball = { x: 50, y: 50, r: 5, c: 'green', vx: 4, vy: 8, };
  // Start Button object
  startBtn = {
    w: 100,
    h: 50,
    x: this.canvasWidth / 2 - 50,
    y: this.canvasHeight / 2 - 25,
    message: 'Start',
  };

  buttonDraw() {
    const { x, y, w, h, message, } = this.startBtn;

    this.ctx.strokeStyle = 'blue';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, w, h);
    
    this.ctx.font = '18px Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = 'Green';
    this.ctx.fillText(
      message, 
      this.canvasWidth / 2,
      this.canvasHeight / 2
    );

    this.startBtn.message = this.startBtn.message === 'Reset' ? 'Start' : 'Reset';
  };

  reverseBallDirection() {
    this.ball.vy = -this.ball.vy;
  };

  // Function for drawing ball on canvas
  ballDraw() {
    const { c, x, y, r, } = this.ball;
    this.ctx.beginPath();
    this.ctx.fillStyle = c;
    this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
    this.ctx.fill();
  };

  trackPosition(e: MouseEvent) {
    this.mouse.x = e.pageX;
    this.mouse.y = e.pageY;
  };

  btnClick(e: MouseEvent) {
    // Variables for storing mouse position on click
    const mx = e.pageX;
    // const my = e.pageY;

    // Click start button
    if (mx >= this.startBtn.x && mx <= this.startBtn.x + this.startBtn.w) {
      // start animation
      this.draw();

      this.startBtn.message = 'Reset';
      this.buttonDraw();
    }

    // If the game is over, and the restart button is clicked
    if (this.over) {
      if (mx >= this.startBtn.x && mx <= this.startBtn.x + this.startBtn.w) {
        this.ball.x = 20;
        this.ball.y = 20;
        this.points = 0;
        this.ball.vx = 4;
        this.ball.vy = 8;
        
        // start animation
        this.draw();      
        this.over = false;
      }
    }
  };

  paintCanvas() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  };

  collides(paddle: Paddle) {
    const { ball, } = this;
    const { x, y, r, } = ball;
    
    if (((x + r) >= (paddle.x)) && ((x - r) <= (paddle.x + paddle.width))) {
      if (y >= (paddle.y - paddle.height) && (paddle.y > 0)) {
        this.leftPaddleHit(paddle);
      } else if (y <= paddle.height && paddle.y === 0) {
        this.rightPaddleHit(paddle);
      }
    }

    return false;
  }

  leftPaddleHit(paddle: Paddle) {
    this.ball.y = sub(paddle.y, paddle.height);
    this.particle.y = add(this.ball.y, this.ball.r);
    this.multiplier = -1;
  };

  rightPaddleHit(paddle: Paddle) {
    this.ball.y = add(paddle.y, paddle.height);
    this.particle.y = sub(this.ball.y, this.ball.r);
    this.multiplier = 1;
  };

  increaseSpeed() {
    // Increment points
    this.points++;

    // every 5 points increase the speed of the ball
    if (this.points % 4 === 0) {
      if (Math.abs(this.ball.vx) < 15) {
        this.ball.vx += (this.ball.vx < 0) ? -1 : 1;
        this.ball.vy += (this.ball.vy < 0) ? -2 : 2;
      }
    }
  };

  emitParticles() { 
    this.particles.forEach((p) => {
      this.ctx.beginPath(); 
      this.ctx.fillStyle = 'white';
      
      if (p.radius > 0) {
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
      }

      this.ctx.fill();
      
      p.x += p.vx; 
      p.y += p.vy; 
      
      // Reduce radius so that the particles die after a few seconds
      p.radius = Math.max(p.radius - 0.05, 0.0); 
    });
  };

  collideAction(paddle: Paddle) {
    // reverse
    this.reverseBallDirection();
    if (this.paddleHit === 'left') {
      this.leftPaddleHit(paddle);
    } else {
      this.rightPaddleHit(paddle);
    }

    this.increaseSpeed();
  
    // Collesion (sound stuff)

    // if(this.collision) {
    //   if(this.points > 0)  {
    //     collision.pause();
    //   }
      
    //   collision.currentTime = 0;
    //   collision.play();
    // }
    
    this.particle.x = this.ball.x;
    this.flag = false;
  };

  update() {
    this.updateScore(); 
    
    // Move paddles
    if (this.mouse.x && this.mouse.y) {
      for (let i = 1; i < this.paddles.length; i++) {
        this.paddles[i].x = (this.mouse.x - this.paddles[i].width / 2);
      }
    }
    
    // Move the ball with its velocity (no need for more math with this as acceleration is not a factor)
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;

    // check if the left paddle was hit, if true take action with it and return true
    let collisionHappend = this.collides(this.paddles[1]);
    // check if the right paddle was hit, if true take action with it and return true
    if (!collisionHappend) {
      collisionHappend = this.collides(this.paddles[2]); 
    }

    // If neither paddle was hit
    if (!collisionHappend) {
      // Collide with walls, If the ball hits the top/bottom,
      // walls, run gameOver() function

      if (this.ball.y + this.ball.r > this.canvasHeight) {
        this.ball.y = (this.canvasHeight - this.ball.r);
        console.error('GAME OVER');

        this.gameOver();
      } else if (this.ball.y < 0) {
        this.ball.y = this.ball.r;
        console.error('GAME OVER');

        this.gameOver();
      }
      
      // If ball strikes the vertical walls, invert the 
      // x-velocity vector of ball
      if (this.ball.x + this.ball.r > this.canvasWidth) {
        this.ball.vx = -this.ball.vx;
        this.ball.x = this.canvasWidth - this.ball.r;
      } else if (this.ball.x - this.ball.r < 0) {
        this.ball.vx = -this.ball.vx;
        this.ball.x = this.ball.r;
      }
    }
    
    // If flag is set, push the particles
    if (this.flag) { 
      for (let i = 0; i < this.particlesCount; i++) {
        this.particles.push(
          new Particle(
            this.particle.x,
            this.particle.y,
            this.multiplier
          )
        );
      }
    };
    
    // Emit particles/sparks
    this.emitParticles();
    
    // reset flag
    this.flag = false;
  };

  // Function to run when the game overs
  gameOver() {
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(
      `Game Over - You scored ${this.points} points!`,
      this.canvasWidth / 2,
      this.canvasHeight / 2 + 25
    );
    
    // // Stop the Animation
    // cancelRequestAnimFrame(init);
    
    // Set the over flag
    this.over = true;
    
    // Show the restart button
    this.buttonDraw();
  }

  // Function to execute at startup
  startScreen() {
    this.draw();
    this.buttonDraw();
  };

  // Draw everything on canvas
  draw() {
    this.paintCanvas();

    this.paddles.forEach(({ x, y, width, height, }) => {
      this.ctx.fillStyle = 'green';
      this.ctx.fillRect(x, y, width, height);
    });
    
    this.ballDraw();
    this.update();

    setTimeout(this.draw, 200);
  };
  
  // Function for updating score
  updateScore() {
    this.ctx.fillStyle = 'white';
    this.ctx.font = '16px Arial, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText('Score: ' + this.points, 20, 20);
  };

  // On mounted
  mounted() {
    const ctx = document.getElementById('pingpong-canvas') as CanvasRenderingContext2D;
    
    if (ctx) {
      this.ctx = ctx;
      this.startScreen();
    }
  };
};

</script>

<style lang="scss">

</style>
