import React from 'react';
import { 
	View, 
	Text,
	StyleSheet,
	ImageBackground,
	TouchableOpacity
} from 'react-native';
import { Icon } from 'native-base';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const EditAlamatView = props => {
	return(
		<View style={styles.root}>
			<ImageBackground 
				source={require('../../assets/images/background.png')} 
				style={{
					height: hp('10%')
				}}
			>	
				<View style={styles.header}>
					<TouchableOpacity 
						style={styles.btn} 
						onPress={() => props.navigation.goBack()}
					>
						<Icon name='ios-arrow-back' style={{color: '#FFF', fontSize: 25, marginTop: 20}} />
					</TouchableOpacity>
					<Text style={[styles.text, {marginTop: 20, fontSize: 17}]}>
						Update alamat
					</Text>
				</View>
			</ImageBackground>
			<View style={{flex: 1}}>
				<Text style={styles.textBlack}>Riwayat Terbaru</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1
	},
	header: {
		height: hp('10%'),
		flexDirection: 'row',
		// backgroundColor: 'white',
		alignItems: 'center',
		marginLeft: 20
	},
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF'
	},
	btn: {
		width: wp('7%'),
	},
	textBlack: {
		fontFamily: 'Nunito-Bold'		
	}
})

export default EditAlamatView;