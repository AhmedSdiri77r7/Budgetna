import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'ngx-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss','./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUp : FormGroup;
  submitted = false;
  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  Roles = [{name :"INGENIEUR"},{name :"ADMINISTRATEUR"},{name :"CHEF_DEPARTEMENT"}];

  constructor(private authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    

    this.signUp = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      repeatPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
      role: new FormControl('', [Validators.required]),
      
    });

  }

  get fs() {
    return this.signUp.controls;
  }

  onSubmit(){
    console.log("data",this.signUp.value)
    if(this.signUp.value.password != this.signUp.value.repeatPassword)
      alert("password and repeat password must match");
      else{
        const objet = {nom:this.signUp.value.nom,prenom:this.signUp.value.prenom,email:this.signUp.value.email,password:this.signUp.value.password,role:this.signUp.value.role}
        console.log("objet user",objet)
        this.authService.register(objet).subscribe(
          data => {
            console.log(data);
            this.isSuccessful = true;
            this.isSignUpFailed = false;
            this.router.navigateByUrl("/auth/login")
          },
          err => {
            alert(err.message)
            this.errorMessage = err.error.message;
            this.isSignUpFailed = true;
          }
        );
      }
  }



}
