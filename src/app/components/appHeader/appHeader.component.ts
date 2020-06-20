import {Component, Input} from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl:"./appHeader.component.html",
    selector : 'appHeader'
})
export class appHeaderComponent {
    @Input() identity;

    constructor(
        private _router : Router
    ){}

    logout(){
        console.log('logout!!');
        
        localStorage.removeItem('token');
        localStorage.removeItem('identity');

        //si me encontrara en rutas de usuarios autenticados - redir a / o a login
        this._router.navigate(['/']);
    }
}