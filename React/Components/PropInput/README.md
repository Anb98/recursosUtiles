# PropInput
Renderiza un label con un input de ant desing determinado por las props de componente ademas de estandarizar el valor recibido en el onchange


## Ejemplo de uso

```js
import React, { useState } from 'react';
import PropInput from './PropInput';

const Ejemplo = () => {
	const [formData, setFormData] = useState({
		email:'',
		pass:'',
		percent:0,
		aceptar:false,
		startDate:new Date().valueOf() //Unix time
	});

	const onChangeHandler = (node, data) => {
		setFormData({
			...formData,
			[node]: data.value,
		});
	};

	return (
		<div>
			// Text
			<PropInput
				node='email'
				data={{ text: 'Correo', type: 'text', value: formData.email }}
				onChange={onChangeHandler}
			/>

			//Pass
			<PropInput
				node='pass'
				data={{ text: 'Contraseña', type: 'pass', value: formData.pass }}
				onChange={onChangeHandler}
			/>

			//Checkbox
			<PropInput
				node='aceptar'
				data={{ text: 'Aceptar terminos', type: 'bool', value: formData.aceptar }}
				onChange={onChangeHandler}
			/>

			//Number
			<PropInput
				node='percent'
				data={{
					text: 'Porcentaje de reducción', 
					type: 'num', 
					min: 0,
					max: 100,
					value: formData.percent, 
				}}
				onChange={onChangeHandler}
			/>

			//Date
			<PropInput
				node='startDate'
				data={{ text: 'Fecha inicio', type: 'date', value: formData.startDate}}
				onChange={onChangeHandler}
			/>
		</div>
	);
};

export default Ejemplo;
```
