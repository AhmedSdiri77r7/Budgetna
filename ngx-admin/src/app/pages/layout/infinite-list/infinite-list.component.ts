import { Component, OnInit } from '@angular/core';
import { BudgetInitial } from '../../../model/budgetInitial';
import { BudgetService } from '../../../services/budget.service';
import { NewsPostComponent } from './news-post/news-post.component';
import { NewsPostPlaceholderComponent } from './news-post-placeholder/news-post-placeholder.component';
import { MatDialog } from '@angular/material/dialog';
import { ExcelService } from '../../../services/excel.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../services/token-storage.service';
import { EmployeService } from '../../../services/employe.service';
import { Employe } from '../../../model/employe';
import { Budget } from '../../../model/Budget';

@Component({
  selector: 'ngx-infinite-list',
  templateUrl: 'infinite-list.component.html',
  styleUrls: ['infinite-list.component.scss'],
})
export class InfiniteListComponent implements OnInit {
  public budgetInitials: BudgetInitial[];
  public editBudgetInitial: BudgetInitial;
  budgetInitial: BudgetInitial;
  employe: Employe[];
  budgets: Budget[];
  selectedEmployeId: number;

  constructor(
    private _router: Router,
    private tokenStorage: TokenStorageService,
    private budgetService: BudgetService,
    private matDialog: MatDialog,
    private excelService: ExcelService,
    private employeService: EmployeService
  ) {}

  ngOnInit(): void {
    this.budgetService.getBudgetInitial().subscribe((data) => {
      console.log(data);
      console.log();
      this.budgetInitials = data;
    });

    this.getUsers();

    this.loadBudgets();
  }

  onOpenDialogClick1() {
    this.matDialog.open(NewsPostComponent);
  }

  getUsers(): void {
    this.employeService.getEmployes().subscribe(
      (data) => {
        this.employe = data;
        console.log(data);
      },
      (err) => {
        this._router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
      }
    );
  }

  loadBudgets(): void {
    if (this.selectedEmployeId) {
      this.budgetService
        .findAllBudgetByEmployeJPQL(this.selectedEmployeId)
        .subscribe(
          (response) => {
            this.budgets = response.body;
          },
          (error) => {
            console.error('Error fetching budgets:', error);
          }
        );
    } else {
      this.budgets = [];
    }
  }

  deleteBudI(id: number): void {
    this.budgetService.deleteBudgetInitial(id).subscribe(() => {
      this.budgetService.getBudgetInitial().subscribe(
        (data) => {
          this.budgetInitials = data;
          console.log(data);
        },
        (err) => {
          this._router.navigateByUrl('/auth');
          this.tokenStorage.signOut();
        }
      );
    }, (err) => {
      this._router.navigateByUrl('/auth');
      this.tokenStorage.signOut();
    });
  }

  updateBudgetInitial(idBudgetInitial: number) {
    this.budgetInitial = this.budgetService.sendEventData(idBudgetInitial);
    this.matDialog.open(NewsPostPlaceholderComponent);
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.budgetInitials, 'listBudgetInitial');
  }
}
