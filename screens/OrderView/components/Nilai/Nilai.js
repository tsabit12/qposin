import React, { useState, useEffect } from 'react';
import {
	View,
	Modal,
	StatusBar,
	Animated,
	StyleSheet,
	TextInput,
	TouchableOpacity
} from 'react-native';
import { ListItem, Body, Left, Right, Text } from 'native-base';
import { MaterialIcons, Ionicons } from '@expo/vector-icons'; 
import PropTypes from 'prop-types';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen'; 

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const Nilai = props => {
	const [state, setState] = React.useState({
		modalVisible: false,
		bounceValue: new Animated.Value(200),
		nilai: ''
	})

	const { bounceValue } = state;

	useEffect(() => {
		if (state.modalVisible) {
			Animated.spring(bounceValue, {
		      toValue: 0,
		      useNativeDriver: true,
		      tension: 2,
		      friction: 8
		    }).start();
		}
	}, [state.modalVisible]);

	const handleChangenilai = (value) => {
		var val = value.replace(/\D/g, '');
		var x 	= Number(val);
		const newValue = numberWithCommas(x);

		setState(state => ({
			...state,
			nilai: newValue
		}))
	}

	const handleCloseModal = () => setState(state => ({
		...state,
		nilai: '',
		modalVisible: false
	}))

	const handleSimpan = () => {
		if (!state.nilai) {
			alert('Nilai barang belum diisi');
		}else if(Number(state.nilai.replace(/\D/g, '') <= 0)){
			alert('Nilai barang harus lebih dari 0');
		}else{
			props.onPress(state.nilai.replace(/\D/g, ''));
			handleCloseModal();
		}
	}

	return(
		<React.Fragment>
			<ListItem 
				avatar 
				onPress={() => setState(state => ({
					...state,
					modalVisible: true
				}))}
				disabled={props.disabled}
			>
				<Left>
					<MaterialIcons name="attach-money" size={24} color="black" />
				</Left>
				<Body>
					<Text style={{color: props.error ? 'red': 'black'}}>Nilai barang</Text>
					<Text note numberOfLines={1}>
						{props.value ? `Rp ${numberWithCommas(props.value)}` : '-'}
					</Text>
				</Body>
				<Right style={{justifyContent: 'center'}}>
		            <Ionicons name="ios-arrow-forward" size={24} color="black" />
		        </Right>
			</ListItem>
			{ state.modalVisible && 
				<Modal
					transparent={true}
		        	visible={true}
		        	animationType="fade"
		        	onRequestClose={handleCloseModal}
				>
					<StatusBar backgroundColor="rgba(0,0,0,0.5)"/>
					<View style={styles.backgroundModal}>
						<Animated.View style={[styles.modalContainer, {transform: [{translateY: bounceValue }] }]}>
							<TextInput 
								style={styles.input}
								placeholder='Masukkan nilai barang'
								textAlign='center'
								value={state.nilai}
								onChangeText={(value) => handleChangenilai(value)}
								keyboardType='number-pad'
							/>
							<TouchableOpacity 
								style={styles.btn} 
								activeOpacity={0.7}
								onPress={handleSimpan}
							>
								<Text style={[styles.text, {color: '#FFF'}]}>Simpan</Text>
							</TouchableOpacity>
						</Animated.View>
					</View>
				</Modal> }
		</React.Fragment>
	);
}

Nilai.propTypes = {
	value: PropTypes.string.isRequired,
	onPress: PropTypes.func.isRequired,
	error: PropTypes.bool.isRequired
}

const styles = StyleSheet.create({
	backgroundModal: {
		backgroundColor: 'rgba(0,0,0,0.5)',
		flex: 1
	},
	modalContainer: {
		backgroundColor: 'white',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		padding: 10,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		height: hp('16%')
	},
	text: {
		fontFamily: 'Nunito-Bold',
	},
	input: {
		height: hp('6%'),
		//backgroundColor: 'red',
		borderRadius: 30,
		borderWidth: 0.3
	},
	btn: {
		backgroundColor: '#cc1e06',
		alignItems: 'center',
		justifyContent: 'center',
		height: hp('6%'),
		borderRadius: 30,
		marginTop: 10
	},
})

export default Nilai;