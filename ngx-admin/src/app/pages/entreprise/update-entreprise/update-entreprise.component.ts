import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Entreprise } from '../../../model/entreprise';
import { EntrepriseService } from '../../../services/entreprise.service';
import { TokenStorageService } from '../../../services/token-storage.service';
@Component({
  selector: 'ngx-update-entreprise',
  templateUrl: './update-entreprise.component.html',
  styleUrls: ['./update-entreprise.component.scss']
})
export class UpdateEntrepriseComponent implements OnInit {
  entreprise:Entreprise=new Entreprise();
  constructor(private _router:Router,private tokenStorage:TokenStorageService,private dialogRef:MatDialogRef<UpdateEntrepriseComponent>,private entrepriseService: EntrepriseService) { }

  ngOnInit(): void {
    this.entrepriseService.$eventEmit.subscribe((data)=> {
      this.entreprise=data;
      console.log(this.entreprise);
    },err => {
      this._router.navigateByUrl("/auth");
      this.tokenStorage.signOut();
    });
  }
  updateEntreprise(){
    
    this.entrepriseService.addEntreprise(this.entreprise).subscribe(()=>{
      this.dialogRef.close();
      this._router.navigateByUrl('/pages/entreprise', { skipLocationChange: true }).then(() => {
        this._router.navigate(['/pages/entreprise']);
      }); 
    },err => {
      this._router.navigateByUrl("/auth");
      this.tokenStorage.signOut();
    });
    
  }
}
