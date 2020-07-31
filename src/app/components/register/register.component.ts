import { Component, OnInit } from '@angular/core';
import { UserRegister } from '../../services/user.service';
import {Router, Route} from '@angular/router';


interface userRegister {
  username : string,
  email : string,
  password : string,
  confirmPassword : string
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public userData : userRegister;
  public errors : any[] =  [];

  constructor(
      private UserRegister : UserRegister,
      private _router : Router
  ) {
      this.userData = {
        username : '',
        email : '',
        password : '',
        confirmPassword : '',
      }
   }

  ngOnInit(): void {
  }

  onSubmit(){
    this.errors = [];

    //little validation
    if (this.userData.username && this.userData.email && this.userData.password && this.userData.confirmPassword){
      //doRegister();
      this.doRegister();
    }else{
      //console.log('nada');
    }
  }

  doRegister(){
    this.UserRegister
      .mutate(
        this.userData
      )
      .subscribe(
        res =>{
          if (res.errors){
            res.errors.map(e =>{
              //console.log(e);
              this.errors.push(e.message);
            });
          }else{
              // //console.log(res.data['register']);
            //redirect to Login!
            this._router.navigate(['/login']);
          }
          
        });
  }

}
