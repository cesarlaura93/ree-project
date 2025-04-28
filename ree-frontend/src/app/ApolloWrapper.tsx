"use client";

import { ApolloProvider } from "@apollo/client";
import client from "../lib/apolloClient"; // Ajusta la ruta si es necesario

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
} 