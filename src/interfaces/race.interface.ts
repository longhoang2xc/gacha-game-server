export interface IRace {
  id: string;
  playerId: string;
  carId: string;
  duration: number;
  dateStart: string | Date;
  difficultScale: string;
  actualWinRate: number;
  isWon: boolean | null;
  prize: number;
}
