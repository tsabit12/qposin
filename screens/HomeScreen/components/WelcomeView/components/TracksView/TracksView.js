import React, { useEffect } from 'react';
import { View, Text, Animated, Modal, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import rgba from 'hex-to-rgba';
import { Icon } from 'native-base';

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}

const { width, height } = Dimensions.get('window');

const TracksView = props => {
	const { data } = props;
	
	const total = data.length - 1;
	
	const lastdata 		= data[total];
	const description 	= lastdata.description.split(';');


	return(
		<Modal
			transparent={true}
        	visible={true}
        	animationType="fade"
		>
			<View style={styles.modalBackground}>
				<Animated.View style={styles.modalContainer}>
					<TouchableOpacity style={styles.close} onPress={props.onClose}>
						<Icon name='close' style={{fontSize: 34, textAlign:'center'}} />
					</TouchableOpacity>
					<View style={styles.header}>
						<Text style={[styles.text]}>
							Nomor Resi: 
							<Text style={[styles.text], {color: rgba('#545454', 0.6)}}>
								{` ${props.noresi}`}
							</Text>
						</Text>
					</View>
					<ScrollView>
						<View style={styles.content}>
							<Text style={[styles.textList, {marginBottom: 15, marginLeft: 10}]}>Tracking Pesanan</Text>
								<View style={[styles.group]}>
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
					</ScrollView>
				</Animated.View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalBackground: {
		backgroundColor: 'rgba(0,0,0,0.5)',
		flex: 1
	},
	modalContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: '#FFF',
		height: hp('30%'),
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
	},
	text: {
		fontFamily: 'Nunito-Bold'
	},
	center: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	header: {
		// backgroundColor: 'red',
		padding: 10,
		justifyContent: 'center',
		borderBottomWidth: 0.4,
		borderColor: rgba('#696969', 0.6),
		height: hp('9%'),
	},
	content: {
		padding: 10
	},
	textList: {
		color: rgba('#333333', 0.8)
	},
	circle: {
		backgroundColor: 'red',
		height: width / 25,
		width: width / 25,
		borderRadius: Number(width / 25) / 2,
		marginTop: 7
	},
	group: {
		flexDirection: 'row',
		// alignItems: 'center'
	},
	close: {
		position: 'absolute',
		right: 0,
		margin: 15,
		zIndex: 1,
		width: wp('8%')
	}
})

TracksView.propTypes = {
	data: PropTypes.array.isRequired,
	noresi: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired
}

export default TracksView;