import { gql } from '@apollo/client';

const GET_ISSUES = (name: string, owner: string) => {
	return gql`
		query {
			repository(owner: "${owner}", name: "${name}") {
				issues(last: 10) {
					edges {
						node {
							id
							title
							url
							number
							author {
								url
							}
						}
					}
				}
			}
		}
	`;
};

export { GET_ISSUES };
