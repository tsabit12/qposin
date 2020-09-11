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
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import PropTypes from 'prop-types';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen'; 

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const Berat = props => {
	const refInput = React.useRef();
	const [state, setState] = React.useState({
		modalVisible: false,
		bounceValue: new Animated.Value(200),
		berat: ''
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

			setTimeout(function() {
				refInput.current.focus();
			}, 10);
		}
	}, [state.modalVisible]);

	const handleChangeBerat = (value) => {
		var val = value.replace(/\D/g, '');
		var x 	= Number(val);
		const newValue = numberWithCommas(x);

		setState(state => ({
			...state,
			berat: newValue
		}))
	}

	const handleCloseModal = () => setState(state => ({
		...state,
		berat: '',
		modalVisible: false
	}))

	const handleSimpan = () => {
		if (!state.berat) {
			alert('Berat kiriman belum diisi');
		}else{
			props.onPress(state.berat.replace(/\D/g, ''));
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
					<FontAwesome name="balance-scale" size={19} color="black" />
				</Left>
				<Body>
					<Text style={[styles.labelErr, {color: props.error ? 'red': 'black' }]}>
						Berat (gram)
					</Text>
					<Text note numberOfLines={1}>
						{props.value ? props.value : '-'}
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
							<Text style={[styles.text, {marginBottom: 2}]}>Berat kiriman (gram)</Text>
							<View style={styles.inputGroup}>
							<TextInput 
								style={styles.input}
								placeholder='Masukkan berat'
								value={state.berat}
								ref={refInput}
								onChangeText={(value) => handleChangeBerat(value)}
								keyboardType='number-pad'
								onSubmitEditing={handleSimpan}
							/>
							<TouchableOpacity 
								style={styles.btn} 
								onPress={handleSimpan}
							>
								<MaterialCommunityIcons name="send" size={24} color="black" />
							</TouchableOpacity>
							</View>
						</Animated.View>
					</View>
				</Modal> }
		</React.Fragment>
	);
}

Berat.propTypes = {
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
		height: hp('13%')
	},
	text: {
		fontFamily: 'Nunito-Bold',
	},
	input: {
		height: hp('6%'),
		width: wp('85%'),
		paddingLeft: 10,
		borderTopLeftRadius: 30,
		borderBottomLeftRadius: 30,
	},
	btn: {
		alignItems: 'center',
		justifyContent: 'center',
		height: hp('6%'),
		flex: 1,
		borderTopRightRadius: 30,
		borderBottomRightRadius: 30
	},
	inputGroup: {
		flexDirection: 'row',
		// justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 30,
		marginTop: 5,
		borderWidth: 0.3,
		borderColor: '#737272'
	},
	labelErr: {
		color: 'red',
		fontFamily: 'Nunito-semi',
		fontSize: 15
	}
})

export default Berat;