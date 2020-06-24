import { Component, OnInit,Input } from '@angular/core';
import { Cuak } from '../../services/cuak.service';


@Component({
  selector: 'cuak-list',
  templateUrl: './cuak-list.component.html',
  styleUrls: ['./cuak-list.component.css']
})
export class CuakListComponent implements OnInit {

  @Input() Cuaks: Cuak[];
  @Input() identity;

  constructor() { }

  ngOnInit(): void {
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
