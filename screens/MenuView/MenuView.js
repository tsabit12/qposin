import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import rgba from 'hex-to-rgba';
import Constants from 'expo-constants';
import { Icon } from 'native-base';

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}

const MenuView = props => {
	const { user } = props;
	console.log(Constants.StatusBarHeight);
	return(
		<ImageBackground 
			source={require('../../assets/images/background.png')} 
			style={{flex: 1}}
		>	
			<View style={styles.header}>
				<Text style={styles.title}>QPOSin AJA</Text>
				<View style={{flexDirection: 'row'}}>
					<Text style={[styles.text, {fontSize: 17}]}>
						Halo {capitalize(user.nama.replace(/ .*/,''))}
					</Text>
					<Icon name='md-person' style={{marginLeft: 8, color: '#FFF', fontSize: 24}} />
				</View>
			</View>
			<View style={styles.content}>
				
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	header: {
		height: hp('10%'),
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 15,
		marginRight: 15,
		paddingTop: Constants.statusBarHeight,
		justifyContent: 'space-between',
	},
	content: {
		flex: 1,
		backgroundColor: 'white'
	},
	title: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF',
		fontSize: 20
	},
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF',
	}
})

function mapStateToProps(state) {
	return{
		user: state.auth.session
	}
}

export default connect(mapStateToProps, null)(MenuView);