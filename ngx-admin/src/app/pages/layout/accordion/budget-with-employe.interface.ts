import { Budget } from '../../../model/Budget';
import { Employe } from '../../../model/employe';

export interface BudgetWithEmploye extends Budget {
  employeInfo?: Employe;
}
