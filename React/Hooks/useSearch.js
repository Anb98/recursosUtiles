import React, { useState, useEffect } from 'react';

const useSearch = ({ whitelist = [], blacklist = [] } = {}) => {
	const [searchValue, setSearchValue] = useState('');
	const [filtered, setFiltered] = useState([]);
	const [sourceData, setSourceData] = useState([]);

	const filter = () => {
		const value = searchValue.toLowerCase().trim().split(' ');

		const filteredData = sourceData.filter((item, i) => {
			let res = false;
			for (const prop in item) {
				if (blacklist.includes(prop) || (whitelist.length && !whitelist.includes(prop))) {
					continue;
				}

				if (value.length === 1) { // una sola palabra
					if (String(item[prop]).toLocaleLowerCase().includes(value[0])) res = true;
				} else { // al menos 2 palabras de busqueda
					let coincidencias = 0;
					value.forEach((el, i) => {
						if (String(item[prop]).toLocaleLowerCase().includes(el)) coincidencias++;
					});

					if (coincidencias >= value.length) res = true;
				}
			}
			return res;
		});

		setFiltered(filteredData);
	};

	useEffect(() => {
		filter();
	}, [searchValue, sourceData]);

	return [filtered, setSearchValue, setSourceData];
};


export default useSearch;
