import { useState, useReducer } from 'react';
import axios from 'axios';

const reducer = (state, action) => {
	switch (action.type) {
	case 'FETCH_INIT':
		return {
			...state,
			isLoading: true,
			isError: false,
			error: null,
			data: null,
		};
	case 'FETCH_SUCCESS':
		return {
			...state,
			isError: false,
			isLoading: false,
			data: action.payload,
		};
	case 'FETCH_FAILURE':
		return {
			...state,
			isError: true,
			isLoading: false,
			error: action.payload,
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
 * @property {any} data - Respuesta de la solicitud
 * @property {any} error - Error de la solicitud
 */

/**
 * Acciones
 * @typedef {Object} actions
 * @property {function(): void} fetchData - Realiza la solicitud al endpoint
 * @property {function(): void} setBody - Establece el cuerpo de la solicitud
 * @property {function(): void} setMethod - Establece el metodo de la solicitud
 */

/**
 * Cuerpo de la solicitud
 * @typedef {any} body
 */

/**
 * useDataApi
 * @param {string} url - Url de la api a solicitar
 * @param {string} [initialMethod=get] - Metodo inicial de la peticion a la api
 * @param {string?} headers - Header de la peticion
 * @returns {[state, actions, body]}
 */
const useDataApi = (url, initialMethod = 'get', headers = null) => {
	const [method, setMethod] = useState(initialMethod);
	const [body, setBody] = useState(null);

	const [state, dispatch] = useReducer(reducer, {
		isLoading: false,
		isError: false,
		data: null,
		error: null,
	});

	const fetchData = async () => {
		dispatch({ type: 'FETCH_INIT' });
		try {
			const result = await axios({
				method,
				url,
				headers,
				data: body,
			});
			dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
		} catch (error) {
			dispatch({ type: 'FETCH_FAILURE', payload: error });
		}
	};


	return [state, { fetchData, setBody, setMethod }, body];
};

export default useDataApi;
