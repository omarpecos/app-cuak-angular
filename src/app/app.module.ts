import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {FormsModule} from '@angular/forms';

import {routing, appRoutingProviders} from './app.routing';

import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';

import {NgxAutoScrollModule} from "ngx-auto-scroll";
import { MomentModule } from 'ngx-moment';
import 'moment/locale/es';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { appHeaderComponent } from './components/appHeader/appHeader.component';
import { RegisterComponent } from './components/register/register.component';
import { CuakListComponent } from './components/cuak-list/cuak-list.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SearchComponent } from './components/search/search.component';
import { CreateComponent } from './components/create/create.component';
import { EditComponent } from './components/edit/edit.component';
import { CuakDetailComponent } from './components/cuak-detail/cuak-detail.component';
import { ChatComponent } from './components/chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    appHeaderComponent,
    RegisterComponent,
    CuakListComponent,
    SidebarComponent,
    SearchComponent,
    CreateComponent,
    EditComponent,
    CuakDetailComponent,
    ChatComponent

  ],
  imports: [
    BrowserModule,
    GraphQLModule,
    HttpClientModule,
    routing,
    FormsModule,
    NgxAutoScrollModule,
    MomentModule
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
