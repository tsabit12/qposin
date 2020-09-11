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

const UpdateView = props => {
	const [bounceValue] = useState(new Animated.Value(401));
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		Animated.spring(bounceValue, {
			toValue: 0,
			useNativeDriver: true,
			tension: 2
		}).start()
	}, [])

	const handleUpdate = () => {
		setLoading(true);
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
					{ !loading && <View style={styles.content}>
						<View style={styles.header}>
							<Text style={styles.title}>TIME TO UPDATE!</Text>
						</View>
						<View 
							style={{
								backgroundColor: '#FFF',
								width: wp('95.5%'),
								justifyContent: 'space-around',
								alignItems: 'center',
								height: hp('23%'),
								borderBottomRightRadius: 10,
								borderBottomLeftRadius: 10,
							}}
						>
							<View style={styles.cardContent}>
								<Text style={styles.message}>
									QPOSin baru saja menambahkan fitur baru untuk mencapai tujuan kamu semudah mungkin
								</Text>
							</View>
							<View style={styles.footer}>
								<TouchableOpacity 
									style={styles.btn}
									onPress={() => props.onClose()}
								>
									<Text style={styles.textBtn}>NANTI</Text>
								</TouchableOpacity>

								<TouchableOpacity 
									style={styles.btn}
									onPress={handleUpdate}
								>
									<Text style={styles.textBtn}>UPDATE</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View> }
				</Animated.View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		top: 0,
		justifyContent: 'center'
		//backgroundColor: '#FFF'
	},
	content: {
		height: hp('30%'),
		margin: 10,
		borderRadius: 7,
		alignItems: 'center',
		backgroundColor: '#FFF'
	},
	header: {
		backgroundColor: '#e0162b',
		borderTopLeftRadius: 7,
		borderTopRightRadius: 7,
		height: hp('7%'),
		justifyContent: 'center',
		width: wp('95.5%')
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
		//backgroundColor: 'red',
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
		fontSize: 16
	},
	lottie: {
	    width: 50,
	    height: 50
	}
})

export default UpdateView;