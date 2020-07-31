import {NgModule} from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

import { ApolloLink , split } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';

import {WebSocketLink} from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import {environment} from '../environments/environment';

interface Definition {
  kind: string;
  operation?: string;
};


const uri = environment.apiUrl; // <-- add the URL of the GraphQL server here
const wsApiUrl = environment.wsApiUrl;

export function provideApollo(httpLink: HttpLink) {

  /* Authorization */
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
  const http = ApolloLink.from([basic, authMiddleware, createUploadLink({uri})]);
 
  // Create a WebSocket link:
  const ws = new WebSocketLink({
    uri: wsApiUrl,
    options: {
      reconnect: true
    }
  });
 
  const cache = new InMemoryCache({ addTypename: true });

  // using the ability to split links, you can send data to each link
    // depending on what kind of operation is being sent
    const link = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation }: Definition = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      ws,
      http,
    );

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
