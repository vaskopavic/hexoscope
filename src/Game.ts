import { GameState } from "./types";

class Game {
  private rows: number;
  private columns: number;
  private state: string;
  private numberOfSwaps: number;
  private maxNumberOfSwaps: number;
  private connectors: string[];

  constructor(gameId: string) {
    const json: GameState = require(`./${gameId}.json`);

    this.rows = json.rows;
    this.columns = json.columns;
    this.state = json.state;
    this.numberOfSwaps = json.numberOfSwaps;
    this.maxNumberOfSwaps = json.maxNumberOfSwaps;
    this.connectors = json.connectors;

    console.log(`Hexoscope -- level ${gameId} loaded!`);
  }

  swap(conn1: string, conn2: string) {
    // Implement swap() method here
  }

  undo() {
    // Implement undo() method here
  }
}

const game = new Game("1");
