export interface GameState {
  rows: number;
  columns: number;
  state: "playing" | "won" | "lost";
  numberOfSwaps: number;
  maxNumberOfSwaps: number;
  connectors: string[];
}
