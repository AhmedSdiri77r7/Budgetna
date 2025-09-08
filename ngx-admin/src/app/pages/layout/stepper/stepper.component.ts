import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../services/token-storage.service';
import { EmployeService } from '../../../services/employe.service';
import { Employe } from '../../../model/employe';
import { NbThemeService } from '@nebular/theme';
import { NbStepperComponent } from '@nebular/theme';  // Import de NbStepperComponent

@Component({
  selector: 'ngx-stepper',
  templateUrl: 'stepper.component.html',
  styleUrls: ['stepper.component.scss'],
})
export class StepperComponent implements OnInit {
  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;
  email: string = '';
  employe: Employe;
  decorationLightColor: string;

  @ViewChild(NbStepperComponent) stepper: NbStepperComponent;  // Référence au stepper

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private tokenStorage: TokenStorageService,
    private employeService: EmployeService,
    private themeService: NbThemeService
  ) {
    this.themeService.onThemeChange().subscribe((theme) => {
      // Set the decoration light color based on the current theme
      this.decorationLightColor = theme.variables.decorationLight;
    });
  }

  ngOnInit(): void {
    this.firstForm = this.fb.group({
      firstCtrl: ['', Validators.required],
    });

    this.secondForm = this.fb.group({
      secondCtrl: ['', [Validators.required, Validators.email]],  // Ajout d'une validation pour l'email
    });

    this.thirdForm = this.fb.group({
      thirdCtrl: ['', Validators.required],
    });
  }

  onFirstSubmit() {
    if (this.firstForm.valid) {
      this.firstForm.markAsDirty();
      this.stepper.next();  // Passage à l'étape suivante
    }
  }

  onSecondSubmit() {
    if (this.secondForm.valid) {
      const email = this.secondForm.get('secondCtrl').value;
      this.employeService.getEmployeByEmail(email).subscribe(
        (employe) => {
          this.email = employe.email;
          this.employe = employe;
          console.log('🚀 Employe:', this.employe);
          this.stepper.next();  // Passage à l'étape suivante
        },
        (error) => {
          this.email = 'N/A';
          this.employe = null;
          this._router.navigateByUrl('/auth');
          this.tokenStorage.signOut();
        }
      );
    }
  }
  getImageUrl(imageName: string): string {
    return `http://localhost:8081/employe/image/${imageName}`;
  }
  onThirdSubmit() {
    if (this.thirdForm.valid) {
      this.thirdForm.markAsDirty();
      this.employeService.getEmployeByEmail(this.email).subscribe(
        (employe) => {
          console.log('Employe:', employe);
          // Handle fetched employee data as needed
        },
        (error) => {
          console.error('Error:', error);
          // Handle error as needed
          this._router.navigateByUrl('/auth');
          this.tokenStorage.signOut();
        }
      );
    }
  }
}
