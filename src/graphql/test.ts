import gql from 'graphql-tag';

export const USER = gql`
	query UserInfo($login: String!, $parNum: Int) {
		user(login: $login) {
			name
			avatarUrl
			pullRequests(first: $parNum) {
				nodes {
					id
					title
					permalink
				}
			}
		}
	}
`;
