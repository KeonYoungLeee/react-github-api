import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import RepositoryPage from './pages/Repository/Repository.index';
import IssuesPage from './pages/Issues/Issues.index';

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
					<Route path="/" element={<RepositoryPage />}>
						<Route element={<RepositoryPage />} index />
					</Route>
					<Route path="/issues/:id" element={<IssuesPage />} />
					<Route path="*" element={<Error404Page />} />
				</Routes>
			</BrowserRouter>
		</ApolloProvider>
	);
};

export default App;
