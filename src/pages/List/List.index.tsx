import React from 'react';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-boost';

const GET_REPOSITORY = gql`
	query {
		repository(owner: "apollographql", name: "apollo-client") {
			name
			url
			milestones(states: [OPEN, CLOSED], first: 3) {
				totalCount
				nodes {
					url
					title
					dueOn
					closed
					description
				}
				pageInfo {
					endCursor
					hasNextPage
				}
			}
		}
	}
`;

const client = new ApolloClient({
	uri: 'https://api.github.com/graphql',
	request: (operation) => {
		operation.setContext({
			headers: {
				authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
			},
		});
	},
});

const List: React.FC = () => {
	const fetch = async () => {
		const { data } = await client.query({
			query: GET_REPOSITORY,
		});
		console.log(data);
	};

	React.useEffect(() => {
		fetch();
	}, []);

	return (
		<div className="App">
			<div>asdasd</div>
		</div>
	);
};

export default List;
