import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import './Repository.style.scss';

import { Link } from 'react-router-dom';
import { GET_REPOSITORY_SEARCH, GET_REPOSITORY_COUNT } from '../../graphql/getRepository';
import { client } from '../../graphql/client';

const Repository: FC = () => {
	const [repositoryDatas, setRepositoryDatas] = useState<any>();
	const [search, setSearch] = useState('');
	const searchTimeRef = useRef<null | ReturnType<typeof setTimeout>>(null);

	const onChangeSearch = useCallback((eve: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(eve.target.value);
	}, []);

	const searchTimeoutHandle = useCallback(async () => {
		const searchContent = document.querySelector('#search-content') as HTMLDivElement;
		searchContent.scrollTo(0, 0);
		if (search !== '') {
			const { data } = await client.query({
				query: GET_REPOSITORY_SEARCH(search),
			});
			setRepositoryDatas(data.search.edges);
		} else {
			setRepositoryDatas([]);
		}
	}, [search]);

	useEffect(() => {
		searchTimeRef.current = setTimeout(searchTimeoutHandle, 200);
		return () => {
			clearTimeout(searchTimeRef.current as NodeJS.Timeout);
		};
	}, [searchTimeoutHandle]);

	useEffect(() => {
		const searchContent = document.querySelector('#search-content') as HTMLDivElement;
		const onScroll = async () => {
			if (searchContent.scrollTop + searchContent.clientHeight > searchContent.scrollHeight - 30) {
				if (repositoryDatas) {
					const { data } = await client.query({
						query: GET_REPOSITORY_COUNT(search, 1),
					});
					setRepositoryDatas((prev: any) => {
						return prev.concat(data.search.edges);
					});
				}
			}
		};
		if (searchContent) {
			searchContent.addEventListener('scroll', onScroll);
		}
		return () => {
			if (searchContent) {
				searchContent.removeEventListener('scroll', onScroll);
			}
		};
	}, [search, repositoryDatas]);

	return (
		<div className="layout">
			<div className="layout-content">
				<div className="form-group">
					<label htmlFor="name" className="form-label">
						<input type="text" className="form-text" placeholder="Github Repository Search" onChange={onChangeSearch} />
					</label>
				</div>
				<div className="search-content" id="search-content">
					{search === '' ? (
						<div />
					) : (
						<div>
							{repositoryDatas ? (
								<>
									{repositoryDatas.map((value: any, valueIndex: number) => {
										return (
											<div key={`name-${valueIndex.toString()}-${value.node.name}`} className="content" id="content">
												<Link to={`/issues/${value.node.name}`}>
													<h2>{value.node.name}</h2>
													<p>{value.node.description}</p>
												</Link>
											</div>
										);
									})}
								</>
							) : (
								<div />
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Repository;
