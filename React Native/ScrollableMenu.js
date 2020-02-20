import React, {useState} from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	PanResponder,
} from 'react-native';
import { WINDOW_WIDTH } from '@helpers/responsive';

import SvgUri from 'react-native-fast-svg';

import Izq from '@icons/chevron_left.svg';
import Der from '@icons/chevron_right.svg';

const ScrollableMenu = ({items, setSelectedIndex}) => {
	const [selected, setSelected] = useState(0);
	const elementWidth = 70; // calculado tamanio svg + widthBorder + paddingHorizontal"
	const nElementos = items.length;
	const elementosDisponibles = Math.floor(WINDOW_WIDTH / elementWidth);
	const elementosPantalla = ( elementosDisponibles % 2 === 0 ? elementosDisponibles - 1 : elementosDisponibles );
	const middleElement = Math.ceil(elementosPantalla / 2);

	const createPanResponder = (index)=>{

		const _panResponder = PanResponder.create({
			onStartShouldSetPanResponder: (evt, gestureState) => true,
			onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
			onMoveShouldSetPanResponder: (evt, gestureState) => true,
			onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

			onPanResponderMove: (e, {x0, moveX, dx})=>{
				const distance = Math.abs(dx);
				let moveRight = false;
				if (dx > 0) {moveRight = true;}

				if (distance > 20){
					if (moveRight) {selectPrev();}
					else {selectPost();}
				}
			},

			onPanResponderRelease: (e, {x0}) => {
				if (x0 !== 0){ // on press normal
					setSelected(index);
					setSelectedIndex(index);
				}
			},
		});

		return _panResponder.panHandlers;
	};

	const selectPrev = ()=>{
		const prevIndex = selected - 1;
		if (prevIndex < 0) {return setSelected(0);}

		setSelected(prevIndex);
		setSelectedIndex(prevIndex);
	};

	const selectPost = ()=>{
		const postIndex = selected + 1;
		if (postIndex === nElementos) {return setSelected(nElementos - 1);}

		setSelected(postIndex);
		setSelectedIndex(postIndex);
	};

	const renderItems = (data, selectedElement)=>{
		const nElementosLado = middleElement - 1;

		const els = [(
			<TouchableOpacity>
				<View style={styles.border}>
					<SvgUri source={{uri:data[selectedElement]}} width={55} height={55} />
				</View>
			</TouchableOpacity>
		)];

		//lado IZQ
		let contIzq = 1;
		for (let i = nElementosLado; i > 0; i--) {
			const actualIndex = selectedElement - contIzq;
			const prevEl = data[actualIndex];
			contIzq++;

			if (prevEl)
			{
				els.unshift(
					<View style={styles.border} {...createPanResponder(actualIndex)} >
						<SvgUri source={{uri:data[actualIndex]}} width={55} height={55} />
					</View>
				);
			} else {
				els.unshift(<View style={styles.blankItem} />);
			}
		}

		// lado DER
		let contDer = 1;
		for (let i = 0; i < nElementosLado; i++) {
			const actualIndex = selectedElement + contDer;
			const postEl = data[actualIndex];
			contDer++;

			if (postEl)
			{
				els.push(
					<View style={styles.border} {...createPanResponder(actualIndex)} >
						<SvgUri source={{uri:data[actualIndex]}} width={55} height={55} />
					</View>
				);
			} else {
				els.push(<View style={styles.blankItem} />);
			}
		}

		return els;
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={selectPrev} >
				<Izq/>
			</TouchableOpacity>
			{
				renderItems(items, selected)
			}
			<TouchableOpacity onPress={selectPost}>
				<Der/>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container:{
		borderTopColor: '#DADADA',
		borderTopWidth:1,
		paddingTop:7,
		display:'flex',
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',
	},
	blankItem:{
		width:70,
	},
	border:{
		borderRightColor:'#DADADA',
		borderRightWidth:0.5,
		borderLeftColor:'#DADADA',
		borderLeftWidth:0.5,
		paddingHorizontal:7,
	},
});

export default ScrollableMenu;
