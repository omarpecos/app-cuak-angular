import { Component, OnInit, DoCheck} from '@angular/core';
import { UserService} from '../../services/user.service';
import { Cuak ,CuakService, AllCuaks , AddCuak} from 'src/app/services/cuak.service';
//import { Observable } from 'apollo-link';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';

import swal from 'sweetalert';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit,DoCheck {

  public identity = null;
  public token = null;

  public typeImg = 'url';
  public imgUrl = '';

  //cuando no hay file o mientras las fotos
  public loading : boolean = true;
  public file0 = null;
  public file : any;

  public loadingReq : boolean = false;

  cuak : Cuak;

  constructor(
    private _router : Router,
    private userService : UserService,
    private cuakService : CuakService,
    private apollo : Apollo,
  ) { 
   }

  ngOnInit(): void {
    this.getAuthUser();

    this.cuak = {
      _id : '99',title : '', text : '',image : '',date : '', lastRepliedAt : '', 
      author : {
        username : ''
      },
      favorites : {},
      replies : null,
      isFavorited : false,
      likesText : 'No le gusta a nadie',
      newReplies : null
    }

    /* ERROR : Posible 401 al no estar logueado */
    if (!this.identity){
      swal("Error","No está logueado, por favor inicie sesión","error");
      this._router.navigate(['/login']);
    }else{

      this.getNewImgUrl();
    }
  }

  getNewImgUrl(){
    this.cuakService.getNewUrlImg().subscribe(
      res =>{
        ////console.log(res);
      },
      e =>{
        ////console.log(e);
        //esta peticion da error -> error.url !
        this.imgUrl = e.url;

        let img = document.getElementById('createImg') as HTMLImageElement;
        img.src = this.imgUrl;
        this.loading = false;
        
      }
    );
  }

  getAuthUser(){
    this.token = this.userService.getToken();
    this.identity = this.userService.getIdentity();
  }

  ngDoCheck(){
    this.getAuthUser();

    if (this.typeImg == 'url' && this.imgUrl){
      this.loading = false;
      this.file = null;
      this.file0 = null;
      
      let img = document.getElementById('createImg') as HTMLImageElement;
      img.src = this.imgUrl;  
      img.style.display = 'block';
    }

    if (this.typeImg == 'file' && !this.file0){
       let img = document.getElementById('createImg') as HTMLImageElement;
       img.style.display = 'none';
        this.loading = true;
    }

  }

 fileChange(e){
    this.loading = false;
    let img = document.getElementById('createImg') as HTMLImageElement;

    this.file = e.target.files[0];
      ////console.log(this.file);
    this.file0 = this.file.name;

    var reader = new FileReader();
    reader.onload = function(event) {
        img.src = (event.target.result).toString();
        img.style.display = 'block';
    };
    reader.readAsDataURL(this.file);
  }

  //recarga la Img de unsplash
  reloadImg(){
    this.getNewImgUrl();
  }

  onSubmit(){
    //supuestamente ya viene por lo menos con title,text,typeImg
    let isImageUrl = this.typeImg == 'url' ? true : false;
     // //console.log(isImageUrl);
    let input = {
          title : this.cuak.title, text : this.cuak.text, isImageUrl : isImageUrl, imageUrl : this.imgUrl
      };
   
      ////console.log(args);
    this.addCuak(input);
    
   /* {
      input : NewCuakInput (title!,text!,isImageUrl, imageUrl),
      imageFile : Upload
    }*/
  }

 addCuak(input){

    let file = null;
    if (!input.isImageUrl){
      file = this.file;
    }
    
    this.loadingReq = true;
    this.apollo
        .mutate({
            mutation : AddCuak,
            variables : {
              input,
              imageFile : file
            },
            optimisticResponse: {
              __typename: 'Mutation',
              addCuak: {
                __typename: 'Cuak',
                _id : '-1',
                title : input.title,
                text : input.text,
                image : file == null ? input.imageUrl : '',
                date : new Date().toISOString(),
                author : {
                  __typename : 'User',
                  _id : this.identity._id,
                  username : this.identity.username,
                }
            }
          },
          update : (proxy, {data : {addCuak}} ) => {
            //meter try/catch para cuando no haya cache!
            // Read the data from our cache for this query.
            const dataSet = proxy.readQuery({ 
              query: AllCuaks,
              variables : {
                paginate : {}
              }
           });

            // Add our todo from the mutation to the end.
            dataSet['allCuaks']['results'].unshift( addCuak );
            // Write our data back to the cache.
            proxy.writeQuery({ 
              query: AllCuaks, 
              variables : {
                paginate : {}
              },
              data : dataSet});
        },
      }).subscribe(
        res =>{
           //mapea y muestra los errores
           if (res.errors) {
              res.errors.map(e => {
                //console.log(e);
                swal("Error",e.message,"error");
              });
          } else {
               //if todoo ok - redir a home y saldrá ahi el primero
              this._router.navigate(['/']);
              this.loadingReq = false;

              swal("Se ha añadido correctamente '"+ input.title +"'", {
                icon: "success",
              });
          }
        });
      }

         /* let newCuak = res.data['addCuak'];
          let query = new AllCuaks().document;

          //Updated the caché with newCuak - Optimistic Loading - Optimistic UI
          //readQuery
          const {allCuaks} = this.apollo.getClient().readQuery({
            query,
            variables : {
              paginate : {}
            }
          });
          //console.log(allCuaks);
          
          //writeQuery
          this.apollo.getClient().writeFragment({
            id : '$ROOT_QUERY.allCuaks({"paginate":{}})',
            fragment : gql`
              fragment myResults on Pa {
                results
              }
            `,data : {
                  results : [newCuak , ...allCuaks.results],
                __typename : 'PaginatedCuak'
            }
          });
*/
          // Hace su función pero creo que al volver a Home.ts vuelve
          // a hacer como un refecth??? por lo menos salia como dos peticiones de graphql

        

  //refechtdeunaQuery dentro de mutate()
   /* ,
       {
        refetchQueries: [{
          query: new AllCuaks().document,
          variables : {
            paginate : {}
          }
        }],
       } */

    /* Amplia la imagen si haces un hover a la img o si sales vuelve a la normalidad */
    zoomImg(target,type) {

      let img = target as HTMLImageElement;
      let imgWrap = img.parentNode as HTMLDivElement;
  
      if (type == 'enter') {
        imgWrap.style.overflow = 'visible';
  
        img.style.transform = 'scale(1.75)';
        img.style.border = '1.7px lightgrey solid';
        img.style.position = 'relative';
        img.style.bottom = '0';
        img.style.zIndex = '1';
  
        if (window.screen.availWidth < 992) {
          img.style.width = '60vw';
          img.style.margin = '0 auto';
        }
      } else if (type == 'leave') {
        imgWrap.style.overflow = 'hidden';
  
        img.style.transform = 'scale(1)';
        img.style.border = 'none';
        img.style.position = 'inherit';
        img.style.bottom = 'inherit';
        img.style.zIndex = '0';
  
        if (window.screen.availWidth < 992) {
          img.style.width = '100%';
          img.style.margin = '0';
        }
        
      }
    }

}
