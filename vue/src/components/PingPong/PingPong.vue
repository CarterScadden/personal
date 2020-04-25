<template>
  <svg width="600" height="300" ref="pp-svg" style="background-color: rgb(33,33,33);">
    <!-- If game is not started / has ended -->
    <g v-show="!gaming"
      @click="startGame"
      style="cursor: pointer;"
    >
      <rect 
        x="250"
        y="125"
        width="100"
        height="50"
        fill="rgb(33,33,33)"
        stroke="white"
      />

      <text
        fill="white"
        :x="message.x"
        y="155"
      >{{message.value}}</text>
    </g>

    <text v-show="!gaming && won.won"
      fill="white"
      :x="won.x"
      :y="won.y"
    >{{won.message}}</text>

    <text
      fill="white"
      x="10"
      y="25"
    >Score: {{players[0].points}}</text>

    <text
      fill="white"
      x="530"
      y="25"
    >Score: {{players[1].points}}</text>

    <!-- restart button -->
    <rect v-for="(p, i) in players" :key="i"
      :fill="p.color"
      :x="p.x"
      :y="p.y"
      :width="p.width"
      :height="p.height"
    />

    <!-- ball -->
    <circle 
      :cx="ball.x"
      :cy="ball.y"
      :r="ball.radius"
      fill="yellow"
    />
  </svg>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue';

interface Player {
  x: 0 | 580;
  y: number;
  width: 20;
  height: 90;
  points: number;
  movingUp: boolean;
  movingDown: boolean;
  color: 'green' | 'orange';
}

interface DATA {
  currentPlayer: 0 | 1;
  players: [Player, Player];
  ball: {
    x: number;
    y: number;
    velocity: {
      x: number;
      y: number;
    };
    radius: 3;
  };
  online: boolean;
  gaming: boolean;
  message: {
    x: number;
    value: string;
  };
  won: {
    x: number;
    y: number;
    won: boolean;
    message: 'Player 1 Won!' | 'Player 2 Won!';
  };
}

export default Vue.extend({
  // Useing https://github.com/posva/vue-reactive-refs for reactive refs to watch the svg
  refs: ['pp-svg'],

  data: (): DATA => ({
    currentPlayer: 1,
    players: [
      {
        x: 0,
        y: 110,
        width: 20,
        height: 90,
        points: 0,
        movingUp: false,
        movingDown: false,
        color: 'green',
      },
      {
        x: 580,
        y: 110,
        width: 20,
        height: 90,
        points: 0,
        movingUp: false,
        movingDown: false,
        color: 'orange',
      }
    ],
    ball: {
      x: 300,
      y: 100,
      velocity: {
        x: 0,
        y: 0,
      },
      radius: 3,
    },
    online: false,
    gaming: false,
    message: {
      x: 282,
      value: 'Start',
    },
    won: {
      x: 300,
      y: 150,
      won: false,
      message: 'Player 1 Won!',
    },
  }),

  methods: {
    keyup(e: KeyboardEvent) {
      const { currentPlayer, } = this;
      const { key, } = e;
      
      switch (key) {
        case 'w':
          this.players[currentPlayer].movingUp = false;
          break;
        case 's':
          this.players[currentPlayer].movingDown = false;
          break;
        case 'ArrowUp':
          this.players[currentPlayer].movingUp = false;
          break;
        case 'ArrowDown':
          this.players[currentPlayer].movingDown = false;
          break;
      }
    },

    keydown(e: KeyboardEvent) {
      const { currentPlayer, } = this;
      const { key, } = e;
      
      switch (key) {
        case 'w':
          this.players[currentPlayer].movingUp = true;
          this.players[currentPlayer].movingDown = false;
          break;
        case 's':
          this.players[currentPlayer].movingDown = true;
          this.players[currentPlayer].movingUp = false;
          break;
        case 'ArrowUp':
          this.players[currentPlayer].movingUp = true;
          this.players[currentPlayer].movingDown = false;
          break;
        case 'ArrowDown':
          this.players[currentPlayer].movingDown = true;
          this.players[currentPlayer].movingUp = false;
          break;
      }
    },

    startGame() {
      this.gaming = false;
      this.message.value = 'Restart';
      this.message.x = 275;
      this.won.won = false;

      document.addEventListener('keyup', this.keyup);
      document.addEventListener('keydown', this.keydown);

      if (this.online) {
        console.log('GOING TO ONLINE');
        return;
      }

      this.startGameOffline();
    },

    gameover(playerNumber: 0 | 1) {
      this.gaming = false;

      this.players[0].points = 0;
      this.players[1].points = 0;

      this.ball = {
        x: 300,
        y: 100,
        velocity: {
          x: 0,
          y: 0,
        },
        radius: 3,
      };

      if (playerNumber === 0) {
        this.won.message = 'Player 1 Won!';
      } else {
        this.won.message = 'Player 2 Won!';
      }
    },

    resetFromGoal() {
      this.ball = {
        x: 300,
        y: 100,
        velocity: {
          x: -5,
          y: -5,
        },
        radius: 3,
      };
    },

    checkIfPlayerHit(): boolean {
      const { x, y, radius, } = this.ball;

      // Subtracting the balls x by the radius for more accurate calculations
      if ((this.players[0].x + 20) >= (x - radius)) {
        const underTop = this.players[0].y < y;
        const overBottom = (this.players[0].y + this.players[0].height) > y;

        if (underTop && overBottom) {
          return true;
        } else {
          // For the sake of not complicating the code more, The ball will be 
          // counted as scored
          return false;
        }
      } else if (this.players[1].x <= (x + radius)) {
        const underTop = this.players[1].y < y;
        const overBottom = (this.players[1].y + this.players[1].height) > y;

        if (underTop && overBottom) {
          return true;
        } else {
          // For the sake of not complicating the code more, The ball will be 
          // counted as scored
          return false;
        }
      };

      return false;
    },

    startGameOffline() {
      this.gaming = true;
      // Make the ball move
      this.ball.velocity.x = -5;
      this.ball.velocity.y = -5;
      
      const game = () => {
        this.players.forEach((player: Player) => {
          const { y, movingUp, movingDown, } = player;
          if (movingDown) {
            if (y !== 210) player.y += 7;
          } else if (movingUp) {
            if (y !== 0) player.y -= 7;
          }

          // for online
          // if (player.y !== y) {

          // }
        });

        const { ball, } = this;
        const { x, y, radius, } = ball;
        
        const playerhit = this.checkIfPlayerHit();

        // If player paddle is not hit
        if (!playerhit) {
          // If ball is in place for a score
          if (x <= radius || x >= (580 - radius)) { // Subtracted by 3 for the radius
            if (x <= 0) {
              this.players[1].points++;

              if (this.players[1].points === 5) {
                this.gameover(1);
              }
            } else {
              this.players[0].points++;
              
              if (this.players[0].points === 5) {
                this.gameover(0);
              }
            }

            this.resetFromGoal();
          }

          if (y <= radius || y >= 293) {
            this.ball.velocity.y *= -1;

            // if (y <=3) {
            //   this.ball.velocity.y *= -1
            // } else {
              
            // }
          }
        } else { // If player paddle is hit
          if (this.ball.velocity.x < 9) {
            this.ball.velocity.x *= -1.2;
          }
        }
        
        this.ball.x += this.ball.velocity.x;
        this.ball.y += this.ball.velocity.y;

        setTimeout(game, 25);
      };

      game();
    },
  },

  mounted() {
    this.currentPlayer = 0;
    console.log(this.currentPlayer);
  },

  beforeDestroy() {
    // @ts-ignore
    document.removeEventListener('keyup', this.keyup);
    // @ts-ignore
    document.removeEventListener('keydown', this.keydown);
  },
});

</script>

<style lang="scss">

</style>
