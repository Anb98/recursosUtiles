import firebase from 'firebase';

const buscarNodo = (nodo) => {
	const data = {};

	const search = async (value) => {
		if (value) {
			const res = data[value];
			if (res) return res;

			if (value) {
				const snap = await firebase.database().ref().child(nodo).child(value)
					.once('value');
				if (snap.exists()) {
					const result = snap.val();
					result.key = value;
					data[value] = result;
					return result;
				}
			}
		}
		return false;
	};

	return search;
};

export default buscarNodo;
