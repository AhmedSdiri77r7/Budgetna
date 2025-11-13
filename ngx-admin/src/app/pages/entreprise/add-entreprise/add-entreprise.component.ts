import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Router } from '@angular/router';
import { Entreprise } from '../../../model/entreprise';
import { EntrepriseService } from '../../../services/entreprise.service';
import { TokenStorageService } from '../../../services/token-storage.service';

@Component({
  selector: 'ngx-add-entreprise',
  templateUrl: './add-entreprise.component.html',
  styleUrls: ['./add-entreprise.component.scss'],
})
export class AddEntrepriseComponent {
  entreprise: Entreprise = new Entreprise();
  constructor(
    private _router: Router,
    private tokenStorage: TokenStorageService,
    private dialogRef: NbDialogRef<AddEntrepriseComponent>,
    private entrepriseService: EntrepriseService,
  ) {}

  addEntreprise(): void {
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
