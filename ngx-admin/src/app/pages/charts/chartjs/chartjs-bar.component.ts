import { Component, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { NbThemeService, NbColorHelper } from '@nebular/theme';
import { BudgetInitial } from '../../../model/budgetInitial';

@Component({
  selector: 'ngx-chartjs-bar',
  template: `
    <chart type="bar" [data]="data" [options]="options"></chart>
  `,
})
export class ChartjsBarComponent implements OnDestroy, OnChanges {
  @Input() budgets: BudgetInitial[] = [];

  data: any;
  options: any;
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;

      this.data = {
        labels: [], // Will be populated with budget names
        datasets: [
          {
            data: [], // Will be populated with tauxBudget values
            label: 'Taux',
            backgroundColor: NbColorHelper.hexToRgbA(colors.infoLight, 0.8),
          },
        ],
      };

      this.options = {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          labels: {
            fontColor: chartjs.textColor,
          },
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true, // Start the y-axis at 0
                max: 10000, // Set the maximum value of the y-axis to 10000
                fontColor: chartjs.textColor,
              },
              gridLines: {
                display: true,
                color: chartjs.axisLineColor,
              },
            },
            {
              id: 'taux-axis',
              position: 'right',
              gridLines: {
                display: false,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
        },
      };
      
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('budgets' in changes) {
      console.log(this.budgets); 

      this.updateChartData();
    }
  }

  updateChartData() {
    if (this.budgets.length > 0) {
      const tauxBudgets = this.budgets.map(budget => budget.tauxBudget);
      const budgetNames = this.budgets.map(budget => budget.name);
  
      this.data.datasets[0].data = tauxBudgets;
      this.data.labels = budgetNames;
  
      console.log(this.data); // Verify the data object
    }
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
