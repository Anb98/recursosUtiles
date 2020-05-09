import React, { useReducer, useContext } from 'react';
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
 * @prop {boolean} isLoading - Cargando
 * @prop {boolean} isError - Ocurrio un error
 * @prop {boolean} isSuccess - La solicitud ha sido completada con exito
 * @prop {boolean} status - Estado de la peticion
 * @prop {any} data - Respuesta de la solicitud
 * @prop {any} error - Error de la solicitud
 */

/**
 * Configuracion inicial
 * @typedef {Object} initialSettings
 * @prop {string} [url] - Url inicial de la api a solicitar
 * @prop {string} [headers] - Header de la peticion
 * @prop {boolean} [hasCache] - Cache los resultados en context
 */

/**
 * useDataApi
 * @param {initialSettings} [initialSettings] - Configuracion inicial
 * @returns {[state, fetchData]} Estado del hook y funcion fetchData 
 */
const useDataApi = ({
	url: originalUrl,
	headers = null,
	hasCache = false
} = {}) => {
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
	 * Parametros
	 * @typedef {Object} fetchDataParams
	 * @prop {any} [body] - Cuerpo de la peticion
	 * @prop {string} [method=get] - tipo de metodo
	 * @prop {string} [params] - parametros get de la peticion
	 * @prop {string} [url] - url de la peticion
	 * @prop {string} [refreshCache=false] - Refresca el cache si existe
	 */

	/**
	 * fetchData
	 * @param {fetchDataParams}
	 */
	const fetchData = async ({
		body = null,
		method = 'get',
		params = undefined,
		url = null,
		refreshCache = false
	} = {}) => {
		if (state.isLoading) return;	//hay una solicitud en proceso

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


		if (stateCache[stringRequest] && !refreshCache ) {
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
