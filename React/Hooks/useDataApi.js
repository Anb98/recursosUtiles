import { useReducer } from 'react';
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
 * @returns {[state, fetchData]}
 */
const useDataApi = (url, headers = null) => {
	const [state, dispatch] = useReducer(reducer, {
		isSuccess: false,
		isLoading: false,
		isError: false,
		data: null,
		error: null,
	});

	/**
	 * fetchData
	 * @param {any} [body] - Cuerpo de la peticion
	 * @param {string} [method="get"] - tipo de metodo
	 */
	const fetchData = async (body = null, method = 'get') => {
		dispatch({ type: 'FETCH_INIT' });

		if (state.isLoading) return;

		try {
			const result = await axios({
				method,
				url,
				headers,
				data: body,
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
