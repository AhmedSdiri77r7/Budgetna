import { BudgetInitial } from "./budgetInitial";
import { BudgetRevise } from "./budgetRevise";
import { Entreprise } from "./entreprise";

export class Direction{
    id:number;
    name:string;
    budgetInitial:BudgetInitial;
    budgetRevise:BudgetRevise;
    entreprise:Entreprise;
  static budgetInitial: any;
  static budgetRevise: any;
}
