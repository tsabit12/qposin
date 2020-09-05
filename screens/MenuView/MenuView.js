import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import rgba from 'hex-to-rgba';
import Constants from 'expo-constants';
import { Icon } from 'native-base';
import {
	SliderImage,
	FormTarif
} from './components';
import PropTypes from 'prop-types';

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}

const MenuView = props => {
	const { user, order } = props;
	
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
			<ScrollView
				showsVerticalScrollIndicator={false}
			>
			<View style={styles.content}>
				<View style={styles.slider}>
					<SliderImage />
				</View>
				
				<FormTarif 
					navigate={props.navigation.navigate}
					values={order}
				/>

				<View style={styles.hr} />
				
				<View style={{justifyContent: 'center', alignItems: 'center'}}>
					<View style={styles.menu}>
						<View style={styles.icon} />
						<View style={styles.icon}>
							<Image source={require('../../assets/images/icon/lacak.png')} />
						</View>
						<View style={styles.icon}>
							<Image source={require('../../assets/images/icon/history.png')} />
						</View>
					</View>
					<View style={styles.menu}>
						<View style={styles.icon}>
							<Image source={require('../../assets/images/icon/token.png')} />
						</View>
						<View style={styles.icon}>
							<Image source={require('../../assets/images/icon/call.png')} />
						</View>
					</View>
				</View>
			</View>
			</ScrollView>
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
		backgroundColor: 'white',
	},
	title: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF',
		fontSize: 20
	},
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF',
	},
	slider: {
		// backgroundColor: 'green',
		height: hp('30%')
	},
	icon: {
		height: hp('10%'),
		width: wp('20%'),
		backgroundColor: 'white',
		borderRadius: 18,
		elevation: 3,
		margin: 20,
		justifyContent: 'center',
		alignItems: 'center'
	},
	menu: {
		height: hp('15%'),
		width: wp('100%'), 
		padding: 20,
		//backgroundColor: 'red',
		flexDirection: 'row',
		alignItems: 'center'
		//justifyContent: 'space-between'
		//backgroundColor: 'red',
	},
	hr: {
		width: wp('100%'),
		height: hp('0.1%'),
		backgroundColor: rgba('#FFF', 1),
		marginTop: 10,
		marginBottom: 5,
		elevation: 2
	}
})

MenuView.propTypes = {
	user: PropTypes.object.isRequired,
	order: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	return{
		user: state.auth.session,
		order: state.order
	}
}

export default connect(mapStateToProps, null)(MenuView);