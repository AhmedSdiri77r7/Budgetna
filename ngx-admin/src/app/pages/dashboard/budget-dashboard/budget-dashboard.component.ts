import { Component, OnDestroy, OnInit } from '@angular/core';
import { BudgetService } from '../../../services/budget.service';
import { BudgetStateService } from '../../../services/budget-state.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Budget } from '../../../model/Budget';

interface BudgetKPI {
  totalBudgets: number;
  budgetsValides: number;
  budgetsEnAttente: number;
  tauxValidation: number;
  budgetsTendance: {
    label: string;
    value: number;
    evolution: number; // Pourcentage d'évolution
  }[];
}

@Component({
  selector: 'ngx-budget-dashboard',
  templateUrl: './budget-dashboard.component.html',
  styleUrls: ['./budget-dashboard.component.scss'],
})
export class BudgetDashboardComponent implements OnInit, OnDestroy {
  kpis: BudgetKPI = {
    totalBudgets: 0,
    budgetsValides: 0,
    budgetsEnAttente: 0,
    tauxValidation: 0,
    budgetsTendance: [],
  };

  budgets: Budget[] = [];
  isLoading = false;

  // Chart data pour ngx-charts
  chartData: any[] = [];
  chartColorScheme = {
    domain: ['#10b981', '#f59e0b', '#ef4444', '#6366f1'],
  };

  // Status distribution
  statusChartData: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private budgetService: BudgetService,
    private budgetState: BudgetStateService,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.subscribeToStateChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    // Charger les budgets
    this.budgetService
      .getBudgets()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        budgets => {
          this.budgets = budgets;
          this.calculateKPIs();
          this.prepareChartData();
          this.isLoading = false;
        },
        error => {
          console.error('Erreur lors du chargement du dashboard:', error);
          this.isLoading = false;
        },
      );
  }

  private subscribeToStateChanges(): void {
    // S'abonner aux changements d'état en temps réel
    this.budgetState.budgets$.pipe(takeUntil(this.destroy$)).subscribe(budgets => {
      this.budgets = budgets;
      this.calculateKPIs();
      this.prepareChartData();
    });
  }

  private calculateKPIs(): void {
    const stats = this.budgetState.getBudgetStats();

    this.kpis = {
      totalBudgets: stats.totalBudgets,
      budgetsValides: stats.budgetsValides,
      budgetsEnAttente: stats.budgetsEnAttente,
      tauxValidation: stats.tauxValidation,
      budgetsTendance: [
        {
          label: 'Ce mois',
          value: this.getBudgetsCountByPeriod('month'),
          evolution: 12.5, // À calculer avec données historiques
        },
        {
          label: 'Cette semaine',
          value: this.getBudgetsCountByPeriod('week'),
          evolution: 8.3,
        },
      ],
    };
  }

  private prepareChartData(): void {
    // Données pour le graphique de statut
    this.statusChartData = [
      { name: 'Validés', value: this.kpis.budgetsValides },
      { name: 'En attente', value: this.kpis.budgetsEnAttente },
    ];

    // Données pour graphique temporel (exemple)
    this.chartData = this.getBudgetsByMonth();
  }

  private getBudgetsCountByPeriod(period: 'week' | 'month'): number {
    const now = new Date();
    const periodStart = new Date();

    if (period === 'week') {
      periodStart.setDate(now.getDate() - 7);
    } else {
      periodStart.setMonth(now.getMonth() - 1);
    }

    return this.budgets.filter(b => {
      const budgetDate = new Date(b.budgetPK?.dateDebut || now);
      return budgetDate >= periodStart && budgetDate <= now;
    }).length;
  }

  private getBudgetsByMonth(): any[] {
    // Grouper les budgets par mois pour graphique
    const monthlyData: { [key: string]: number } = {};

    this.budgets.forEach(budget => {
      const date = new Date(budget.budgetPK?.dateDebut || Date.now());
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    return Object.entries(monthlyData).map(([month, count]) => ({
      name: month,
      value: count,
    }));
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}
