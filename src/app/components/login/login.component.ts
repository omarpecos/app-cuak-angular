import { Component, OnInit } from '@angular/core';
import { UserLogin } from '../../services/user.service';
import { Router } from '@angular/router';

interface userLogin{
  username : string 
  password : string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userData : userLogin;
  errors : any[] = [];

  constructor(
      private userLogin : UserLogin,
      private _router : Router
  ) {
      this.userData = {
        username : '',
        password : ''
      }
   }

  ngOnInit(): void {
  }

  doLogin(){
    this.userLogin
      .mutate(
        this.userData
      )
      .subscribe(
        res =>{    

            if (res.errors){
              res.errors.map(e =>{
                console.log(e);
                this.errors.push(e.message);
              });
            }else{
              let data = res.data['login'];
              //recoger token e identity - localStorage
              let token = data.token;
              localStorage.setItem('token', token);
              let identity = data.user;
              localStorage.setItem('identity',JSON.stringify(identity));
               // y redireccionar hacia Home!
              this._router.navigate(['']);
            }
          
        });
  }

  onSubmit(){
    //simpleValidation
    this.errors = [];

    if (this.userData.username && this.userData.password){
      this.doLogin();
    }else{
      console.log('no enviado');
    }
  }

}
