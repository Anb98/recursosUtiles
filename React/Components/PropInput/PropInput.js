import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
	InputNumber, Checkbox, Input, DatePicker,
} from 'antd';
// import locale from 'antd/es/date-picker/locale/es_ES';

const PropInput = ({ onChange, node, data }) => {
	const inputEl = useRef();

	const getValue = (e, date, type) => {
		switch (type) {
		case 'num': return `${e}`;
		case 'bool': return e.target.checked;
		case 'date': return date;
		default: return e.target.value;
		}
	};

	const onChangeHandler = (e, date) => {
		const val = getValue(e, date, data.type);

		let unixTime=null;
		if(data.type === 'date'){
			const fechaArray = val.split('/');
			unixTime = new Date(fechaArray[2], (fechaArray[1] - 1), fechaArray[0]).valueOf();
		}

		onChange(node, { 
			...data, 
			value: (data.type === 'date')? unixTime : val, 
			format: (data.type === 'date')? val : undefined,
		});
	};


	const renderInput = (dato) => {
		switch (dato.type) {
		case 'bool':
			return <Checkbox onChange={onChangeHandler} checked={dato.value} ref={inputEl} />;
		case 'num':
			return (
				<InputNumber
					onChange={onChangeHandler}
					value={dato.value}
					ref={inputEl}
					min={dato.min}
					max={dato.max}
				/>
			);
		case 'date':
			return <DatePicker format='DD/MM/YYYY' value={dato.value} ref={inputEl} onChange={onChangeHandler} />;
		case 'pass':
			return <Input.Password onChange={onChangeHandler} value={dato.value} ref={inputEl} />;
		default:
			return <Input onChange={onChangeHandler} value={dato.value} ref={inputEl} />;
		}
	};

	return (
		<Wrapper type={data.type}>
			<label onClick={() => inputEl.current.focus()}>{data.text}</label>
			{ renderInput(data) }
		</Wrapper>
	);
};

const Wrapper = styled.div` 
margin-bottom: 0.2em;

    label{
        font-weight:bold;
        display: ${(props) => props.type !== 'bool' && 'block'};
        margin-right: ${(props) => props.type === 'bool' && '1em'};
    }

    .ant-input-number{
        width:initial;
    }

`;

PropInput.defaultProps = {
	data: {
		min: 0,
		max: Infinity,
	},
};

PropInput.propTypes = {
	node: PropTypes.string.isRequired,
	data: PropTypes.shape({
		text: PropTypes.string.isRequired,
		type: PropTypes.oneOf(['bool', 'num', 'date', 'text', 'pass']).isRequired,
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.bool,
			PropTypes.number,
		]).isRequired,
		min: PropTypes.number,
		max: PropTypes.number,
	}),
	onChange: PropTypes.func.isRequired,
};

export default PropInput;
