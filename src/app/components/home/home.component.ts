import { Component, OnInit,DoCheck } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,DoCheck {

  public identity = null;
  public token = null;

  allCuaks: any[];
  loading = true;
  error: any;

  constructor(
      private apollo: Apollo,
      private userService : UserService
    ) {
    //this.identity="algo";
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
    
    this.apollo
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
      });
  }

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
