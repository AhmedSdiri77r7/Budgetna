import { Component, HostBinding, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BudgetInitial } from '../../../../model/budgetInitial';
import { BudgetService } from '../../../../services/budget.service';

@Component({
  selector: 'ngx-news-post-placeholder',
  templateUrl: 'news-post-placeholder.component.html',
  styleUrls: ['news-post-placeholder.component.scss'],
})
export class NewsPostPlaceholderComponent implements OnInit {
  budgetInitial: BudgetInitial = new BudgetInitial();

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<NewsPostPlaceholderComponent>,
    private budgetService: BudgetService,
  ) {}

  ngOnInit(): void {
    this.budgetService.$eventEmit.subscribe(data => {
      this.budgetInitial = data;
    });
  }

  updateBI(): void {
    this.budgetService.ajouterBudgetInitial(this.budgetInitial).subscribe(() => {
      this.dialogRef.close();
      this.router.navigateByUrl('/pages/layout/infinite-list').then(() => window.location.reload());
    });
  }
}
