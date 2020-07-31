import { Component, OnInit, DoCheck } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Cuak, OneCuak, AddReply, EditReply, DeleteReply , MarkAsFavorite ,UnmarkAsFavorite , DeleteCuak , AllCuaks} from '../../services/cuak.service';
import { Apollo } from 'apollo-angular';

import swal from 'sweetalert';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-cuak-detail',
  templateUrl: './cuak-detail.component.html',
  styleUrls: ['./cuak-detail.component.css']
})
export class CuakDetailComponent implements OnInit, DoCheck {

  public identity = null;
  public token = null;

  cuakId = '';

  cuak: Cuak = null;
  loading: any = true;
  error: any;

  reply = null;
  newReply = '';
  replyId = null;

  constructor(
    private _router : Router,
    private _route: ActivatedRoute,
    private apollo: Apollo,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getAuthUser();

    //cojer el id del Cuak
    this._route.params.subscribe(params => {
      this.cuakId = params['id'];
      this.reply = params['action'];

      //obtener el cuak
      this.apollo
        .watchQuery({
          query: OneCuak,
          variables: {
            id: this.cuakId
          }
        })
        .valueChanges
        .subscribe(result => {
          this.cuak = result.data['oneCuak'];
          this.loading = result.loading;
          this.error = result.errors;

          if (this.cuak){
            this.setLikesText(this.cuak);
            if (this.identity){
              this.isMarkedAsFav(this.identity._id);
            }
          }
        })
    });
  }

  ngDoCheck() {
    this.getAuthUser();
    if (this.cuak){
      this.setLikesText(this.cuak);
      if (this.identity){
        this.isMarkedAsFav(this.identity._id);
      }
    }
    
  }

  getAuthUser() {
    this.token = this.userService.getToken();
    this.identity = this.userService.getIdentity();
  }

  /* Operaciones de favoritos y demas */
  setLikesText(cuak){
      let numFavs = cuak.favorites.length;
      if (numFavs == 0){
        cuak.likesText = 'No le gusta a nadie';
      }else if (numFavs == 1){
        cuak.likesText = 'A '+ cuak.favorites[0].user.username +' le gusta';
      }else{
        let randomNum = Math.floor(Math.random() * (cuak.favorites.length - 1 ));
        cuak.likesText = 'A '+ cuak.favorites[randomNum].user.username +' y a '+ (cuak.favorites.length - 1 ) +' más les gusta';
      }
  }

  isMarkedAsFav(id){
    var valorRetornado = false; 

    this.cuak.favorites.map( fav =>{
        if (fav.userId == id){
          valorRetornado = true;
        }
    });
    
      this.cuak.isFavorited = valorRetornado;
  }

  doFavorite(cuakId){
    
    this.apollo
      .mutate({
        mutation : MarkAsFavorite,
        variables : {
          cuakId : cuakId
        },
        optimisticResponse : {
          __typename : 'Mutation',
          markAsFavorite : {
            __typename : 'Favorite',
            userId : this.identity._id,
            user : {
              __typename : 'User',
              username : this.identity.username
            }
          }
      },
        // igual se puede hacer un refechtQueries pero puede aparecer algun cuak repetido 
        //si has cargado la pagina y eliminas uno de la anterior
       update : (proxy, { data : {markAsFavorite}}) =>{
         var query,variables; 

         query = OneCuak;
          variables =  {
            id: this.cuakId
          }
         
          const data = proxy.readQuery<any>({
            query,
            variables
          });

          data.oneCuak.favorites.push(markAsFavorite);

          proxy.writeQuery({
            query,
            variables,
            data : data
          });
      }
      }).subscribe(
        res =>{
          if (res.errors){
            res.errors.map(e =>{
              console.log(e);
              swal("Error",e.message,"error");
            });
          }
            console.log('doFavorite() =>');
            console.log(res);
        });
  }

  undoFavorite(cuakId){

    this.apollo
    .mutate({
      mutation : UnmarkAsFavorite,
      variables : {
        cuakId : cuakId
      },
      optimisticResponse : {
        __typename : 'Mutation',
        unmarkAsFavorite : {
          __typename : 'Favorite',
          userId : this.identity._id,
          user : {
            __typename : 'User',
            username : this.identity.username
          }
        }
    },
      // igual se puede hacer un refechtQueries pero puede aparecer algun cuak repetido 
      //si has cargado la pagina y eliminas uno de la anterior
     update : (proxy, { data : {unmarkAsFavorite}}) =>{
      var query,variables; 

      query = OneCuak;
      variables = {
        id : this.cuakId
      };

      const data = proxy.readQuery<any>({
        query,
        variables
      });

      var auxArray = data.oneCuak.favorites.filter(fav => fav.userId != this.identity._id);
      data.oneCuak.favorites = auxArray;

        proxy.writeQuery({
          query,
          variables,
          data : data
        });
    }
    }).subscribe(
      res =>{
        if (res.errors){
          res.errors.map(e =>{
            console.log(e);
            swal("Error",e.message,"error");
          });
        }
        console.log('undoFavorite() =>');
        console.log(res);
      }
    )
  }

  deleteCuak(cuak : Cuak){
    swal({
      title: "¿Está seguro?",
      text: "Una vez eliminado el cuak no habrá marcha atrás",
      icon: "warning",
      buttons: ['Cancelar','Eliminar'],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        
        //mutation - deleteCuak
        this.apollo
            .mutate({
              mutation : DeleteCuak,
              variables : { id : cuak._id},
              optimisticResponse : {
                  __typename : 'Mutation',
                  deleteCuak : {
                    __typename : 'Cuak',
                    _id : cuak._id,
                    title : cuak.title,
                    author : {
                      __typename : 'User',
                      _id : this.identity._id,
                      username : this.identity.username
                    }
                  }
              },
                // igual se puede hacer un refechtQueries pero puede aparecer algun cuak repetido 
                //si has cargado la pagina y eliminas uno de la anterior
               update : (proxy, { data : {deleteCuak}}) =>{
                 
                  const data = proxy.readQuery<any>({
                    query : AllCuaks,
                    variables : {
                      paginate : environment.lastPaginate
                    }
                  });
                  
                  var cuakArray = data.allCuaks.results.filter(c => c._id != cuak._id );
                  data.allCuaks.results = cuakArray;

                  proxy.writeQuery({
                    query : AllCuaks, 
                    variables : {
                       paginate : environment.lastPaginate
                    },
                     data : data});
               }
            }).subscribe(
              res =>{
                if (res.errors){
                  res.errors.map(e =>{
                    console.log(e);
                    swal("Error",e.message,"error");
                  });
                }else{
                  //redirect to Home!
                  this._router.navigate(['/']);
                }
              });

        swal("El cuak con título '"+ cuak.title +"' se ha eliminado correctamente", {
          icon: "success",
        });
      } else {
        //nada
          //test de environment.ts
          // console.log(environment.lastPaginate);
      }
    });
  }

  //centra verticalmente las imagenes muy altas
  centerImg(e) {
    let img = e.currentTarget as HTMLImageElement;
    //console.log(img.height);

    let mobile = false;

    if (window.screen.width < 992) {
      mobile = true;
    }

    if (mobile) {
      if (img.height > 260) {
        let offset = img.height - 260;
        img.style.position = 'relative';
        img.style.top = '-' + (offset / 2) + 'px';
      }
    } else {
      if (img.height > 450) {
        let offset = img.height - 450;
        img.style.position = 'relative';
        img.style.top = '-' + (offset / 2) + 'px';
      }
    }


  }


  /* REPLY Operations */
  seeReplyForm() {
    this.reply = 'reply';
  }
  onSubmitReply() {
    //console.log(this.newReply);

    //call to Apollo - addReply
    this.apollo
      .mutate({
        mutation: AddReply,
        variables: {
          cuakId: this.cuakId,
          text: this.newReply
        },
        refetchQueries: [{
          query: OneCuak,
          variables: {
            id: this.cuakId
          }
        }],
      }).subscribe(
        res => {
          if (res.errors) {
            res.errors.map(e => {
              console.log(e);
            });
          } else {
            this.reply = null;
            this.newReply = '';
          }
          //console.log(res);
        });

  }

  onSubmitEditedReply() {
    //console.log(this.newReply);
    // edit
    this.apollo
      .mutate({
        mutation: EditReply,
        variables: {
          replyId: this.replyId,
          text: this.newReply
        },
        refetchQueries: [{
          query: OneCuak,
          variables: {
            id: this.cuakId
          }
        }],
      }).subscribe(
        res => {
          if (res.errors) {
            res.errors.map(e => {
              console.log(e);
            });
          } else {
            this.reply = null;
            this.newReply = '';
          }
          //console.log(res);
        });
  }

  // saca la info en el form de editar la respuesta
  editReply(reply) {
    this.newReply = reply.text;
    this.replyId = reply._id;
    this.reply = 'edit';
  }

  deleteReply(reply) {
    swal({
      title: "¿Está seguro?",
      text: "La respuesta se eliminará",
      icon: "warning",
      buttons: ['Cancelar', 'Eliminar'],
      dangerMode: true,
    })
      .then((willDelete) => {

        if (willDelete) {
          this.apollo
            .mutate({
              mutation: DeleteReply,
              variables: {
                replyId: reply._id
              },
              refetchQueries: [{
                query: OneCuak,
                variables: {
                  id: this.cuakId
                }
              }],
            }).subscribe(
              res => {
                if (res.errors) {
                  res.errors.map(e => {
                    console.log(e);
                  });
                }
              });

          swal("La respuesta se ha eliminado correctamente", {
            icon: "success",
          });
          
        } else {
          //nada
        }

      });
  }
}
