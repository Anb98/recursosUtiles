import React, {useState} from 'react';
import PropTypes from 'prop-types';
import SvgUri from 'react-native-fast-svg';
import Draggable from 'react-native-draggable';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '@helpers/responsive';

const Bubble = ({size, onPress }) => {
	const [ x, setX ] = useState(0);
	const [ y, setY ] = useState(150);
	const [show, setShow] = useState(true);

	const onShortPressRelease = (...evt)=>{
		onPress();
	};

	const onDragRelease = (evt, {moveX, moveY})=>{
		const center = WINDOW_WIDTH / 2;
		const initTop = 75;
		const isLeft = moveX < center;
		const isOverTop = moveY < initTop;
		const isOverBottom = moveY > WINDOW_HEIGHT;

		setShow(false);
		setTimeout(()=>{
			const y = moveY - (size / 2);
			setX(isLeft ? 0 : WINDOW_WIDTH - size);
			setY(isOverTop ? initTop : (isOverBottom ? (WINDOW_HEIGHT - size) : y));
			setShow(true);
		});
	};

	return (
		<>
			{
				show &&
					(
						<Draggable
							x={x}
							y={y}
							renderSize={size}
							onDragRelease={onDragRelease}
							onShortPressRelease={onShortPressRelease}
						>
							<SvgUri width={size} height={size} source={{uri: 'https://firebasestorage.googleapis.com/v0/b/lucas-1de40.appspot.com/o/iconos%2Fpago_prestamo_selected.svg?alt=media&token=41a93860-f34c-48f0-8ab5-55cbf5d15a15'}} />
						</Draggable>
					)
			}
		</>
	);
};

Bubble.defaultProps = {
	size:65,
};

Bubble.propTypes = {
	onPress: PropTypes.func.isRequired,
	size:PropTypes.number,
};

export default Bubble;
