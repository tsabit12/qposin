import React, { useEffect, useState } from 'react';
import {
	Modal,
	View,
	Text,
	StyleSheet,
	StatusBar,
	Animated,
	TouchableOpacity
} from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import AnimatedLoader from "react-native-animated-loader";
import PropTypes from 'prop-types';
import { Icon } from 'native-base';
import * as Updates from 'expo-updates';

const ConfirmRestartView = props => {
	const handleCloseApp = async () => {
		await Updates.reloadAsync();
	}

	return(
		<View 
			style={{
				backgroundColor: '#FFF', 
				width: wp('80%'),
				height: hp('20%'),
				justifyContent: 'center',
				alignItems: 'center',
				borderRadius: 7,
				padding:10
			}}>
			<Text
				style={{fontFamily: 'Nunito-semi', fontSize: 16, textAlign: 'center'}}
			>
				Pembaharuan telah selesai, mohon konfirmasi untuk memulai ulang aplikasi
			</Text>
			<TouchableOpacity
				style={{
					backgroundColor: '#e0162b',
					width: wp('70%'),
					height: hp('6%'),
					marginTop: 5,
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: 30,
				}}
				activeOpacity={0.7}
				onPress={handleCloseApp}
			>
				<Text
					style={{fontFamily: 'Nunito-semi', color: '#FFF', fontSize: 17}}
				>
					Konfirmasi
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const UpdateView = props => {
	const [bounceValue] = useState(new Animated.Value(400));
	const [loading, setLoading] = useState(false);
	const [restart, setRestart] = useState(false);

	useEffect(() => {
		Animated.spring(bounceValue, {
			toValue: 0,
			useNativeDriver: true,
			tension: 2
		}).start()
	}, [])


	const handleUpdate = async () => {
		setLoading(true);
		try{
			await Updates.fetchUpdateAsync();
			setTimeout(function() {
				setLoading(false);
				setRestart(true);
			}, 500);
		}catch(err){
			setTimeout(function() {
				setLoading(false);
				alert('Pembaharuan gagal!');
			}, 2000);
		}
	}

	return(
		<Modal
			transparent={true}
        	visible={true}
        	//onRequestClose={() => handleClose()}
        	animationType="fade"
		>
			<AnimatedLoader
		        visible={loading}
		        overlayColor="rgba(0,0,0,0.0)"
		        source={require("./assets/images/loader/3098.json")}
		        animationStyle={styles.lottie}
		        speed={2}
		    />
			<StatusBar backgroundColor="rgba(0,0,0,0.5)"/>
			<View style={{backgroundColor: 'rgba(0,0,0,0.5)', flex: 1}}>
				<Animated.View style={[styles.root, {transform: [{translateY: bounceValue }]}]}>
					{ restart && <ConfirmRestartView /> }
					{ !loading && !restart && <View style={styles.content}>
						<View style={styles.header}>
							<Text style={styles.title}>PESAN</Text>
						</View>
						<TouchableOpacity 
							style={styles.btnClose}
							activeOpacity={0.7}
							onPress={props.onClose}
						>
							<Icon name='ios-close' color='white' />
						</TouchableOpacity>
						<View 
							style={{
								backgroundColor: '#FFF',
								width: wp('85%'),
								justifyContent: 'space-around',
								alignItems: 'center',
								height: hp('23%'),
								borderBottomRightRadius: 10,
								borderBottomLeftRadius: 10,
							}}
						>
							<View style={styles.cardContent}>
								<Text style={styles.message}>
									QPOSin AJA membutuhkan pembaharuan. Apakah kamu setuju untuk melakukan pembaharuan sekarang?
								</Text>
							</View>
							<View style={styles.footer}>
								<TouchableOpacity 
									style={styles.btn}
									onPress={handleUpdate}
								>
									<Text style={styles.textBtn}>PERBAHARUI SEKARANG</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View> }
				</Animated.View>
			</View>
		</Modal>
	);
}

UpdateView.propTypes = {
	onClose: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		top: 0,
		justifyContent: 'center',
		alignItems: 'center'
		//backgroundColor: '#FFF'
	},
	content: {
		height: hp('30%'),
		width: wp('85%'),
		borderRadius: 3,
		alignItems: 'center',
		backgroundColor: '#FFF'
	},
	header: {
		backgroundColor: '#e0162b',
		borderTopLeftRadius: 3,
		borderTopRightRadius: 3,
		height: hp('7%'),
		justifyContent: 'center',
		width: wp('85%')
	},
	title: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF',
		textAlign: 'center',
		fontSize: 18
	},
	cardContent: {
		//backgroundColor: 'yellow',
		height: hp('17%'),
		justifyContent: 'center',
		width: wp('75%'),
	},
	message: {
		textAlign: 'center',
		fontFamily: 'Nunito-semi',
		fontSize: 15
	},
	footer: {
		// backgroundColor: 'red',
		flex: 1,
		justifyContent: 'space-between',
		width: wp('75.5%'),
		alignItems: 'center',
		flexDirection: 'row'
	},
	btn: {
		//backgroundColor: 'green',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: hp('6%')
	},
	textBtn: {
		fontFamily: 'Nunito-semi',
		color: '#0061f2',
		fontSize: 15
	},
	lottie: {
	    width: 50,
	    height: 50
	},
	btnClose: {
		position: 'absolute',
		right: 0,
		top: 0,
		height: 40,
		width: 40,
		elevation: 2,
		backgroundColor: 'white',
		borderBottomLeftRadius: 45 / 2,
		borderBottomRightRadius: 45 / 2,
		borderTopLeftRadius: 45 / 2,
		borderTopRightRadius: 3,
		// borderTopRightRadius: 7,
		justifyContent: 'center',
		alignItems: 'center'
	}
})

export default UpdateView;