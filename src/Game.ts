import { GameState } from "./types";

class Game {
  private rows: number;
  private columns: number;
  private state: string;
  private numberOfSwaps: number;
  private maxNumberOfSwaps: number;
  private connectors: string[];
  private matrixStack: string[][][];

  constructor(gameId: string) {
    const json: GameState = require(`./${gameId}.json`);

    this.rows = json.rows;
    this.columns = json.columns;
    this.state = json.state;
    this.numberOfSwaps = json.numberOfSwaps;
    this.maxNumberOfSwaps = json.maxNumberOfSwaps;
    this.connectors = json.connectors;
    this.matrixStack = [];

    console.log(`Hexoscope -- level ${gameId} loaded!`);
    console.log("==================================");
    this.printStats();
  }

  printStats(): void {
    console.log("\nCONNECTORS:");
    for (let i = 0; i < this.rows; i++) {
      let row = "";
      for (let j = 0; j < this.columns; j++) {
        if (this.connectors[i * this.columns + j].length === 0) {
          row += "x-x-x";
        }
        row += this.connectors[i * this.columns + j] + " ";
      }
      console.log(row);
    }

    console.log(`\nSWAPS: ${this.numberOfSwaps} / ${this.maxNumberOfSwaps}`);
    console.log(`STATE: ${this.state}`);
  }

  convertToMatrix(connectors: string[]): string[][] {
    return connectors.reduce((matrix, connector, index) => {
      const row = Math.floor(index / this.columns);
      matrix[row] = matrix[row] || [];
      matrix[row].push(connector);
      return matrix;
    }, []);
  }

  renameConnectors(connectors: string[]): string[] {
    return connectors.map((connector) => {
      if (!connector.includes("sc") && !connector.includes("ec")) {
        return connector.replace("cc", "rc");
      }
      return connector;
    });
  }

  convertToArray(matrix: string[][]): string[] {
    return matrix.reduce((connectors, row) => connectors.concat(row), []);
  }

  getStartingConnectorPosition(matrix: string[][]): number[] {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (matrix[i][j].includes("sc")) {
          return [i, j];
        }
      }
    }
    return [-1, -1];
  }

  isMatrixOutOfBounds(matrix: string[][], row: number, col: number): boolean {
    return (
      row < 0 || col < 0 || row >= matrix.length || col >= matrix[0].length
    );
  }

  dfs(
    row: number,
    col: number,
    visited: Map<string, boolean>,
    matrix: string[][]
  ): boolean {
    if (matrix[row][col].includes("ec")) {
      return true;
    }

    if (visited.has(`${row}-${col}`)) {
      return false;
    }

    visited.set(`${row}-${col}`, true);

    const isRowEven: boolean = row % 2 === 0;

    const neighbours: number[][] = [];

    const leftNeighbour: number[] = isRowEven ? [row, col - 1] : [row, col - 1];
    const rightNeighbour: number[] = isRowEven
      ? [row, col + 1]
      : [row, col + 1];
    const downLeftNeighbour: number[] = isRowEven
      ? [row + 1, col - 1]
      : [row + 1, col];
    const downRightNeighbour: number[] = isRowEven
      ? [row + 1, col]
      : [row + 1, col + 1];
    const upLeftNeighbour: number[] = isRowEven
      ? [row - 1, col - 1]
      : [row - 1, col];
    const upRightNeighbour: number[] = isRowEven
      ? [row - 1, col]
      : [row - 1, col + 1];

    const isLeftNeighbourOutOfBounds = this.isMatrixOutOfBounds(
      matrix,
      leftNeighbour[0],
      leftNeighbour[1]
    );
    const isRightNeighbourOutOfBounds = this.isMatrixOutOfBounds(
      matrix,
      rightNeighbour[0],
      rightNeighbour[1]
    );
    const isDownLeftNeighbourOutOfBounds = this.isMatrixOutOfBounds(
      matrix,
      downLeftNeighbour[0],
      downLeftNeighbour[1]
    );
    const isDownRightNeighbourOutOfBounds = this.isMatrixOutOfBounds(
      matrix,
      downRightNeighbour[0],
      downRightNeighbour[1]
    );
    const isUpLeftNeighbourOutOfBounds = this.isMatrixOutOfBounds(
      matrix,
      upLeftNeighbour[0],
      upLeftNeighbour[1]
    );
    const isUpRightNeighbourOutOfBounds = this.isMatrixOutOfBounds(
      matrix,
      upRightNeighbour[0],
      upRightNeighbour[1]
    );

    const isLeftNeighbourConnected =
      !isLeftNeighbourOutOfBounds &&
      matrix[leftNeighbour[0]][leftNeighbour[1]]?.includes("2") &&
      matrix[row][col].includes("5");

    const isRightNeighbourConnected =
      !isRightNeighbourOutOfBounds &&
      matrix[rightNeighbour[0]][rightNeighbour[1]]?.includes("5") &&
      matrix[row][col].includes("2");

    const isDownLeftNeighbourConnected =
      !isDownLeftNeighbourOutOfBounds &&
      matrix[downLeftNeighbour[0]][downLeftNeighbour[1]]?.includes("1") &&
      matrix[row][col].includes("4");

    const isDownRightNeighbourConnected =
      !isDownRightNeighbourOutOfBounds &&
      matrix[downRightNeighbour[0]][downRightNeighbour[1]]?.includes("6") &&
      matrix[row][col].includes("3");

    const isUpLeftNeighbourConnected =
      !isUpLeftNeighbourOutOfBounds &&
      matrix[upLeftNeighbour[0]][upLeftNeighbour[1]]?.includes("3") &&
      matrix[row][col].includes("6");

    const isUpRightNeighbourConnected =
      !isUpRightNeighbourOutOfBounds &&
      matrix[upRightNeighbour[0]][upRightNeighbour[1]]?.includes("4") &&
      matrix[row][col].includes("1");

    if (
      isLeftNeighbourConnected ||
      isRightNeighbourConnected ||
      isDownLeftNeighbourConnected ||
      isDownRightNeighbourConnected ||
      isUpLeftNeighbourConnected ||
      isUpRightNeighbourConnected
    ) {
      matrix[row][col] = matrix[row][col].replace("rc", "cc");
    }

    if (isLeftNeighbourConnected) {
      matrix[leftNeighbour[0]][leftNeighbour[1]] = matrix[leftNeighbour[0]][
        leftNeighbour[1]
      ].replace("rc", "cc");
      neighbours.push(leftNeighbour);
      if (matrix[leftNeighbour[0]][leftNeighbour[1]].includes("ec")) {
        this.state = "won";
      }
    }

    if (isRightNeighbourConnected) {
      matrix[rightNeighbour[0]][rightNeighbour[1]] = matrix[rightNeighbour[0]][
        rightNeighbour[1]
      ].replace("rc", "cc");
      neighbours.push(rightNeighbour);
      if (matrix[rightNeighbour[0]][rightNeighbour[1]].includes("ec")) {
        this.state = "won";
      }
    }

    if (isDownLeftNeighbourConnected) {
      matrix[downLeftNeighbour[0]][downLeftNeighbour[1]] = matrix[
        downLeftNeighbour[0]
      ][downLeftNeighbour[1]].replace("rc", "cc");
      neighbours.push(downLeftNeighbour);
      if (matrix[downLeftNeighbour[0]][downLeftNeighbour[1]].includes("ec")) {
        this.state = "won";
      }
    }

    if (isDownRightNeighbourConnected) {
      matrix[downRightNeighbour[0]][downRightNeighbour[1]] = matrix[
        downRightNeighbour[0]
      ][downRightNeighbour[1]].replace("rc", "cc");
      neighbours.push(downRightNeighbour);
      if (matrix[downRightNeighbour[0]][downRightNeighbour[1]].includes("ec")) {
        this.state = "won";
      }
    }

    if (isUpLeftNeighbourConnected) {
      matrix[upLeftNeighbour[0]][upLeftNeighbour[1]] = matrix[
        upLeftNeighbour[0]
      ][upLeftNeighbour[1]].replace("rc", "cc");
      neighbours.push(upLeftNeighbour);
      if (matrix[upLeftNeighbour[0]][upLeftNeighbour[1]].includes("ec")) {
        this.state = "won";
      }
    }

    if (isUpRightNeighbourConnected) {
      matrix[upRightNeighbour[0]][upRightNeighbour[1]] = matrix[
        upRightNeighbour[0]
      ][upRightNeighbour[1]].replace("rc", "cc");
      neighbours.push(upRightNeighbour);
      if (matrix[upRightNeighbour[0]][upRightNeighbour[1]].includes("ec")) {
        this.state = "won";
      }
    }

    for (let neighbour of neighbours) {
      this.dfs(neighbour[0], neighbour[1], visited, matrix);
    }
  }

  swap(conn1Index: number, conn2Index: number) {
    if (this.state !== "playing") {
      return;
    }

    const conn1 = this.connectors[conn1Index];
    const conn2 = this.connectors[conn2Index];

    if (conn1Index === -1 || conn2Index === -1) {
      console.log("\nCannot swap non-existent connectors");
      return;
    }

    if (conn1.includes("sc" || "ec") || conn2.includes("sc" || "ec")) {
      console.log("\nCannot swap start or end connectors");
      return;
    }

    const previousConnectors = [...this.connectors];

    const temp = this.connectors[conn1Index];
    this.connectors[conn1Index] = this.connectors[conn2Index];
    this.connectors[conn2Index] = temp;

    this.matrixStack.push(this.convertToMatrix(previousConnectors));

    this.numberOfSwaps++;

    const renamedConnectors = this.renameConnectors(this.connectors);
    const matrix = this.convertToMatrix(renamedConnectors);
    const [startRow, startCol] = this.getStartingConnectorPosition(matrix);
    const visited = new Map<string, boolean>();
    this.dfs(startRow, startCol, visited, matrix);

    this.connectors = this.convertToArray(matrix);

    if (
      this.state === "playing" &&
      this.numberOfSwaps >= this.maxNumberOfSwaps
    ) {
      this.state = "lost";
    }

    console.log("\nSwapping connectors...");
    console.log("==================================");
    this.printStats();
  }

  undo() {
    if (this.numberOfSwaps === 0) {
      console.log("\nCannot undo first move");
      return;
    }

    const previousMatrix = this.matrixStack.pop();

    this.connectors = this.convertToArray(previousMatrix);
    this.state = "playing";
    this.numberOfSwaps--;

    console.log("\nUndoing last move...");
    console.log("==================================");
    this.printStats();
  }
}

// const game = new Game("1");
// game.swap(4, 9);
// game.undo();
// game.swap(5, 12);

const game2 = new Game("2");
game2.swap(9, 8);
game2.swap(12, 10);
game2.swap(21, 10);
game2.swap(26, 8);
game2.swap(34, 33);
