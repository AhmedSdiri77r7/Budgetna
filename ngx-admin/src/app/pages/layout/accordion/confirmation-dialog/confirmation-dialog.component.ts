import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-confirmation-dialog',
  template: `
    <nb-card>
      <nb-card-header class="d-flex align-items-center justify-content-between">
        <h5>{{ title }}</h5>
        <button nbButton ghost (click)="close()" class="close">
          <nb-icon icon="close-outline"></nb-icon>
        </button>
      </nb-card-header>
      <nb-card-body>
        <p>{{ message }}</p>
      </nb-card-body>
      <nb-card-footer class="d-flex justify-content-end">
        <button nbButton status="basic" (click)="close()" class="mr-2">Annuler</button>
        <button nbButton status="primary" (click)="confirm()">Confirmer</button>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [
    `
      .close {
        margin-left: 1rem;
      }
      .mr-2 {
        margin-right: 1rem;
      }
    `,
  ],
})
export class ConfirmationDialogComponent {
  @Input() title: string;
  @Input() message: string;

  constructor(protected dialogRef: NbDialogRef<ConfirmationDialogComponent>) {}

  close() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
