import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService} from '../../services/user.service';
import { Cuak, CuakService, OneCuak, EditCuak } from 'src/app/services/cuak.service';
//import { Observable } from 'apollo-link';
import { Router, ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';

import swal from 'sweetalert';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit,DoCheck{

  public identity = null;
  public token = null;

  public typeImg = 'url';
  public imgUrl = '';
  public imageOld = '';

  //cuando no hay file o mientras las fotos
  public loading: boolean = false;
  public file0 = null;
  public file: any;

  public loadingReq: boolean = false;

  cuak: Cuak;
  cuakId = '';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private userService: UserService,
    private cuakService: CuakService,
    private apollo: Apollo
  ) { }

  ngOnInit(): void {
    this.getAuthUser();

    /* ERROR : Posible 401 al no estar logueado */
    if (!this.identity){
      swal("Error","No está logueado, por favor inicie sesión","error");
      this._router.navigate(['/login']);
    }

    //sacar el cuakId y recoger ese dato
    this._route.params.subscribe(params => {
      this.cuakId = params['id'];
    });

    this.apollo
      .query({
        query: OneCuak,
        variables: {
          id: this.cuakId
        }
      }).subscribe(
        res => {
          //mapea y muestra los errores
          if (res.errors) {
            res.errors.map(e => {
              //console.log(e);
              swal("Error",e.message,"error");
              //navigate to history - back o que vaya a inicio o algo
               window.history.back();
            });
          } else {
            this.cuak = res.data['oneCuak'];
            this.imgUrl = this.cuak.image;
            this.imageOld = this.imgUrl;

            // ERROR : que no dejara ni ver el form de editar sino es tuyo o si no eres admin
            // aunque no deja editar pues - message: "Not authorized to edit cuak" - en editCuak!
          }

        });
  }

  getNewImgUrl() {
    this.cuakService.getNewUrlImg().subscribe(
      res => {
        ////console.log(res);
      },
      e => {
        ////console.log(e);
        //esta peticion da error -> error.url !
        this.imgUrl = e.url;

        let img = document.getElementById('createImg') as HTMLImageElement;
        img.src = this.imgUrl;
        this.loading = false;

      }
    );
  }

  getAuthUser() {
    this.token = this.userService.getToken();
    this.identity = this.userService.getIdentity();
  }

  ngDoCheck() {
    this.getAuthUser();

    if (this.typeImg == 'url' && this.imgUrl) {
      this.loading = false;
      this.file = null;
      this.file0 = null;

      let img = document.getElementById('createImg') as HTMLImageElement;
      if (img) {
        img.src = this.imgUrl;
        img.style.display = 'block';
      }

    }

    if (this.typeImg == 'file' && !this.file0) {
      let img = document.getElementById('createImg') as HTMLImageElement;
      if (img) {
        img.style.display = 'none';
      }
      this.loading = true;
    }

  }

  fileChange(e) {
    this.loading = false;
    let img = document.getElementById('createImg') as HTMLImageElement;

    this.file = e.target.files[0];
    //console.log(this.file);
    this.file0 = this.file.name;

    var reader = new FileReader();
    reader.onload = function (event) {
      img.src = (event.target.result).toString();
      img.style.display = 'block';
    };
    reader.readAsDataURL(this.file);
  }

  //recarga la Img de unsplash
  reloadImg() {
    this.getNewImgUrl();
  }

  onSubmit() {
    //supuestamente ya viene por lo menos con title,text,typeImg
    let isImageUrl = this.typeImg == 'url' ? true : false;
    // //console.log(isImageUrl);
    let input = {
      title: this.cuak.title, text: this.cuak.text, isImageUrl: isImageUrl, imageUrl: this.imgUrl
    };

    //do the operation
    this.editCuak(input);

    /* {
       id : ID!,
       input : NewCuakInput (title!,text!,isImageUrl, imageUrl),
       imageFile : Upload
     }*/
  }

  editCuak(input) {
    let file = null;
    if (!input.isImageUrl) {
      file = this.file;
    }

    this.loadingReq = true;
    //mutation editCuak
    this.apollo
      .mutate({
        mutation: EditCuak,
        variables: {
          id: this.cuakId,
          input,
          imageFile: file
        }
      }).subscribe(
          res => {
            //mapea y muestra los errores
            if (res.errors) {
              res.errors.map(e => {
                //console.log(e);
                swal("Error",e.message,"error");
              });
            } else {
              this._router.navigate(['/']);

              swal("Se ha modificado correctamente '"+ input.title +"'", {
                icon: "success",
              });
            }
            this.loadingReq = false;
        });
  }

  resetImageOld() {
    this.imgUrl = this.imageOld;
  }

  /* Amplia la imagen si haces un hover a la img o si sales vuelve a la normalidad */
  zoomImg(target, type) {

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
