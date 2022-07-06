import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import ListPage from './pages/List/List.index';

import Error404Page from './pages/Error/404/Error404.index';

const endpoint = 'https://api.github.com/graphql';
const client = new ApolloClient({
	uri: endpoint,
	cache: new InMemoryCache(),
});

const App = () => {
	return (
		<ApolloProvider client={client}>
			<BrowserRouter>
				<Routes>
					<Route path="/list" element={<ListPage />} />
					<Route path="*" element={<Error404Page />} />
				</Routes>
			</BrowserRouter>
		</ApolloProvider>
	);
};

export default App;
