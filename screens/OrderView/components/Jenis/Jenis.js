import React, { useState, useEffect } from 'react';
import {
	View,
	Modal,
	Animated,
	StyleSheet,
	StatusBar,
	TouchableOpacity,
	TextInput
} from 'react-native';
import { ListItem, Body, Left, Right, Text } from 'native-base';
import { Feather, Ionicons } from '@expo/vector-icons'; 
import PropTypes from 'prop-types';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen'; 

const Jenis = props => {
	const { error } = props;
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
		// handleCloseModal();
		// setTimeout(function() {
		// 	props.onChoosed(type);
		// }, 10);
		handleAnimated();
		setState(state => ({
			...state,
			jenis: type,
			active: 2
		}))
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

			props.onPress(payload);

			setTimeout(function() {
				handleCloseModal();
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
					<Text style={{color: error ? 'red' : 'black'}}>Kiriman</Text>
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
						<Animated.View style={[styles.modalContainer, {transform: [{translateY: bounceValue }] }]}>
							{ active === 1 && <React.Fragment>
								<TouchableOpacity 
									style={styles.btn} 
									activeOpacity={0.7}
									onPress={() => handleChoosed('1')}
								>
									<Text style={[styles.text, {color: '#FFF'}]}>PAKET</Text>
								</TouchableOpacity>
								<TouchableOpacity 
									style={styles.btn} 
									activeOpacity={0.7}
									onPress={() => handleChoosed('2')}
								>
									<Text style={[styles.text, {color: '#FFF'}]}>SURAT</Text>
								</TouchableOpacity>
							</React.Fragment> }

							{ active === 2 && <React.Fragment>
								<Text style={styles.label}>
									Jenis kiriman = {state.jenis === '1' ? 'Paket' : 'Surat'}
								</Text>
								<TextInput 
									style={styles.input}
									placeholder='Masukkan isi kiriman'
									textAlign='center'
									value={state.isikiriman}
									onChangeText={(value) => setState(state => ({
										...state,
										isikiriman: value
									}))}
								/>
								<TouchableOpacity 
									style={styles.btn} 
									activeOpacity={0.7}
									onPress={handleSave}
								>
									<Text style={[styles.text, {color: '#FFF'}]}>Simpan</Text>
								</TouchableOpacity>
							</React.Fragment> }
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
		borderTopRightRadius: 15,
		height: hp('20%')
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
	input: {
		height: hp('6%'),
		//backgroundColor: 'red',
		borderRadius: 30,
		borderWidth: 0.3
	},
	label: {
		color: '#a3a3a3',
		marginBottom: 4
	}
})

export default Jenis;