import React, { FC, useState, useCallback, useEffect } from 'react';
import './Issues.style.scss';
import { useLocation } from 'react-router-dom';

import { client } from '../../graphql/client';
import { GET_ISSUES } from '../../graphql/getIssues';

const Issues: FC = () => {
	const location = useLocation();
	const [repositoryDatas, setRepositoryDatas] = useState<any>();
	const [name, setName] = useState('');
	const [owner, setOwner] = useState('');

	const fetchData = useCallback(async () => {
		const urlSearchParams = new URLSearchParams(location.search.slice(1));
		const { data } = await client.query({
			query: GET_ISSUES(urlSearchParams.get('name') ?? '', urlSearchParams.get('owner') ?? ''),
		});
		setName(urlSearchParams.get('name') ?? '');
		setOwner(urlSearchParams.get('owner') ?? '');
		setRepositoryDatas(data);
	}, [location.search]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<div className="layout">
			<div className="layout-content">
				<h2 className="issue-title">
					{name}
					{owner ? <span> ({owner})</span> : <span />}
				</h2>
				<div className="issue-content">
					<div>
						{repositoryDatas &&
							repositoryDatas.repository &&
							repositoryDatas.repository.issues.edges.map((value: any, valueIndex: number) => {
								const { id, title, number } = value.node;
								return (
									<div key={`id-${valueIndex.toString()}-${id}`} className="content">
										<p>issue {number}</p>
										<span>{title}</span>
									</div>
								);
							})}
						{repositoryDatas && repositoryDatas.repository && repositoryDatas.repository.issues.edges.length === 0 ? (
							<h2 className="not-found">Not Found Issue</h2>
						) : (
							<div />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Issues;
