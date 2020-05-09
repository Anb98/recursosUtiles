import React, { useReducer } from 'react';
import axios from 'axios';

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
			isSuccess: true,
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
 */

/**
 * useDataApi
 * @param {initialSettings} [initialSettings] - Configuracion inicial
 * @returns {[state, fetchData]} Estado del hook y funcion fetchData 
 */
const useDataApi = ({
	url: originalUrl,
	headers = null
}={}) => {
	const [state, dispatch] = useReducer(reducer, {
		isSuccess: false,
		isLoading: false,
		isError: false,
		data: null,
		error: null,
	});

	/**
	 * Parametros
	 * @typedef {Object} fetchDataParams
	 * @prop {any} [body] - Cuerpo de la peticion
	 * @prop {string} [method=get] - Metodo http
	 * @prop {string} [params] - Parametros get de la peticion
	 * @prop {string} [url] - URL de la peticion
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
		}={}) => {

		dispatch({ type: 'FETCH_INIT' });

		if (state.isLoading) return;

		try {
			const result = await axios({
				method,
				url: url || originalUrl,
				headers,
				data: body,
				params,
			});

			const { data, status } = result;

			dispatch({ type: 'FETCH_SUCCESS', payload: { data, status } });
		} catch (error) {
			dispatch({ type: 'FETCH_FAILURE', payload: { data: error, status: error.response?.status } });
		}
	};


	return [state, fetchData];
};

export default useDataApi;
