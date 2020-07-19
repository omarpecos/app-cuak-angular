// importar módulos de Router
import { ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router'

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SearchComponent } from './components/search/search.component';
import { CreateComponent } from './components/create/create.component';
import { CuakDetailComponent } from './components/cuak-detail/cuak-detail.component';
import { EditComponent } from './components/edit/edit.component';

// Array de tutas
const appRoutes : Routes = [
    {path : '', component : HomeComponent , pathMatch : 'full'},
    {path : 'login', component : LoginComponent},
    {path : 'registro', component : RegisterComponent},
    {path : 'buscar/:search' , component : SearchComponent},
    {path : 'nuevo', component : CreateComponent},
    {path : 'detalle/:id/:action', component : CuakDetailComponent},
    {path : 'editar/:id', component : EditComponent}
];

//Exportar el modulo de rutas
export const appRoutingProviders : any[] = [];
export const routing : ModuleWithProviders = RouterModule.forRoot(appRoutes);