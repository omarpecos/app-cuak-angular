import { Component, OnInit,DoCheck } from '@angular/core';
import { Apollo,QueryRef } from 'apollo-angular';
//import gql from 'graphql-tag';

import { UserService } from '../../services/user.service';
import { AllCuaks, Cuak , NewReplySub, MyConversations } from '../../services/cuak.service';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

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

  cuakQuery : QueryRef<any>;
  cuaks: Observable<any>;
  Cuaks : Cuak[];
  loading = true;
  error: any;

  page : number = 1;
  pagination : pagination;

  constructor(
      private apollo: Apollo,
      //private allCuaks : AllCuaks,
      private userService : UserService
    ) {

      this.getAllCuaks({});
    
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
    this.getMyConversations();
    
    if (!environment.subNewCommentRunning){
      
      this.subscribeToNewComments();
      environment.subNewCommentRunning = true;
    }
   
  }

  getAllCuaks(paginate){

    environment.lastOperation = 'AllCuaks';

    this.cuakQuery = this.apollo
    .watchQuery({
      query: AllCuaks,
      variables: {
        paginate
      },
    });

    this.page = environment.viewingPage;

    this.cuaks = this.cuakQuery.valueChanges; // async results

    this.cuaks.subscribe(
      result => {
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
    var paginate = {};

    if (type == 'previous'){
      this.page--;

      paginate = {
        previous : this.pagination.previous
      };

    }else{
      this.page++;

      paginate = {
        next : this.pagination.next
      };  
    }

   //OLD WAY but works and return always to first page data! :D 
   // this.getAllCuaks(paginate);

    environment.viewingPage = this.page;
  
    this.cuakQuery.fetchMore({
        variables : {
          paginate
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) { return prev; }
          environment.lastOperation = 'AllCuaks';
           //set env
           environment.lastPaginate = paginate;
          return fetchMoreResult;
        }
      });

  }

  // SUBSCRIPTIONS
  subscribeToNewComments() {
    
    this.cuakQuery.subscribeToMore({
      document: NewReplySub,
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) {
          return prev;
        }

          ////console.log(prev);
          ////console.log(subscriptionData);
        const cuakArray = prev.allCuaks.results;
        const newReply = subscriptionData.data.newReplySub;
          cuakArray.map(cuak =>{
            if (cuak._id == newReply.cuakId){
                  if( cuak.newReplies != null ){
                    let replies = cuak.newReplies;
                    let num = replies.quantity;
                    
                      cuak.newReplies = {
                        quantity : num + 1,
                        last : newReply
                      }
                  }else{
                    cuak.newReplies = {
                      quantity : 1,
                      last : newReply
                    }
                  }
            }
          });
        //console.log(newReply);
        
        return {
          ...prev
        };
      }
    });
  }

  getMyConversations(){
    if (this.identity){
        this.apollo
          .query<any>({
            query : MyConversations
          }).subscribe(res =>{
            if (res.data){
                ////console.log(res.data.myConversations);
                let convers = res.data.myConversations;
                var conversArray = [];

                convers.map(conver =>{
                  const found = conver.participants.find(user => user._id == this.identity._id);
                    ////console.log(found);
                  if (found){
                      conversArray.push(conver._id);
                    ////console.log(environment);
                  }
                });

                environment.myConversations = conversArray;
            }
          })
    }
  }


}
