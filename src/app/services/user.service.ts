import { Injectable } from '@angular/core';

import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class UserService{
  //identity y token
  getToken(){
    let token = localStorage.getItem('token');
    return token;
  }

  getIdentity(){
    let identity = localStorage.getItem('identity');
    return JSON.parse(identity);
  }

}

/*export function getHeaders(token){
  let headers = new HttpHeaders().set("Authorization", token); // adding header
 var context =  { 
    headers: headers
 };
console.log(context);

 return context;
}*/



/* Mutations de Usuario */

@Injectable({
  providedIn: 'root'
})
export class UserLogin extends Mutation {
  document = gql`
    mutation login(
      $username : String!,
      $password : String!){
      login(
        username : $username ,
        password : $password){
            token
            user{
              _id
              username
              email
              role
            }
      }
    }
  `
}

@Injectable({
  providedIn: 'root'
})
export class UserRegister extends Mutation {
  document = gql`
      mutation register(
        $username : String!,
        $email : String!,
        $password : String!,
        $confirmPassword : String!
      ){
          register(
            username : $username,
            email : $email,
            password : $password,
            confirmPassword : $confirmPassword
          ){
                _id
                username
                email
          }
      }
  `
}


/* Queries de Usuarios */
export const AllUsersForSelect = gql`
    query allUsers{
        allUsers{
              _id
              username
              email
        }
    }
`

