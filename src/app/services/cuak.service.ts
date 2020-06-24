import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
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
  constructor() { }
}

/* Queries de CUAK */
@Injectable({
  providedIn: 'root'
})
//AllCuaks extendia de Query<Response> pero ahora solo utilizo el gql con 
// apollo watchquery
export class AllCuaks{
    document = gql`
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
                username
              }
            }
        }
  }
`
}

@Injectable({
  providedIn: 'root'
})
export class SearchCuaks{
  document = gql`
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
}
