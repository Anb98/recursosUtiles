import { useReducer, useContext } from 'react';
import axios from 'axios';

import { CacheContext } from '@contexts/CacheContext';

const reducer = (state, action) => {
	switch (action.type) {
	case 'FETCH_INIT':
		return {
			...state,
			status: 0,
			isSuccess: false,
			isLoading: true,
			isError: false,
			error: null,
			data: null,
		};
	case 'FETCH_SUCCESS':
		return {
			...state,
			status: action.payload.status,
			isSuccess: Math.random(),
			isLoading: false,
			isError: false,
			data: action.payload.data,
		};
	case 'FETCH_FAILURE':
		return {
			...state,
			status: action.payload.status,
			isSuccess: false,
			isLoading: false,
			isError: true,
			error: action.payload.data,
		};
	default:
		throw new Error();
	}
};

/**
 * Estado de la solicitud
 * @typedef {Object} state
 * @property {boolean} isLoading - Cargando
 * @property {boolean} isError - Ocurrio un error
 * @property {boolean} isSuccess - La solicitud ha sido completada con exito
 * @property {boolean} status - Estado de la peticion
 * @property {any} data - Respuesta de la solicitud
 * @property {any} error - Error de la solicitud
 */

/**
 * useDataApi
 * @param {string} url - Url de la api a solicitar
 * @param {string} [initialMethod='get'] - Metodo inicial de la peticion a la api
 * @param {string?} headers - Header de la peticion
 * @param {boolean?} hasCache - Cache los resultados en context
 * @returns {[state, fetchData]}
 */
const useDataApi = (originalUrl, headers = null, hasCache = false) => {
	const { state: stateCache, setResult } = useContext(CacheContext);

	const [state, dispatch] = useReducer(reducer, {
		isSuccess: false,
		isLoading: false,
		isError: false,
		data: null,
		error: null,
	});

	const requestApi = async (request, stringRequest) => {
		try {
			dispatch({ type: 'FETCH_INIT' });
			const result = await axios(request);
			const { data, status } = result;

			dispatch({ type: 'FETCH_SUCCESS', payload: { data, status } });

			if (hasCache) {
				setResult(stringRequest, data);
			}
		} catch (error) {
			dispatch({ type: 'FETCH_FAILURE', payload: { data: error, status: error.response?.status } });
		}
	};

	/**
	 * fetchData
	 * @param {any} [body] - Cuerpo de la peticion
	 * @param {string} [method="get"] - tipo de metodo
	 * @param {string} [params] - parametros get de la peticion
	 * @param {string} [url] - url de la peticion
	 */
	const fetchData = async ({
		body = null,
		method = 'get',
		params = undefined,
		url = null,
	} = {}) => {
		if (state.isLoading) return;

		const request = {
			method,
			url: url || originalUrl,
			headers,
			data: body,
			params,
		};

		const stringRequest = JSON.stringify(request);

		if (!hasCache) {
			return requestApi(request);
		}


		if (stateCache[stringRequest]) {
			dispatch({
				type: 'FETCH_SUCCESS',
				payload: { data: stateCache[stringRequest], status: 200 },
			});
		} else {
			requestApi(request, stringRequest);
		}
	};


	return [state, fetchData];
};

export default useDataApi;
