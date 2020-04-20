import axios from 'axios';
import { reactive, toRefs } from '@vue/composition-api';

export default (originalUrl, headers = null) => {
	const state = reactive({
		status: 0,
		isSuccess: false,
		isLoading: false,
		isError: false,
		data: null,
		error: null,
	});


	const dispatch = (action, payload) => {
		switch (action) {
		case 'FETCH_INIT':
			state.status = 0;
			state.isSuccess = false;
			state.isLoading = true;
			state.isError = false;
			state.data = null;
			state.error = null;
			break;
		case 'FETCH_SUCCESS':
			state.data = payload.data;
			state.status = payload.status;
			state.isSuccess = true;
			state.isLoading = false;
			state.isError = false;
			state.error = null;
			break;
		case 'FETCH_FAILURE':
			state.status = payload.status;
			state.error = payload.data;
			state.isSuccess = false;
			state.isLoading = false;
			state.isError = true;
			break;
		default:
			throw new Error();
		}
	};

	/**
	 * fetchData
	 * @param {any} [body] - Cuerpo de la peticion
	 * @param {string} [method="get"] - tipo de metodo
	 */
	const fetchData = async ({
		body = null,
		method = 'get',
		params = undefined,
		url = null,
	} = {}) => {
		if (state.isLoading) return;
		dispatch('FETCH_INIT');

		try {
			const result = await axios({
				method,
				url: url || originalUrl,
				headers,
				data: body,
				params,
			});

			const { data, status } = result;

			dispatch('FETCH_SUCCESS', { data, status });
		} catch (error) {
			dispatch('FETCH_FAILURE', { data: error.response?.data, status: error.response?.status });
		}
	};

	return [{ ...toRefs(state) }, fetchData];
};
