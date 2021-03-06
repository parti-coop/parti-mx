import React from "react";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { StatusBar, SafeAreaView as SAV } from "react-native";
import AuthSwitcher from "./src/screens/AuthSwitcher";
import { StoreProvider } from "./src/Store";
import { ApolloProvider } from "@apollo/react-hooks";
import fetch from "node-fetch";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, split } from "apollo-link";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import FlashMessage from "react-native-flash-message";
import LoadingIndicator2 from "./src/components/LoadingIndicator2";
import { setContext } from "apollo-link-context";
import { auth, IdTokenResult } from "./src/firebase";
const HASURA_DOMAIN = `api.parti.mx/v1/graphql`;

const wsLink = new WebSocketLink({
  uri: `wss://${HASURA_DOMAIN}`,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: getFirebaseAuthHeader,
  },
});

const httpLink = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  }),
  new HttpLink({
    uri: `https://${HASURA_DOMAIN}`,
    credentials: "same-origin",
  }),
]);

const link = split(
  // split based on operation type
  ({ query }) => {
    //
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);
async function delay(t: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, t);
  });
}
let refreshCounts = 0;
async function extractValidToken(refresh = false) {
  const res: IdTokenResult = await auth.currentUser.getIdTokenResult(refresh);
  if (res?.claims?.["https://hasura.io/jwt/claims"]?.["x-hasura-user-id"]) {
    return res.token;
  } else {
    if (refresh) {
      refreshCounts++;
      await delay(500);
      console.log("token try: " + refreshCounts);
    }
    return extractValidToken(true);
  }
}
async function getFirebaseAuthHeader(_previousHeader?: Object) {
  const header = {};
  if (_previousHeader) {
    Object.assign(header, _previousHeader);
  }
  let token = await extractValidToken();

  if (token) {
    const Authorization = "Bearer " + token;
    return { headers: { ...header, Authorization } };
  }
  return { headers: header };
}
const authLink = setContext((_, { headers }) => getFirebaseAuthHeader(headers));
declare global {
  namespace NodeJS {
    interface Global {
      fetch: typeof fetch;
    }
  }
}
const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});

export default class App extends React.PureComponent {
  state = {
    isReady: false,
  };

  async _cacheResourcesAsync() {
    return Font.loadAsync({
      notosans: require("./assets/NotoSansCJKkr-Regular.otf"),
      notosans500: require("./assets/NotoSansCJKkr-Medium.otf"),
      notosans700: require("./assets/NotoSansCJKkr-Bold.otf"),
      notosans900: require("./assets/NotoSansCJKkr-Black.otf"),
    });
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }
    return (
      <ApolloProvider client={client}>
        <StoreProvider>
          <SAV style={{ flex: 0, backgroundColor: "#000000" }} />
          <StatusBar barStyle="light-content" />
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
              <AuthSwitcher />
              <LoadingIndicator2 />
            </SafeAreaView>
          </SafeAreaProvider>
          <FlashMessage ref="myLocalFlashMessage" />
        </StoreProvider>
      </ApolloProvider>
    );
  }
}
