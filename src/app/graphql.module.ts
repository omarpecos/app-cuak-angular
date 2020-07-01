import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';

const uri = 'http://localhost:4000/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink) {

  //charset utf-8
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));

  // Get the authentication token from local storage if it exists
  let token = localStorage.getItem('token');
  if (!token){
    token = '';
  }
  const auth = setContext((operation, context) => ({
    headers: {
      Authorization: token
    },
  }));
 
 // const link = ApolloLink.from([basic, auth, httpLink.create({ uri })]);
  const link = ApolloLink.from([basic, auth, createUploadLink({uri})]);
  
  return {
    connectToDevTools: true, 
    link,
    cache: new InMemoryCache({ addTypename: true }),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all'
      },
      query : {
        errorPolicy: 'all'
      },
      mutate : {
        errorPolicy: 'all'
      }
    }
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
