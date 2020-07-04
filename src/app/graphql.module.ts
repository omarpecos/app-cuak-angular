import {NgModule} from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';

const uri = 'http://localhost:4000/graphql'; // <-- add the URL of the GraphQL server here
export function provideApollo(httpLink: HttpLink) {

  //charset utf-8
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));
  
  const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    // we assume `headers` as a defined instance of HttpHeaders
    operation.setContext(() => ({
      headers: {
        Authorization : localStorage.getItem('token') || null
      }
    }));

    return forward(operation);
  })
 
 // const link = ApolloLink.from([basic, auth, httpLink.create({ uri })]);
  const link = ApolloLink.from([basic, authMiddleware, createUploadLink({uri})]);
  const cache = new InMemoryCache({ addTypename: true });

  return {
    connectToDevTools: true, 
    link,
    cache,
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
  exports: [ApolloModule, HttpLinkModule,HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: provideApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
