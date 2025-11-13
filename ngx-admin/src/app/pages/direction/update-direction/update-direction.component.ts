import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Router } from '@angular/router';
import { Direction } from '../../../model/direction';
import { Entreprise } from '../../../model/entreprise';
import { DirectionService } from '../../../services/direction.service';
import { EntrepriseService } from '../../../services/entreprise.service';
import { TokenStorageService } from '../../../services/token-storage.service';

@Component({
  selector: 'ngx-update-direction',
  templateUrl: './update-direction.component.html',
  styleUrls: ['./update-direction.component.scss'],
})
export class UpdateDirectionComponent implements OnInit {
  direction: Direction = new Direction();
  selectedEntrepriseId: number;
  entreprises: Entreprise[];

  constructor(
    private _router: Router,
    private tokenStorage: TokenStorageService,
    private dialogRef: NbDialogRef<UpdateDirectionComponent>,
    private serviceEntreprise: EntrepriseService,
    private serviceDirection: DirectionService,
  ) {}

  ngOnInit(): void {
    this.serviceEntreprise.getEntreprises().subscribe(
      data => (this.entreprises = data),
      _err => {
        this._router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
      },
    );
    this.serviceDirection.$eventEmit.subscribe(
      data => {
        this.direction = data;
        if (data.entreprise != null) {
          this.selectedEntrepriseId = data.entreprise.id;
        }
      },
      _err => {
        this._router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
      },
    );
  }

  addDirection(): void {
    this.serviceDirection.addDirection(this.direction, this.selectedEntrepriseId).subscribe(
      () => {
        this.dialogRef.close();
      },
      _err => {
        this._router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
      },
    );
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
