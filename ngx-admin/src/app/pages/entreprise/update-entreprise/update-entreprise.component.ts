import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Router } from '@angular/router';
import { Entreprise } from '../../../model/entreprise';
import { EntrepriseService } from '../../../services/entreprise.service';
import { TokenStorageService } from '../../../services/token-storage.service';

@Component({
  selector: 'ngx-update-entreprise',
  templateUrl: './update-entreprise.component.html',
  styleUrls: ['./update-entreprise.component.scss'],
})
export class UpdateEntrepriseComponent implements OnInit {
  entreprise: Entreprise = new Entreprise();
  constructor(
    private _router: Router,
    private tokenStorage: TokenStorageService,
    private dialogRef: NbDialogRef<UpdateEntrepriseComponent>,
    private entrepriseService: EntrepriseService,
  ) {}

  ngOnInit(): void {
    this.entrepriseService.$eventEmit.subscribe(
      data => {
        this.entreprise = data;
      },
      _err => {
        this._router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
      },
    );
  }

  updateEntreprise(): void {
    this.entrepriseService.addEntreprise(this.entreprise).subscribe(
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
