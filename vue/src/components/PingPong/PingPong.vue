<template>
  <svg width="600" height="300" ref="pp-svg" style="background-color: rgb(33,33,33);">
    <!-- If game is not started / has ended -->
    <g v-show="!gaming && !online"
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

    <g v-show="!gaming && online"
      @click="toggleReady"
      style="cursor: pointer;"
    >
      <rect 
        x="250"
        y="125"
        width="100"
        height="50"
        :fill="!ready.ready ? 'rgb(33,33,33)' : 'rgba(124,252,0, 0.5)'"
        stroke="white"
      />

      <text
        fill="white"
        :x="ready.x"
        y="155"
      >{{ready.value}}</text>
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
import axios from 'axios';

interface OnlinePingPong {
  data: OnlineGameData;
  player: -1 | 0 | 1;
  gaming: boolean;
  error?: string;
};

interface OnlineGameData {
  players: [OnlinePlayer, OnlinePlayer];
  ball: Ball;
}

interface OnlinePlayer {
  x: number;
  y: number;
  points: number;
}

interface Player {
  x: 0 | 580;
  y: number;
  width: 20;
  height: 90;
  points: number;
  movingUp: boolean;
  movingDown: boolean;
  color: 'green' | 'orange';
};

interface Ball {
  x: number;
  y: number;
  velocity: {
    x: number;
    y: number;
  };
  radius: 3;
};

interface DATA {
  currentPlayer: 0 | 1;
  players: [Player, Player];
  ball: Ball;
  message: {
    x: number;
    value: string;
  };
  ready: {
    x: number;
    value: string;
    ready: boolean;
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

  props: {
    online: Boolean,
    gaming: Boolean,
  },

  data: (): DATA => ({
    ready: {
      x: 267,
      value: 'Ready Up',
      ready: false,
    },
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

    /**
     * toggles this.ready.ready
     * and toggles the message from ReadyUp to Looking and vis versa 
    */
    toggleReady() {
      if (!this.ready.ready) {
        this.ready.ready = true;
        this.ready.value = 'Looking...';
        this.startGame();
      } else {
        this.ready.ready = false;
        this.ready.value = 'Ready Up';
      }
    },

    startGame() {
      this.$emit('toggle-gaming-off');
      this.message.value = 'Restart';
      this.message.x = 275;
      this.won.won = false;

      document.addEventListener('keyup', this.keyup);
      document.addEventListener('keydown', this.keydown);

      if (this.online) {
        this.startGameOnline();
        return;
      }

      this.startGameOffline();
    },

    gameover(playerNumber: 0 | 1) {
      this.$emit('toggle-gaming-off');

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

    startGameOnline() {
      const socket = new WebSocket('ws://localhost:8844/ws');
      const update = () => {
        // If the user stops looking for a game stop responding
        if (!this.ready.ready) {
          return;
        }

        socket.onmessage = async(event) => {
          const res: OnlinePingPong = JSON.parse(event.data);
          if (res.error) {
            socket.close();
            console.error('[server error]: ', res.error);
            return;
          }

          // While still searching for a game
          if (!this.gaming) {
            // data.player will always be -1 unless you have just connected.
            // If you have just connected the server assigns you to a certain player
            if (res.player !== -1) {
              this.currentPlayer = res.player;
            } else if (res.gaming) {
              this.$emit('toggle-gaming-on');
            }
          } else { // Update from the data given by the server
            if (res.data.players) {
              this.updatePlayersFromOnline(res.data.players);
            }
            // This is now a ball position update
            if (res.data.ball) {
              this.ball = res.data.ball; 
            }

            if (!res.gaming) {
              for (const i in res.data.players) {
                if (res.data.players[i].points === 5) {
                  this.gameover(+i as 0 | 1);
                  this.$emit('toggle-online-off');
                  this.ready.ready = false;
                  return; 
                }
              }
            }
          }
        };

        // Check if the player has done anything
        const req = {
          player: this.currentPlayer, 
          data: {
            movingUp: this.players[this.currentPlayer].movingUp,
            movingDown: this.players[this.currentPlayer].movingDown,
          },
        };
        
        const fetching = axios.post('http://localhost:8844/pingpong', req);
        fetching.then(() => {
          setTimeout(update);
        });
      };

      update();
    },

    /**
     * updates the local players from the online players
    **/
    updatePlayersFromOnline(players: OnlinePlayer[]) {
      const updatePlayer = (i: number) => {
        this.players[i].x = players[i].x as 0 | 580;
        this.players[i].y = players[i].y;
        this.players[i].points = players[i].points;
      };
      
      updatePlayer(this.currentPlayer);
      updatePlayer(this.currentPlayer === 0 ? 1 : 0);
    },

    startGameOffline() {
      this.$emit('toggle-gaming-on');
      // Make the ball move
      this.ball = {
        x: 300,
        y: 100,
        velocity: {
          x: -5,
          y: -5,
        },
        radius: 3,
      };
      
      const game = () => {
        const {
          y: playerY,
          movingUp,
          movingDown,
        } = this.players[this.currentPlayer];
        if (movingDown) {
          if (playerY <= 210) this.players[this.currentPlayer].y += 7;
        } else if (movingUp) {
          if (playerY >= 0) this.players[this.currentPlayer].y -= 7;
        }

        // Move the computer
        const {
          y: computerY,
          movingUp: computerMovingUp,
          movingDown: computerMovingDown,
        } = this.players[this.currentPlayer === 0 ? 1 : 0];

        if (computerMovingDown) {
          if (computerY <= 210) this.players[this.currentPlayer === 0 ? 1 : 0].y += 7;
          else {
            this.players[this.currentPlayer === 0 ? 1 : 0].movingDown = false;
            this.players[this.currentPlayer === 0 ? 1 : 0].movingUp = true;
          }
        } else if (computerMovingUp) {
          if (computerY >= 0) this.players[this.currentPlayer === 0 ? 1 : 0].y -= 7;
          else {
            this.players[this.currentPlayer === 0 ? 1 : 0].movingDown = true;
            this.players[this.currentPlayer === 0 ? 1 : 0].movingUp = false;
          }
        } else {
          this.players[this.currentPlayer === 0 ? 1 : 0].movingUp = true;
        }

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
                // announce that the game is over and stop the current game
                this.gameover(1);
                return;
              }
            } else {
              this.players[0].points++;
              
              if (this.players[0].points === 5) {
                // announce that the game is over and stop the current game
                this.gameover(0);
                return;
              }
            }

            this.resetFromGoal();
          }

          if (y <= radius || y >= 293) {
            this.ball.velocity.y *= -1;
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
