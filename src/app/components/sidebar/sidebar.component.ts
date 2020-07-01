import { Component, OnInit ,Input} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() identity;
  public searchString = '';

  constructor(
      private _router : Router
  ) { }

  ngOnInit(): void {
  }

  onSubmitSearch(){
      console.log(this.searchString);
      
      //redir to componente Search (realiza la busqueda + imprime los resultados con cuaklist)
      this._router.navigate(['/buscar',this.searchString]);
      this.searchString = '';
  }

}
