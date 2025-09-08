import { Component, Input } from '@angular/core';
import { BudgetInitial } from '../../../model/budgetInitial';

@Component({
  selector: 'ngx-chartjs',
  styleUrls: ['./chartjs.component.scss'],
  templateUrl: './chartjs.component.html',
})
export class ChartjsComponent {
  @Input() budgets: BudgetInitial[] = []
}
