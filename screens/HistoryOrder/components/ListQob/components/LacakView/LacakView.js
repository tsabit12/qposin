import React, { useState, useEffect } from 'react';
import { 
	View, 
	Text,
	Modal,
	StyleSheet,
	Animated,
	StatusBar,
	TouchableOpacity,
	Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen'; 
import { Icon } from 'native-base';
import rgba from 'hex-to-rgba';

const { width } = Dimensions.get('window');

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}

const LacakView = props => {
	const { data } = props;
	const [bounceValue] = useState(new Animated.Value(200));

	useEffect(() => {
		Animated.spring(bounceValue, {
	      toValue: 0,
	      useNativeDriver: true,
	      tension: 2,
	      friction: 8
	    }).start();
	}, []);

	const lastdata 		= data[data.length - 1];
	const description 	= lastdata.description.split(';');

	return(
		<Modal
			transparent={true}
        	visible={true}
        	animationType="fade"
        	onRequestClose={props.onClose}
		>
			<View style={[styles.backgroundModal]}>
				<StatusBar backgroundColor="rgba(0,0,0,0.5)"/>
				<Animated.View style={[styles.modalContainer, {transform: [{translateY: bounceValue }] }]}>
					<TouchableOpacity style={styles.close} onPress={props.onClose}>
						<Icon name='close' style={{fontSize: 30, textAlign:'center'}} />
					</TouchableOpacity>
					<View style={styles.header}>
						<Text style={[styles.text]}>
							External ID : 
							<Text style={[styles.text], {color: rgba('#545454', 0.6)}}>
								{` ${props.extid}`}
							</Text>
						</Text>
					</View>
					<View style={{padding: 10}}>
						<Text style={[styles.textList, {marginBottom: 15, marginLeft: 10}]}>Tracking Pesanan</Text>
						<View style={{flexDirection: 'row'}}>
							<View style={styles.circle} />
							<View>
								<Text style={[styles.textList, {marginLeft: 15}]}>
									Status: {capitalize(lastdata.eventName)} ({capitalize(lastdata.officeName)})
								</Text>
								{lastdata.eventName.toLowerCase() === 'selesai antar' && 
									<Text style={[styles.textList, {marginLeft: 15}]}>
										Keterangan/Penerima: {description[2].split(':')[1]}
									</Text> }
								<Text style={[styles.textList, {marginLeft: 15, fontSize: 12}]}>
									{lastdata.eventDate}
								</Text>
							</View>
						</View>
					</View>
				</Animated.View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backgroundModal: {
		backgroundColor: 'rgba(0,0,0,0.5)',
		flex: 1
	},
	text: {
		fontFamily: 'Nunito-Bold'
	},
	textList: {
		color: rgba('#333333', 0.8)
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
		height: hp('25%')
	},
	close: {
		position: 'absolute',
		right: 0,
		margin: 10,
		zIndex: 1,
		width: wp('8%')
	},
	header: {
		// backgroundColor: 'red',
		padding: 10,
		justifyContent: 'center',
		borderBottomWidth: 0.4,
		borderColor: rgba('#696969', 0.6),
		height: hp('7%'),
	},
	circle: {
		backgroundColor: 'red',
		height: width / 25,
		width: width / 25,
		borderRadius: Number(width / 25) / 2,
		marginTop: 7
	},
})

LacakView.propTypes = {
	data: PropTypes.array.isRequired,
	onClose: PropTypes.func.isRequired
}

export default LacakView;