import React, { useEffect, useState } from 'react';
import { 
	View, 
	Text, 
	Modal,
	Animated,
	StyleSheet,
	StatusBar,
	TouchableOpacity
} from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const UpdateMessage = props => {
	const [bounceValue] = useState(new Animated.Value(300))

	useEffect(() => {
		Animated.spring(bounceValue, {
	      toValue: 0,
	      useNativeDriver: true,
	      delay: 100,
	      friction: 8,
	      tension: 2,
	    }).start();	
	}, []);

	return(
		<Modal
			transparent={true}
        	visible={true}
        	onRequestClose={() => props.handleClose()}
        	animationType="fade"
		>
			<StatusBar backgroundColor="rgba(0,0,0,0.5)"/>
			<View style={{backgroundColor: 'rgba(0,0,0,0.5)', flex: 1}}>
				<Animated.View 
		        	style={[
		        		styles.message, { 
		        			transform: [{translateX: bounceValue }],
		        		} 
		        	]}>
		        	<View style={styles.content}>
			        	<Text style={[styles.text]}>
			        		Oppps.. {'\n'}Kami belum mendapatkan alamat kamu
			        	</Text>
			        	<TouchableOpacity 
			        		style={styles.button}
			        		activeOpacity={0.8}
			        		onPress={props.onSubmit}
			        	>
			        		<Text style={[styles.text, {color: '#FFF'}]}>Lengkapi sekarang</Text>
			        	</TouchableOpacity>
		        	</View>
		        </Animated.View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	message: {
		position: 'absolute',
  		bottom: 0,
  		left: 0,
  		right: 0,
  		// backgroundColor: '#ffae00',
  		//justifyContent: 'space-between',
  		//flexDirection: 'row',
  		alignItems: 'center',
  		padding: 10,
  		//margin: 7,
	},
	content: {
		backgroundColor: '#FFF',
		height: hp('15%'),
		width: wp('97%'),
		alignItems: 'center',
		padding: 10,
		borderRadius: 3,
		justifyContent: 'space-around'

	},
	text: {
		fontFamily: 'Nunito-Bold',
		// color: '#FFF'
		textAlign: 'center'
	},
	button: {
		backgroundColor: '#e0162b',
		height: hp('5.3%'),
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 30,
		width: wp('74%')
	}
})

export default UpdateMessage;