import React, { useState, useEffect, useRef } from 'react';
import {
	View,
	Text,
	Modal,
	StyleSheet,
	Animated,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback 
} from 'react-native';
import PropTypes from 'prop-types';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 


const EmailView = props => {
	const inputRef = useRef();
	const [email, setEmail] = useState(props.values ? props.values : '');

	useEffect(() => {	
		setTimeout(function() {
			inputRef.current.focus();
		}, 10);
	}, []);

	const handleSubmit = () => {
		var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		if (!email) {
			alert('Email belum diisi');
		}else if(!re.test(email)){
			alert('Email tidak valid')
		}else{
			props.onUpdate(email);
		}
	}

	return(
		<Modal 
			transparent={true}
			onRequestClose={props.handleClose}
		>
			<TouchableOpacity 
    			activeOpacity={1} 
    			onPressOut={props.handleClose}
    			style={{flex: 1}}
    		>
    			<TouchableWithoutFeedback>
					<View style={[styles.root]}>
						<View style={styles.inputGroup}>
							<TextInput 
								style={styles.input}
								ref={inputRef}
								value={email}
								onChangeText={(value) => setEmail(value)}
								keyboardType='email-address'
								autoCapitalize='none'
								onSubmitEditing={handleSubmit}
							/>
							<TouchableOpacity 
								style={styles.btn}
								onPress={handleSubmit}
							>
								<MaterialCommunityIcons name="send" size={24} color="black" />
							</TouchableOpacity>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</TouchableOpacity>
		</Modal>
	);	
}

const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 1,
		padding: 5,
		backgroundColor: '#c70000',
		// borderTopLeftRadius: 10,
		// borderTopRightRadius: 10
	},
	inputGroup: {
		flexDirection: 'row',
		// justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 30,
		marginTop: 5,
		// borderWidth: 0.3,
		borderColor: '#737272',
		backgroundColor: 'white'
	},
	input: {
		height: hp('6%'),
		width: wp('87%'),
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
		borderBottomRightRadius: 30,
		// backgroundColor: 'red'
	}
})

EmailView.propTypes = {
	handleClose: PropTypes.func.isRequired,
	onUpdate: PropTypes.func.isRequired
}

export default EmailView;