import { Component, OnInit ,DoCheck} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Cuak, OneCuak } from '../../services/cuak.service';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-cuak-detail',
  templateUrl: './cuak-detail.component.html',
  styleUrls: ['./cuak-detail.component.css']
})
export class CuakDetailComponent implements OnInit,DoCheck {
  
  public identity = null;
  public token = null;

  cuakId = '';

  cuak : Cuak = null;
  loading : any = true;
  error : any;

  constructor(
    private _route : ActivatedRoute,
    private apollo : Apollo,
    private userService : UserService
  ) { }

  ngOnInit(): void {
    this.getAuthUser();

    //cojer el id del Cuak
    this._route.params.subscribe(params =>{
      this.cuakId = params['id'];

        //obtener el cuak
        this.apollo
          .watchQuery({
            query : OneCuak,
            variables : {
              id : this.cuakId
            }
          })
          .valueChanges
          .subscribe( result =>{
              this.cuak = result.data['oneCuak'];
              this.loading = result.loading;
              this.error = result.errors;
          })
    });
  }

  ngDoCheck(){
    this.getAuthUser();
  }

  getAuthUser(){
    this.token = this.userService.getToken();
    this.identity = this.userService.getIdentity();
  }
  //centra verticalmente las imagenes muy altas
  centerImg(e){
    let img = e.currentTarget as HTMLImageElement;
      //console.log(img.height);
    
    let mobile = false;

    if (window.screen.width < 992){
      mobile = true;
    }

    if (mobile){
        if (img.height > 260){
          let offset = img.height - 260;
          img.style.position = 'relative';
          img.style.top = '-'+(offset/2)+'px';
        }
    }else{
      if (img.height > 450){
        let offset = img.height - 450;
        img.style.position = 'relative';
        img.style.top = '-'+(offset/2)+'px';
      }
    }
    
    
  }

}
