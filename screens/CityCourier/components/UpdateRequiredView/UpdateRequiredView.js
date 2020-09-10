import React from 'react';
import {
	View, 
	Text,
	Animated,
	StyleSheet,
	ImageBackground,
	Image,
	TouchableOpacity
} from 'react-native';
import { Icon } from 'native-base';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import * as Linking from 'expo-linking';

const UpdateRequiredView = props => {
	return(
		<View style={styles.root}>		
			<ImageBackground 
				style={styles.header}
				source={require('../../../../assets/images/background.png')}
			>
				<TouchableOpacity 
					style={{
						width: wp('7%'),
						marginLeft: 20
					}} 
					onPress={() => props.navigation.goBack()}
				>
					<Icon name='ios-arrow-back' style={{color: '#FFF', fontSize: 25, marginTop: 20}} />
				</TouchableOpacity>

				<Text style={[styles.text, { color: '#FFF', fontSize: 17, marginTop: 20}]}>City Courier</Text>
			</ImageBackground>
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<View style={styles.spaceAround}>
					<View style={{width: wp('80%')}}>
						<Text style={[styles.text, { textAlign: 'center'}]}>
							Fitur map tidak berfungsi di versi ini, Silahkan update ke versi terbaru
						</Text>
					</View>
					<TouchableOpacity 
						style={styles.btn}
						activeOpacity={0.7}
						onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.posindonesia.cob')}
					>
						<Text style={[styles.text, { color: '#FFF'}]}>Update App</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1
	},
	image: {
		height: hp('30%'),
		width: wp('50%'),
		//backgroundColor: 'white',
		alignItems: 'center'
	},
	text: {
		fontFamily: 'Nunito-Bold'
	},
	btn: {
		backgroundColor: '#d43302',
		height: hp('7%'),
		justifyContent: 'center',
		width: wp('70%'),
		alignItems: 'center',
		borderRadius: 30
	},
	spaceAround: {
		height: hp('18%'),
		alignItems: 'center',
		justifyContent: 'space-around'
	},
	header: {
		height: hp('10%'),
		//justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center'
	}
})

export default UpdateRequiredView;