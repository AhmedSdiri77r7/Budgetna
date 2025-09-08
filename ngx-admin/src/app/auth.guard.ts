import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { EmployeService } from './services/employe.service';
import { TokenStorageService } from './services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(private router:Router,private empService : EmployeService,private authService:AuthService,private tokenStorage: TokenStorageService){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      

      if (this.tokenStorage.getToken() != null ) {
        console.log("checking token storage token"+this.tokenStorage.getToken())
          console.log("checking token storage user"+this.tokenStorage.getUser().email)
        this.empService.getEmployeByEmail(this.tokenStorage.getUser().email).subscribe(data => 
          {
          console.log("after getting user by email :"+data.email)
          const employeObject = {'email':data.email,'password':data.password};
          console.log("the constante"+employeObject);
          console.log("the constante"+typeof(employeObject));
          /*this.authService.login(employeObject).subscribe(
            data => {
              this.tokenStorage.saveToken(data.accessToken);
              this.tokenStorage.saveUser(data);
              console.log("token from the auth service"+this.tokenStorage.getToken())
              if(this.tokenStorage.getToken() != localStorage.getItem("token-access")){
                console.log("in the if of comparing tokens")
                this.router.navigateByUrl('/auth');
                localStorage.removeItem("email");
                localStorage.removeItem("token");

              }
              else
              return true;
            },err => {
              console.log("here");
              return false;
            })*/
        },err => {
          return false;
        })
        return true;
      }else{
        
        this.router.navigateByUrl('/auth');
        return false;
      }
  }
  
}
