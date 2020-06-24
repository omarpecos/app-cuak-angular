import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import { UserService } from '../../services/user.service';
import { Cuak,SearchCuaks } from '../../services/cuak.service';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  
  public search = '';

  public identity = null;
  public token = null;

  Cuaks: Cuak[];
  loading = true;
  error: any;


  constructor(
    private _route : ActivatedRoute,
    private userService : UserService,
    private apollo : Apollo
  ) { }

  ngOnInit(): void {
    this.getAuthUser();

    this._route.params.subscribe(params =>{
        this.search = params['search'];

        this.searchCuaks();
    });
  }

  getAuthUser(){
    this.token = this.userService.getToken();
    this.identity = this.userService.getIdentity();
  }

  searchCuaks(){
    let searchCuaksgql = new SearchCuaks().document;

    this.apollo
      .watchQuery({
        query : searchCuaksgql,
        variables : {
          search : this.search
        }
      })
      .valueChanges
      .subscribe(result =>{
        let data = result.data;
        this.Cuaks = data['searchCuaks'];

        this.loading = result.loading;
        this.error = result.errors;
      });
  }

}
