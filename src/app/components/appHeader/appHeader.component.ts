import {Component, Input} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';

@Component({
    templateUrl:"./appHeader.component.html",
    selector : 'appHeader'
})
export class appHeaderComponent {
    @Input() identity;

    constructor(
        private _router : Router,
        private apollo : Apollo
    ){}

    logout(){
        //console.log('logout!!');
        
        localStorage.removeItem('token');
        localStorage.removeItem('identity');

        this.apollo.getClient().resetStore();

        //si me encontrara en rutas de usuarios autenticados - redir a / o a login
        this._router.navigate(['/']);
    }
}