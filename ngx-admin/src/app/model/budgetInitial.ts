import { Direction } from "./direction";


export class BudgetInitial {
  id: number;
  name: string;
  description: string;
  tauxBudget: number;
  direction: Direction;
  static tauxBudget: any;
}
