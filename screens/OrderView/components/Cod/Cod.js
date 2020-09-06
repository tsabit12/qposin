import React, { useEffect } from 'react';
import {
	View,
	Animated,
	TouchableOpacity,
	StatusBar,
	StyleSheet,
	Modal
} from 'react-native';
import { ListItem, Body, Left, Right, Text } from 'native-base';
import { Entypo, Ionicons } from '@expo/vector-icons'; 
import PropTypes from 'prop-types';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen'; 
import rgba from 'hex-to-rgba';

const Cod = props => {
	const { value } = props;
	const [state, setState] = React.useState({
		modalVisible: false,
		bounceValue: new Animated.Value(200)
	})

	const { modalVisible, bounceValue } = state;

	useEffect(() => {
		if (modalVisible) {
			Animated.spring(bounceValue, {
		      toValue: 0,
		      useNativeDriver: true,
		      tension: 2,
		      friction: 8
		    }).start();
		}
	}, [modalVisible]);

	const handleSimpan = (value) => {
		props.onSimpan(value);
		setTimeout(function() {
			handleCloseModal();
		}, 10);
	}

	const handleCloseModal = () => setState(state => ({
		...state,
		modalVisible: false
	}))
	
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
					<Entypo name="info" size={24} color="black" />
				</Left>
				<Body>
					<Text>Cod</Text>
					<Text note numberOfLines={1}>
						{value === '1' ? 'Ya' : 'Tidak'}
					</Text>
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
							<TouchableOpacity 
								style={[
									styles.btn, {
										backgroundColor: value === '1' ? rgba('#cc1e06', 0.7) : '#cc1e06'
									} 
								]} 
								activeOpacity={0.7}
								onPress={() => handleSimpan('1')}
							>
								<Text style={[styles.text, {color: '#FFF'}]}>Ya</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={[
									styles.btn, {
										backgroundColor: value === '0' ? rgba('#cc1e06', 0.5) : '#cc1e06'
									} 
								]} 
								activeOpacity={0.7}
								disabled={value === '0' ? true : false}
								onPress={() => handleSimpan('0')}
							>
								<Text style={[styles.text, {color: '#FFF'}]}>Tidak</Text>
							</TouchableOpacity>
						</Animated.View>
					</View>
				</Modal> }
		</React.Fragment>
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
		height: hp('17%')
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
})

Cod.propTypes = {
	value: PropTypes.string.isRequired,
	onSimpan: PropTypes.func.isRequired
}	

export default Cod;