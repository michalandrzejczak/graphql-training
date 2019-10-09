import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import {ApolloProvider} from "react-apollo";
import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import {setContext} from "apollo-link-context";
import {BrowserRouter} from "react-router-dom";

const httpLink = createHttpLink({
    uri: "http://localhost:4000",
});

const authLink = setContext((_, {headers}) => {
    // @todo - temporary solution, token retrieved from direct graphql login mutation
    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjanphNmM0ZXkyZWE5MGI1M3I0NmQ5emlnIiwiaWF0IjoxNTcwNjE1OTcyfQ.oPwkna-LdtM1PdYpPo-nYSOg2GCcnp4GUesTQ0vl-oU";

    return {
        headers: {
            ...headers,
            authorization: `Bearer ${token}`,
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById("root"),
);
serviceWorker.unregister();
