import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "http://localhost:8080/graphql", // Actualizar la URL directamente
    cache: new InMemoryCache(),
});

export default client; 