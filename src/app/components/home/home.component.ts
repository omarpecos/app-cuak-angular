import { Component, OnInit,DoCheck } from '@angular/core';
import { Apollo } from 'apollo-angular';
//import gql from 'graphql-tag';

import { UserService } from '../../services/user.service';
import { AllCuaks, Cuak } from '../../services/cuak.service';

import { environment } from '../../../environments/environment';

export interface pagination {
  hasPrevious : Boolean,
  previous : String,
  hasNext : Boolean,
  next : String
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,DoCheck {

  public identity = null;
  public token = null;

 // cuaks$ : Observable<any>;

  Cuaks: Cuak[];
  loading = true;
  error: any;

  page : number = 1;
  pagination : pagination;

  constructor(
      private apollo: Apollo,
      //private allCuaks : AllCuaks,
      private userService : UserService
    ) {
  }

  getAuthUser(){
    this.token = this.userService.getToken();
    this.identity = this.userService.getIdentity();
  }

  ngDoCheck(){
    this.getAuthUser();
  }
  ngOnInit() {
    
    this.getAuthUser();
    this.getAllCuaks({});
     
    /* this.apollo
      .watchQuery({
        query: gql`
          {
              allCuaks {
                _id
                title
                text
                image
                date
                author{
                  username
                }
              }
          }
          `,
      })
      .valueChanges.subscribe(result => {
        let data = result.data;
        this.allCuaks = data['allCuaks'];

        this.loading = result.loading;
        this.error = result.errors;
      }); */
  }

  getAllCuaks(paginate){

    environment.lastOperation = 'AllCuaks';

    this.apollo
    .watchQuery({
      query: AllCuaks,
      variables: {
        paginate
      },
    })
    .valueChanges
    .subscribe(result => {
      let DATA = result.data['allCuaks'];
      if (DATA){
        this.pagination = {
          hasNext : DATA['hasNext'],
          next : DATA['next'],
          hasPrevious : DATA['hasPrevious'],
          previous : DATA['previous']
        }
        //set env
        environment.lastPaginate = paginate;
      }

        this.Cuaks = DATA.results;
        this.loading = result.loading;
        this.error = result.errors;
    });
  }

  navigateToPage(type){
    if (type == 'previous'){
      this.page--;

      //loadCuaks
      this.getAllCuaks({
        previous : this.pagination.previous
      });

    }else{
      this.page++;

       //loadCuaks
       this.getAllCuaks({
        next : this.pagination.next
      });
     
    }
  }


}
