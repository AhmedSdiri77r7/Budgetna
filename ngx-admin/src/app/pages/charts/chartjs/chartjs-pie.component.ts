import { Component, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-chartjs-pie',
  template: `
    <chart type="pie" [data]="data" [options]="options"></chart>
  `,
})
export class ChartjsPieComponent implements OnChanges, OnDestroy {
  @Input() budgetData: number[] = [];

  data: any;
  options: any;
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;

      this.updateChartData(); // Call the function to update chart data

      this.options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          // ... Your scales configuration ...
        },
        legend: {
          labels: {
            fontColor: chartjs.textColor,
          },
        },
      };
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.budgetData) {
      this.updateChartData();
    }
  }

  updateChartData(): void {
    this.data = {
      labels: ['budget', 'Label 2', 'Label 3'], // Update with your labels
      datasets: [{
        data: this.budgetData,
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'], // Update with your colors
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'], // Update with your colors
        borderWidth: 1,
      }],
    };
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
