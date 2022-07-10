import { gql } from '@apollo/client';

const GET_REPOSITORY_SEARCH = (text: string) => {
	return gql`
		query {
			search(query: "${text}", type: REPOSITORY, first: 10) {
				repositoryCount
				edges {
					node {
						... on Repository {
							name
							description
							nameWithOwner
							url
						}
					}
				}
			}
		}
	`;
};

export { GET_REPOSITORY_SEARCH };
