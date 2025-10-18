import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';


@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss','./login.component.css']
})
export class LoginComponent implements OnInit {

  logIn: FormGroup;
  submitted = false;
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router:Router) { }

  ngOnInit(): void {

    /*
    this.logIn = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
      password: ['', Validators.required],
      
    });
     */

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }

    this.logIn = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.email]),
      password: new FormControl('', Validators.required),
      
    });

    
  }
  
  get f() {
    return this.logIn.controls;
  }

  submit(){
    console.log(typeof(this.logIn.value));
    this.authService.login(this.logIn.value).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        localStorage.setItem('token-access',this.tokenStorage.getToken());
        localStorage.setItem('email',this.tokenStorage.getUser().email);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        console.log(this.tokenStorage.getToken());
        console.log(localStorage.getItem('email').toString());
        this.router.navigateByUrl('/pages');
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }


  reloadPage(): void {
    window.location.reload();
  }


}


