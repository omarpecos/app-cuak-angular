// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl : 'http://localhost:4000/graphql',
  wsApiUrl : 'ws:////localhost:4000/graphql',

  lastPaginate : {},
  lastOperation : 'AllCuaks',
  viewingPage : 1,
  searchString : '',
  myConversations : [],
  myNotifications : [],
  dialogOpened : null,
  subsChatRunning : false,
  subNewCommentRunning : false,
};

/*
  LOCAL 

   apiUrl : 'http://localhost:4000/graphql',
  wsApiUrl : 'ws:////localhost:4000/graphql',

  
 GLITCH (Not online now)

  apiUrl : 'https://api-graphql-cuak.glitch.me/graphql',
  wsApiUrl : 'wss://api-graphql-cuak.glitch.me/graphql',

  REPLIT
  
  apiUrl : 'https://api-graphql-cuak-prod.omarpv.repl.co/graphql',
  wsApiUrl : 'wss://api-graphql-cuak-prod.omarpv.repl.co/graphql',


 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
