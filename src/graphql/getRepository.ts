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
						}
					}
				}
			}
		}
	`;
};

const GET_REPOSITORY_COUNT = (text: string, count: number) => {
	return gql`
		query {
			search(query: "${text}", type: REPOSITORY, first: ${count}) {
				repositoryCount
				edges {
					node {
						... on Repository {
							name
							description
						}
					}
				}
			}
		}
	`;
};

export { GET_REPOSITORY_SEARCH, GET_REPOSITORY_COUNT };
