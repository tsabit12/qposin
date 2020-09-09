import React, {useState, useEffect, useRef} from 'react';
import { 
	Modal, 
	View, 
	StyleSheet, 
	Text, 
	Animated, 
	TouchableOpacity, 
	StatusBar,
	TextInput
} from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import rgba from 'hex-to-rgba';
import PropTypes from 'prop-types';
import { Toast } from 'native-base';

const ChangePinView = props => {
	
	const [state, setState] = useState({
		bounceValue: new Animated.Value(200),
		pinConfirm: ''
	})
	
	const { bounceValue } = state;

	useEffect(() => {
		Animated.spring(bounceValue, {
	      toValue: 0,
	      useNativeDriver: true,
	      tension: 2,
	      friction: 8
	    }).start();
	}, []);

	useEffect(() => {
		if (state.pinConfirm.length === 6) {
			if (state.pinConfirm !== props.pin) {
				alert('Pin tidak sesuai');
				setState(state => ({
					...state,
					pinConfirm: ''
				}))
			}else{
				props.goDoneConfirm();
			}
		}
	}, [state.pinConfirm])

	return(
		<Modal
			transparent={true}
        	visible={true}
        	animationType="fade"
		>
			<StatusBar backgroundColor="rgba(0,0,0,0.5)"/>
			<View style={styles.backgroundModal}>
				<Animated.View style={[styles.modalContainer, {transform: [{translateY: bounceValue }] }]}>
					<Text style={[styles.text, { marginTop: 5}]}>
						PIN baru kamu adalah ({ props.pin })
					</Text>
					<Text style={[styles.text]}>
						Kamu bisa menggantinya nanti di menu profil
					</Text>
					<View style={{height: hp('15%'), marginTop: 13}}>
						<Text 
							style={[styles.text, {color: rgba('#2e2e2d', 0.7), marginBottom: 3}]}
						>Konfirmasi PIN</Text>
						<TextInput 
							placeholder='Konfirmasi pin kamu disini'
							style={styles.input}
							textAlign='center'
							value={state.pinConfirm}
							keyboardType='number-pad'
							onChangeText={(value) => setState(state => ({
								...state,
								pinConfirm: value
							}))}
						/>
					</View>
				</Animated.View>
			</View>
		</Modal>
	);
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
		borderRadius: 30
	},
	input: {
		borderWidth: 0.3,
		height: hp('6%'),
		borderRadius: 30,
		paddingLeft: 15
	}
})

export default ChangePinView;