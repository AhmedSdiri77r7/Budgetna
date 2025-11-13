import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Router } from '@angular/router';
import { Direction } from '../../../model/direction';
import { Entreprise } from '../../../model/entreprise';
import { DirectionService } from '../../../services/direction.service';
import { EntrepriseService } from '../../../services/entreprise.service';

@Component({
  selector: 'ngx-add-direction',
  templateUrl: './add-direction.component.html',
  styleUrls: ['./add-direction.component.scss'],
})
export class AddDirectionComponent implements OnInit {
  direction: Direction = new Direction();
  selectedEntrepriseId: number;
  entreprises: Entreprise[];

  constructor(
    private _router: Router,
    private dialogRef: NbDialogRef<AddDirectionComponent>,
    private serviceEntreprise: EntrepriseService,
    private serviceDirection: DirectionService,
  ) {}

  ngOnInit(): void {
    this.serviceEntreprise.getEntreprises().subscribe(data => (this.entreprises = data));
  }

  addDirection(): void {
    this.serviceDirection.addDirection(this.direction, this.selectedEntrepriseId).subscribe(() => {
      this.dialogRef.close();
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
