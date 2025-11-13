import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Budget } from '../../../../model/Budget';

@Component({
  selector: 'ngx-budget-details-dialog',
  templateUrl: './budget-details-dialog.component.html',
  styleUrls: ['./budget-details-dialog.component.scss'],
})
export class BudgetDetailsDialogComponent {
  @Input() budget: Budget;
  @Input() confirmDelete: boolean = false;

  constructor(protected dialogRef: NbDialogRef<BudgetDetailsDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
