import { Component, OnInit,ViewChild} from '@angular/core';
import { UserService, AllUsersForSelect } from '../../services/user.service';
import { Apollo, QueryRef } from 'apollo-angular';
import { AllConversations, NewMsg, NewMsgSub, NewPrivateConverSub, Conversation, AddPrivateConversation, JoinConversation } from 'src/app/services/cuak.service';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import {NgxAutoScroll} from "ngx-auto-scroll";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild(NgxAutoScroll) ngxAutoScroll: NgxAutoScroll;

  identity;

  conversQuery : QueryRef<any>;
   convers : Observable<any>;

  ConversGroup : Conversation[];
  ConversPrivate : Conversation[];
  myConversIds = [];
  
  loading = true;
  dialog : any = null;

  newMsg = '';

  //users part
  Users = null;
  newPrivateForm = false;
  userSel = '0';
  fullDate: string = '';

  constructor(
    private userService : UserService,
    private apollo : Apollo
  ) {
      this.getAuthUser();
        //posible 401 - Auth
        //
      this.getAllConvers();
   }

  ngOnInit(): void {
    
    if (!environment.subsChatRunning){

      this.subscribeToNewMessages();
      this.subscribeToNewPrivateConvers();

      environment.subsChatRunning = true;
    }
    
  }

  getAllConvers(){

    this.conversQuery = this.apollo.watchQuery({
      query : AllConversations
    });
    
    this.convers = this.conversQuery.valueChanges; // async results

    this.convers.subscribe(res =>{
      let convers = null;
      if (res.data){
        convers = res.data.allConversations;
      }
      
      this.loading = res.loading;

      if(convers){
        var conversArray = [];
        var converG : Conversation[] = [];
        var converP : Conversation[] = [];

        convers.map(conver =>{
          
          if (conver.type == 'group'){
            converG.push(conver);
          }else{
            converP.push(conver);
          }
          const found = conver.participants.find(user => user._id == this.identity._id);
         
          if (found){
              conversArray.push(conver._id);
          }
        });

        this.ConversGroup = converG;
        this.ConversPrivate = converP;

        environment.myConversations = conversArray;
        this.myConversIds = conversArray;
      }
    });
  }

  isPrivateConverMine(id){
    let value = false;
    this.myConversIds.map(ID =>{
      if (ID == id){
        value = true;
      }
    });

    return value;
  }

  seeChat(conver){
   const found = this.isMyConver(conver._id);

    if (found){
        this.dialog = conver;
        environment.dialogOpened = conver;
    
        this.ConversGroup.map(c =>{
          if (c._id == conver._id){
              c.notifications = 0;
          }
        });
        this.ConversPrivate.map(c =>{
          if (c._id == conver._id){
              c.notifications = 0;
          }
        });
        setTimeout(() => this.forceScrollDown(),500);
    }
  }

  //force-Scroll-down
  forceScrollDown(): void {
    if (this.dialog.messages.length > 0){
      this.ngxAutoScroll.forceScrollDown();
    }
  }

  getAuthUser(){
    this.identity = this.userService.getIdentity();
  }

  onSubmitNewMsg(){
      console.log(this.newMsg);
      // do the mutation
      this.apollo
        .mutate<any>({  
          mutation : NewMsg,
          variables : {
            text : this.newMsg,
            converId : this.dialog._id
          }
        }).subscribe(
            res =>{
              if (res.data ){
               //  console.log(res);
                this.newMsg = '';
              }
          });
  }

  /// Subscribe la llegada de nuevos mensajes y actualiza la query en la Store :)
  subscribeToNewMessages(){

    this.conversQuery
      .subscribeToMore({
        document : NewMsgSub,
        updateQuery : (prev, {subscriptionData}) =>{
          if (!subscriptionData.data){
            return prev;
          }
          const msg = subscriptionData.data.newMsgSub;
            console.log('NewMsgSub ___>>>');
            console.log(msg);
          
          let forMe = false;
          const myConvers = environment.myConversations;
            //console.log(myConvers);
          
          let converId = msg.converId;
          //let converPosInStore = null;

         /* forMe = myConvers.some(conver =>{
            converId == conver._id
          });*/
           myConvers.map(Id =>{
             if (converId == Id){
               forMe = true;
                //console.log(converId);
             }
           })
              // console.log(forMe);

          if (forMe){
            const converArray = prev.allConversations;
            converArray.map( conver =>{
              if (conver._id == converId){
                conver.messages.push(msg);
                  //converPosInStore = index;
                
                  //notifications dentro de chat.component
                    // TODO : Cuando esta fuera del chat no va creo
                  if (!environment.dialogOpened || this.dialog._id != converId){
                        if (conver.notifications != 0){
                          conver.notifications += 1;
                        }else{
                          conver.notifications = 1;
                        }
                  }
                 

                  ///update environment with new Notifications (notificaciones en toda la App)
                  if (msg.sender._id != this.identity._id){
                        let found = false;
                        environment.myNotifications.map(not =>{
                          if (not.id == converId){
                            found = true;
                            not.new += 1;
                          }
                        });
                        if (!found){
                          environment.myNotifications.push(
                            {
                              id : converId,
                              title : conver.title,
                              new : 1
                            }
                          );
                        } 
                  }
              }
            });

              return{
                ...prev,
                allConversations : converArray
              }
            
          }

          return {
            ...prev
          };
        }
      });
  }

  /// Subscribe la creación de chats privadors y  actualiza la query en la Store :)
  subscribeToNewPrivateConvers(){
    this.conversQuery
      .subscribeToMore({
        document : NewPrivateConverSub,
        updateQuery : (prev, {subscriptionData}) => {
            if (!subscriptionData.data){
              return prev;
            }
            const conver = subscriptionData.data.newPrivateConver;
            console.log(conver);

            let IsForMeToo = false;
            conver.participants.map(user =>{
              if (user._id == this.identity._id){
                IsForMeToo = true;
              }
            });
            
            if (IsForMeToo){
              // se ha creado una conversacion en la que esta este user!
              environment.myConversations.push(conver._id);
              this.myConversIds.push(conver._id);

              return{
                ...prev,
                allConversations : [
                  ...prev.allConversations , conver
                ]
              }
            }else{
              // se ha creado una nueva conversacion privada en la que no esta este user
                return {
                  ...prev
                }
            }
            
        }
      })
  }


  onSubmitNewPrivateConver(){
      console.log( this.userSel);

      // do the mutation!
      this.apollo
        .mutate({
          mutation : AddPrivateConversation,
          variables : {
            userIds : [this.identity._id , this.userSel]
          }
        }).subscribe(res =>{
          if (res.data){
            //esconde el form
            this.newPrivateForm = false;
          }
        });
      
  }

  displayFormForNewPrivateConver(){
    this.newPrivateForm = true;

    this.getAllUsersForSelect();
  }

  getAllUsersForSelect(){
    this.apollo
      .query<any>({
        query : AllUsersForSelect
      }).subscribe(res =>{
        if (res.data){
         let users = res.data.allUsers;
         this.Users = [];
          users.map(user =>{
            if (user._id != this.identity._id){
              this.Users.push(user);
            }
          })
        }
      });
  }

  /* FullDateDisplay */
  displayFullDate(id){
    this.fullDate = id;
  }

  keyPress(event : KeyboardEvent){
    if (event.code == 'Enter' && this.newMsg){
        this.onSubmitNewMsg();
    }
  }

  isMyConver(converId){
    const found = this.myConversIds.find(id =>id === converId);
    return found;
  }

  joinConversation(converId){
    this.apollo
      .mutate({
        mutation : JoinConversation,
        variables : {
          id : converId
        }
      }).subscribe(res =>{
        console.log(res);
        if (res.data){
          this.myConversIds.push(converId);
        }
      });
  }

}
