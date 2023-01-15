export interface IStakingFund {
  id: string;
  playerId: string;
  amount: number;
  scale: string;
  returnAmount: number; //profit
  lossInitialFundAmount: number;
  returnPercent: number;
  lossPercent: number;
  lossInitialFundPercent: number;
  dateStart: string | Date;
  dateEnd: string | Date;
}
