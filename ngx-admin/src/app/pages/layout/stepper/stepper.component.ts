import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../services/token-storage.service';
import { EmployeService } from '../../../services/employe.service';
import { Employe } from '../../../model/employe';
import { NbThemeService } from '@nebular/theme';

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
  currentStep: any;
  employe: Employe;
  stepper: any;
  decorationLightColor: string;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private tokenStorage: TokenStorageService,
    private employeService: EmployeService,
    private themeService: NbThemeService) {
      this.themeService.onThemeChange()
        .subscribe((theme) => {
          // Set the decoration light color based on the current theme
          this.decorationLightColor = theme.variables.decorationLight;
        });
        
    }
  

  ngOnInit(): void {
    this.firstForm = this.fb.group({
      firstCtrl: ['', Validators.required],
    });

    this.secondForm = this.fb.group({
      secondCtrl: ['', Validators.required],
    });

    this.thirdForm = this.fb.group({
      thirdCtrl: ['', Validators.required],
    });
  }

  onFirstSubmit() {
    this.firstForm.markAsDirty();
  }

  onSecondSubmit() {
    if (this.secondForm.valid) {
      const email = this.secondForm.get('secondCtrl').value; // Get the value of the email input field
      this.employeService.getEmployeByEmail(email).subscribe(
        (employe) => {
          console.log('Employe:', employe);
          this.email = employe.email;
          this.employe = employe; // Assign the retrieved employe object to a property in your component
          this.stepper.next(); // Move to the next step in the mat-stepper
        },
        (error) => {
          console.error('Error:', error);
          // Set a default value for this.email and this.employe in case of error
          this.email = 'N/A'; // Or any other default value that makes sense in your use case
          this.employe = null;
          this._router.navigateByUrl('/auth');
          this.tokenStorage.signOut();
        }
      );
    }
  }

  onThirdSubmit() {
    this.thirdForm.markAsDirty();
    // Use the updated email value to fetch employee data
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
