import React, { useState, useEffect } from 'react';
import {
	View,
	Modal,
	StatusBar,
	Animated,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Image,
	Platform
} from 'react-native';
import { ListItem, Body, Left, Right, Text } from 'native-base';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import PropTypes from 'prop-types';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen'; 

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const Nilai = props => {
	const refInput = React.useRef();
	const [state, setState] = React.useState({
		modalVisible: false,
		bounceValue: new Animated.Value(200),
		nilai: ''
	})
	const { isKeyboardVisible } = props;

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
					<Image 
						source={require('../../../../assets/images/icon/rp.png')}
						style={{
							width: wp('5%'),
							height: hp('4%')
						}}
						resizeMode='contain'
					/>
				</Left>
				<Body>
					<Text style={[styles.labelErr, {color: props.error ? 'red': 'black' }]}>
						Nilai barang 
						{ props.cod === '0' && ' (Optional)'}
					</Text>
					<Text note numberOfLines={1}>
						{props.value ? `${numberWithCommas(props.value)}` : '-'}
					</Text>
				</Body>
				<Right style={{justifyContent: 'center'}}>
		            <Ionicons name="ios-arrow-forward" size={24} color="black" />
		        </Right>
			</ListItem>
			{ props.error && <Text style={styles.error}>{props.error}</Text>}
			{ state.modalVisible && 
				<Modal
					transparent={true}
		        	visible={true}
		        	animationType="fade"
		        	onRequestClose={handleCloseModal}
				>
					<StatusBar backgroundColor="rgba(0,0,0,0.5)"/>
					<View style={styles.backgroundModal}>
						<Animated.View 
							style={[
								styles.modalContainer, 
								{
									transform: [{translateY: bounceValue }],
									height: Platform.OS === 'ios' && isKeyboardVisible.open ? isKeyboardVisible.height + hp('15%') : hp('14%') 
								}
							]}>
							<Text style={{fontFamily:'Nunito-Bold', textAlign: 'center'}}>
								Nilai barang
							</Text>
							<View style={styles.inputGroup}>
								<TextInput 
									ref={refInput}
									style={styles.input}
									placeholder='Masukkan nilai barang'
									value={state.nilai}
									onChangeText={(value) => handleChangenilai(value)}
									keyboardType='number-pad'
									onSubmitEditing={handleSimpan}
								/>
								<TouchableOpacity 
									style={styles.btnGroup} 
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

Nilai.propTypes = {
	value: PropTypes.string.isRequired,
	onPress: PropTypes.func.isRequired,
	isKeyboardVisible: PropTypes.object.isRequired
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
		borderTopRightRadius: 15
	},
	text: {
		fontFamily: 'Nunito-Bold',
	},
	btn: {
		backgroundColor: '#cc1e06',
		alignItems: 'center',
		justifyContent: 'center',
		height: hp('6%'),
		borderRadius: 30,
		marginTop: 10
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
	input: {
		height: hp('6%'),
		// backgroundColor: 'red',
		width: wp('85%'),
		paddingLeft: 10,
		borderTopLeftRadius: 30,
		borderBottomLeftRadius: 30,
	},
	btnGroup: {
		alignItems: 'center',
		justifyContent: 'center',
		height: hp('6%'),
		flex: 1,
		borderTopRightRadius: 30,
		borderBottomRightRadius: 30
	},
	labelErr: {
		color: 'red',
		fontFamily: 'Nunito-semi',
		fontSize: 15
	},
	error: {
		fontSize: 12, color: 'red', 
		fontFamily: 'Nunito',
		textAlign: 'center'
	}
})

export default Nilai;