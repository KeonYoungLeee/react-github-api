import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import './Repository.style.scss';

import { Link } from 'react-router-dom';
import { GET_REPOSITORY_SEARCH } from '../../graphql/getRepository';
import { client } from '../../graphql/client';

const Repository: FC = () => {
	const [repositoryDatas, setRepositoryDatas] = useState<any>();
	const [search, setSearch] = useState('');
	const searchTimeRef = useRef<null | ReturnType<typeof setTimeout>>(null);
	const [isinfiniteLoading, setIsinfiniteLoading] = useState(false);

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
				if (repositoryDatas && !isinfiniteLoading) {
					setIsinfiniteLoading(true);
					const { data } = await client.query({
						query: GET_REPOSITORY_SEARCH(search),
					});
					setRepositoryDatas((prev: any) => {
						return prev.concat(data.search.edges);
					});
					setIsinfiniteLoading(false);
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
	}, [search, repositoryDatas, isinfiniteLoading]);

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
										const { nameWithOwner, name, description } = value.node;
										const owner: string = nameWithOwner.split('/')[0];
										return (
											<div key={`name-${valueIndex.toString()}-${name}`} className="content">
												<Link to={`/issues?name=${name}&owner=${owner}`}>
													<h2>{name}</h2>
													<p>{description}</p>
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
