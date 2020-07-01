import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Query, Mutation } from 'apollo-angular';
import gql from 'graphql-tag';


/* Interfaces (o modelos) */
export interface Cuak {
  _id : string,
  title : string,
  text : string,
  date : string,
  lastRepliedAt : string,
  image : string,
  author : any
}

/*export interface Response {
  allCuaks : Cuak[];
}*/

@Injectable({
  providedIn: 'root'
})
export class CuakService {
  //para otros servicios o nose
  constructor(
    private http : HttpClient
  ) { }

  getNewUrlImg() : Observable<any>{
      return this.http.get('https://source.unsplash.com/random');
  }
}

/* Queries de CUAK */

  //AllCuaks era una class extendia de Query<Response> pero ahora solo utilizo el gql con 
  //y de ultimas lo he tenido como clase y en document = gql``

export const AllCuaks  = gql`
    query allCuaks ($paginate : PagInput) {
        allCuaks (paginate : $paginate) {
            hasNext
            next
            hasPrevious
            previous
            
            results{
              _id
              title
              text
              image
              date
              author{
                _id
                username
              }
            }
        }
  }
`

export const OneCuak = gql`
    query oneCuak ($id : ID!){
        oneCuak (id : $id){
            _id
            title
            text
            image
            date
            author{
              _id
              username
            }
        }
    }
  `

export const SearchCuaks =  gql`
    query searchCuaks ($search : String!){
        searchCuaks (search : $search){
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
  `

/* MUTATIONS FOR CUAKS */

export const AddCuak = gql`
      mutation addCuak (
          $input : newCuakInput!,
          $imageFile : Upload
      ){
          addCuak(
            input : $input,
            imageFile : $imageFile
          ){
              _id
              title
              text
              date
              image
              author{
                _id
                username
              }
          }
      }
  `

export const EditCuak = gql`

  mutation editCuak(
      $id : ID!,
      $input : newCuakInput!,
      $imageFile : Upload
  ){
      editCuak(
          id : $id,
          input : $input,
          imageFile : $imageFile
      ){
            _id
            title
            text
            date
            image
            author{
              _id
              username
            }
      }
  }
`

export const DeleteCuak = gql`
  mutation deleteCuak($id : ID!){
      deleteCuak(id : $id){
        _id
        title
        author{
          _id
          username
        }
      }
  }
`
