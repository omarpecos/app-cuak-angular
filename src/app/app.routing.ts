// importar módulos de Router
import { ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router'

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

// Array de tutas
const appRoutes : Routes = [
    {path : '', component : HomeComponent , pathMatch : 'full'},
    {path : 'login', component : LoginComponent},
    {path : 'registro', component : RegisterComponent}
];

//Exportar el modulo de rutas
export const appRoutingProviders : any[] = [];
export const routing : ModuleWithProviders = RouterModule.forRoot(appRoutes);