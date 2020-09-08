import React, { useState, useEffect } from 'react';
import { 
	View, 
	Text, 
	StyleSheet,
	TouchableOpacity,
	Animated
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Icon } from 'native-base'
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import rgba from 'hex-to-rgba';
import PropTypes from 'prop-types';
import api from '../../api';
import { CommonActions } from '@react-navigation/native';

const ScanBarcode = props => {
	const [state, setState] = useState({
		hasPermission: null,
		scanned: false
	})
	const [animationLineHeight, setAnimationLineHeight] = useState(0)
	const [focusLineAnimation, setFocusLineAnimation] = useState(
		new Animated.Value(0)
	);

	const { hasPermission, scanned } = state;

	useEffect(() => {
	    (async () => {
	      const { status } = await BarCodeScanner.requestPermissionsAsync();
	      
	      setState(state => ({
	      	...state,
	      	hasPermission: status === 'granted'
	      }))
	      animateLine();
	    })();
	}, []);

	const animateLine = () => {
		Animated.sequence([
			Animated.timing(focusLineAnimation, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: true
			}),
			Animated.timing(focusLineAnimation, {
				toValue: 0,
				duration: 1000,
				useNativeDriver: true
			}),
		]).start(animateLine)
	}

	const getPermission = async () => {
		const { status } = await BarCodeScanner.requestPermissionsAsync();
		setState(state => ({
			...state,
			hasPermission: status === 'granted'
		}))
	}

	const handleBarCodeScanned = ({ data }) => {
		if (!state.scanned) { //run when not scanned
			api.lacakKiriman(data)
				.then(tracks => {
					setState(state => ({
						...state,
						scanned: true
					}))
					props.navigation.dispatch(
					  CommonActions.reset({
					    index: 1,
					    routes: [
					      { name: 'Home', params: { lacakList: tracks, nomor: data } }
					    ],
					  })
					);
				})
				.catch(err => {
					setState(state => ({
						...state,
						scanned: true
					}))
				})
		}
	}



	if (hasPermission === null) {
		return(
			<View style={styles.centered}>
				<Text style={styles.text}>Meminta izin kamera...</Text>
			</View>
		);
	}else{
		return(
			<React.Fragment>
				{ hasPermission === false ? <View style={styles.centered}>
					<Text style={styles.text}>Tidak mendapatkan akses ke kamera</Text>
					<TouchableOpacity 
						style={[styles.btn, {marginTop: 10}]}
						onPress={getPermission}
					>
						<Text style={[styles.text, {fontSize: 16}]}>Cobalagi</Text>
					</TouchableOpacity>
				</View> : 
				<View style={styles.container}>
					<BarCodeScanner
						onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
						style={StyleSheet.absoluteFillObject}
					/>
						<View style={styles.closeIcon}>
							<TouchableOpacity onPress={props.onClose}>
								<Icon name='close' style={{color: '#FFFF', fontSize: 30}}/>
							</TouchableOpacity>
						</View>
						<View style={styles.overlay}>
							<View style={[styles.unfocusedContainer]}></View>
							<View style={[styles.middleContainer]}>
								<View style={[styles.unfocusedContainer]}></View>
								<View
									onLayout={e => setAnimationLineHeight(e.nativeEvent.layout.height)}
									style={styles.focusedContainer}
								>
									{!scanned && (
										<Animated.View
											style={[
												styles.animationLineStyle, {
													transform: [{
														translateY: focusLineAnimation.interpolate({
															inputRange: [0, 1],
															outputRange: [0, animationLineHeight],
														}),
													}],
												},
											]}
										/>
									)}
									
									{scanned && (
										<TouchableOpacity
											onPress={() => setState(state => ({
												...state,
												scanned: false
											}))}
											style={styles.rescanIconContainer}
										>
											<Icon style={{fontSize: 100, color: rgba('#FFF', 0.7)}} name='refresh' />
											<Text style={{fontFamily: 'Nunito-Bold', color: '#FFF'}}>Kiriman tidak ditemukan</Text>
										</TouchableOpacity>
									)}
								</View>
								<View style={styles.unfocusedContainer}></View>
							</View>
							<View style={styles.unfocusedContainer}></View>
						</View>
				</View> }
			</React.Fragment>
		);
	}
}

const styles = StyleSheet.create({
	centered: {
		flex: 1, 
		justifyContent: 'center',
		backgroundColor: '#212121'
	},
	container: {
		flex: 1,
		position: 'relative',
		backgroundColor: '#212121'
	},
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFFF',
		fontSize: 17,
		textAlign: 'center'
	},
	btn: {
		padding: 10,
		borderRadius: 25,
		width: wp('80%'),
		height: hp('6%'),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ffac30'
	},
	overlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		//backgroundColor: 'red'
	},
	unfocusedContainer: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.6)',
	},
	middleContainer: {
		flexDirection: 'row',
		flex: 1.5,
	},
	focusedContainer: {
		flex: 6,
	},
	animationLineStyle: {
		height: 2,
		width: '100%',
		backgroundColor: 'red',
	},
	rescanIconContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	closeIcon: {
		position: 'absolute',
		right: 0,
		top: 0,
		margin: 50,
		zIndex: 1
	}
})

// ScanBarcode.propTypes = {
// 	onSearch: PropTypes.func.isRequired
// }

export default ScanBarcode;