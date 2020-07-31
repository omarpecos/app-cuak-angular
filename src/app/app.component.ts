import { Component, OnInit, DoCheck} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../environments/environment';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,DoCheck{

  identity;
  year = 'xxxx';
  notifications = false;

  myNotif = [];

  constructor(
    private userService : UserService,
    private _router : Router
  ){
    this.year = new Date().getFullYear().toString();
    this.getAuthUser();
  }
  
  ngOnInit(): void {
      setInterval(() =>{
        this.myNotif = environment.myNotifications;
      }, 5000);
  }

  ngDoCheck(): void {
    this.getAuthUser();
  }

  getAuthUser(){
    this.identity = this.userService.getIdentity();
  }

  seeNotifications(){
    if (this.notifications){
      this.notifications = false;
    }else{
      this.notifications = true;
    }
  }

  goToChat(converId){
    let posToDelete;
    //elimina las notificaciones del env
    environment.myNotifications.map((notif,index) =>{
      if (notif.id == converId){
        posToDelete = index;
      }
    });

    //delete that pos
    environment.myNotifications.splice(posToDelete,1);

    //cierra la pestaña de notificaciones
    this.notifications = false;

    //redirect to Chat!
    this._router.navigate(['/chat']);
  }
 
}
