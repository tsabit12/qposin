import React, { useState, useEffect } from 'react';
import {
	View,
	Modal,
	Animated,
	StyleSheet,
	StatusBar,
	TouchableOpacity,
	TextInput,
	Platform
} from 'react-native';
import { ListItem, Body, Left, Right, Text } from 'native-base';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import PropTypes from 'prop-types';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen'; 

const Jenis = props => {
	const { error } = props;
	const { isKeyboardVisible } = props;
	const [state, setState] = useState({
		modalVisible: false,
		bounceValue: new Animated.Value(200),
		jenis: props.values,
		active: 1,
		isikiriman: ''
	})

	const { modalVisible, bounceValue, active } = state;

	useEffect(() => {
		if (modalVisible) {
			handleAnimated();
		}
	}, [modalVisible]);

	const handleAnimated = () => {
		bounceValue.setValue(200);
		Animated.spring(bounceValue, {
	      toValue: 0,
	      useNativeDriver: true,
	      tension: 2,
	      friction: 8
	    }).start();
	}

	const handlePress = () => {
		setState(state => ({
			...state,
			modalVisible: true
		}))
	}

	const handleChoosed = (type) => {
		if(type === '1'){
			handleAnimated();
			setState(state => ({
				...state,
				jenis: type,
				active: 2
			}))
		}else{
			const payload = {
				isikiriman: ' ',
				jenis: type
			}			
			props.onPress(payload);
			setTimeout(() => {
				handleCloseModal();
			}, 200);
		}
	}

	const handleCloseModal = () => setState(state => ({
		...state,
		modalVisible: false,
		active: 1,
		isikiriman: ''
	}))

	const handleSave = () => {
		if (!state.isikiriman) {
			alert('Isi kiriman belum dilengkapi');
		}else{
			const payload = {
				isikiriman: state.isikiriman,
				jenis: state.jenis
			}			

			setTimeout(function() {
				handleCloseModal();
				props.onPress(payload);
			}, 10);
		}
	}

	return(
		<React.Fragment>
			<ListItem 
				avatar 
				onPress={handlePress}
				disabled={props.disabled}
			>
				<Left>
					<Feather name="box" size={23} color="black" />
				</Left>
				<Body>
					<Text style={[styles.labelErr, {color: props.error ? 'red': 'black' }]}>
						Kiriman
					</Text>
					{ props.values === '-' ? <Text note numberOfLines={1}>
						-
					</Text> : <Text note numberOfLines={1}>
						{ props.values === '1' ? 'Paket' : 'Surat'}, {props.isi}
					</Text>}
				</Body>
				<Right style={{justifyContent: 'center'}}>
		            <Ionicons name="ios-arrow-forward" size={24} color="black" />
		        </Right>
			</ListItem>
			{ modalVisible && 
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
							{ active === 1 ? <Text style={{fontFamily: 'Nunito-Bold', textAlign: 'center'}}>
									Pilih jenis kiriman
								</Text> : <Text style={styles.label}>
									Jenis kiriman = {state.jenis === '1' ? 'Paket' : 'Surat'}
								</Text> }

							{ active === 1 && <View style={styles.group}>
								<TouchableOpacity 
									style={[styles.btn, {borderTopLeftRadius: 30, borderBottomLeftRadius: 30}]} 
									activeOpacity={0.7}
									onPress={() => handleChoosed('1')}
								>
									<Text style={[styles.text, {color: '#FFF'}]}>PAKET</Text>
								</TouchableOpacity>
								<TouchableOpacity 
									style={[styles.btn, {borderTopRightRadius: 30, borderBottomRightRadius: 30}]} 
									activeOpacity={0.7}
									onPress={() => handleChoosed('0')}
								>
									<Text style={[styles.text, {color: '#FFF'}]}>SURAT</Text>
								</TouchableOpacity>
							</View> }

							{ active === 2 && state.jenis === '1' && <View style={styles.inputGroup}>
								<TextInput 
									style={styles.input}
									placeholder='Masukkan isi kiriman'
									value={state.isikiriman}
									onChangeText={(value) => setState(state => ({
										...state,
										isikiriman: value
									}))}
									onSubmitEditing={handleSave}
								/>
								<TouchableOpacity 
									onPress={handleSave}
									style={styles.btnGroup}
								>
									<MaterialCommunityIcons name="send" size={24} color="black" />
								</TouchableOpacity>
							</View> }
						</Animated.View>
					</View>
				</Modal> }
		</React.Fragment>
	);
}

Jenis.propTypes = {
	onPress: PropTypes.func.isRequired,
	values: PropTypes.string.isRequired,
	isi: PropTypes.string.isRequired,
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
		flex: 1,
		borderWidth: 0.3,
		borderColor: '#FFF'
	},
	input: {
		height: hp('6%'),
		// backgroundColor: 'red',
		width: wp('85%'),
		paddingLeft: 10,
		borderTopLeftRadius: 30,
		borderBottomLeftRadius: 30,
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
	label: {
		color: '#a3a3a3',
		marginBottom: 4
	},
	group: {
		flexDirection: 'row',
		marginTop: 10,
		alignItems: 'center',
		justifyContent: 'center'
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
	}
})

Jenis.propTypes = {
	isKeyboardVisible: PropTypes.object.isRequired
}

export default Jenis;