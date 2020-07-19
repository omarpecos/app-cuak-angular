import { Component, OnInit, DoCheck } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Cuak, OneCuak, AddReply, EditReply, DeleteReply } from '../../services/cuak.service';
import { Apollo } from 'apollo-angular';

import swal from 'sweetalert';

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
        })
    });
  }

  ngDoCheck() {
    this.getAuthUser();
  }

  getAuthUser() {
    this.token = this.userService.getToken();
    this.identity = this.userService.getIdentity();
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
