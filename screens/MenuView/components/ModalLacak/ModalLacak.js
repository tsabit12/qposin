import React, { useEffect } from 'react';
import {
	View,
	Animated,
	TouchableOpacity,
	StatusBar,
	StyleSheet,
	Modal,
	TextInput,
	Dimensions,
	Text as TextDefault
} from 'react-native';
import { Text } from 'native-base';
import { Ionicons, Feather } from '@expo/vector-icons'; 
import { Icon } from 'native-base';
import PropTypes from 'prop-types';
import Hr from "react-native-hr-component";
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen'; 
import rgba from 'hex-to-rgba';
import api from '../../../../api';
import AnimatedLoader from "react-native-animated-loader";
const { width, height } = Dimensions.get('window');


const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}


const ListLacak = props => {
	const { data } = props;
	const total = data.length - 1;
	const lastdata 		= data[total];
	const description 	= lastdata.description.split(';'); 
	const penerima 	= description[2].split(':')[1].trim();
	const status 	= description[1].split(':')[1].trim();
	const waktu 	= description[0].split(':');

	return(
		<View style={{minHeight: hp('7%')}}>
			<TouchableOpacity style={styles.close} onPress={props.onClose}>
				<Icon name='close' style={{fontSize: 34, textAlign:'center'}} />
			</TouchableOpacity>
			<View style={stylesLacak.header}>
				<TextDefault style={[stylesLacak.text]}>
					Nomor Resi: 
					<TextDefault style={[styles.text], {color: rgba('#545454', 0.6)}}>
						{` ${props.noresi}`}
					</TextDefault>
				</TextDefault>
			</View>
			<View style={stylesLacak.content}>
				<TextDefault style={[stylesLacak.textList, {marginBottom: 15, marginLeft: 10}]}>Tracking Pesanan</TextDefault>
					<View style={[stylesLacak.group]}>
						<View style={stylesLacak.circle} />
						<View>
							<TextDefault style={[stylesLacak.textList, {marginLeft: 15}]}>
								Status : {capitalize(lastdata.eventName)}
							</TextDefault>
							<TextDefault style={[stylesLacak.textList, {marginLeft: 15}]}>
								Penerima : {capitalize(penerima)}
							</TextDefault>
							<TextDefault style={[stylesLacak.textList, {marginLeft: 15, fontSize: 12}]}>
								{waktu[1].trim()}:{waktu[2].trim()}
							</TextDefault>
						</View>
					</View>
			</View>
		</View>
	);
}

const stylesLacak = StyleSheet.create({
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

const ModalLacak = props => {
	const { value } = props;
	const [state, setState] = React.useState({
		bounceValue: new Animated.Value(200),
		active: 1,
		data: [],
		loading: false
	})
	const [barcode, setBarcode] = React.useState('');

	const { bounceValue } = state;

	useEffect(() => {
		setAnimated();
	}, []);

	useEffect(() => {
		if (props.list.length > 0) {
			setState(state => ({
				...state,
				active: 2,
				data: props.list
			}))
			setBarcode(props.nomor);

		}
	}, [props.list])

	const handleSubmit = () => {
		if (!barcode) {
			alert('Barcode belum diisi');
		}else{
			setState(state => ({
				...state,
				loading: true
			}))

			api.lacakKiriman(barcode)
				.then(tracks => {
					setAnimated();
					setState(state => ({
						...state,
						data: tracks,
						loading: false,
						active: 2
					}))
				})
				.catch(err => {
					alert('Kiriman tidak ditemukan')
					setState(state => ({
						...state,
						loading: false
					}))
				})			
		}
	}

	const setAnimated = () => {
		bounceValue.setValue(200);
		Animated.spring(bounceValue, {
	      toValue: 0,
	      useNativeDriver: true,
	      tension: 2,
	      friction: 8
	    }).start();
	}

	const handleNavigate = () => {
		props.onClose();
		setTimeout(function() {
			props.navigateBarcode();
		}, 10);		
	}

	return(
		<Modal
			transparent={true}
        	visible={true}
        	animationType="fade"
        	onRequestClose={props.onClose}
		>
			<AnimatedLoader
		        visible={state.loading}
		        overlayColor="rgba(0,0,0,0.5)"
		        source={require("../../../../assets/images/loader/3098.json")}
		        animationStyle={styles.lottie}
		        speed={1}
		    />
			<StatusBar backgroundColor="rgba(0,0,0,0.5)"/>
			<View style={[styles.backgroundModal, { height: state.active ? null : hp('23%')}]}>
				<Animated.View style={[styles.modalContainer, {transform: [{translateY: bounceValue }] }]}>					
					{ state.active === 1 ?  <React.Fragment>
						<View style={styles.inputGroup}>
							<TextInput 
								style={styles.input}
								placeholder='Masukkan kode barcode'
								returnKeyType='done'
								onChangeText={(text) => setBarcode(text)}
								value={barcode}
								onSubmitEditing={handleSubmit}
							/>
							<TouchableOpacity 
								style={styles.btn}
								onPress={handleSubmit}
							>
								<Feather name="search" size={24} color="black" />
							</TouchableOpacity>
						</View>
						<Hr 
					    	lineColor={rgba('#737272', 0.4)}
					    	width={1} 
					    	textPadding={10} 
					    	text="atau" 
					    	textStyles={styles.hr} 
					    	hrPadding={10}
					    />
					    <TouchableOpacity 
							style={styles.btnDefault}
							activeOpacity={0.7}
							onPress={handleNavigate}
						>
							<Text style={[styles.text, { color: '#FFF'}]}>Scan barcode</Text>
						</TouchableOpacity>
					</React.Fragment> : 
					<ListLacak 
						data={state.data} 
						noresi={barcode} 
						onClose={props.onClose}
					/> }
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
	modalContainer: {
		backgroundColor: 'white',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		padding: 10,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		justifyContent: 'space-around'
	},
	text: {
		fontFamily: 'Nunito-Bold',
		fontSize: 14
	},
	inputGroup: {
		flexDirection: 'row',
		// justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 30,
		marginTop: 5,
		borderWidth: 0.3,
		borderColor: '#737272'
	},
	btn: {
		alignItems: 'center',
		justifyContent: 'center',
		height: hp('6%'),
		flex: 1,
		borderTopRightRadius: 30,
		borderBottomRightRadius: 30
	},
	input: {
		height: hp('6%'),
		// backgroundColor: 'red',
		width: wp('85%'),
		paddingLeft: 10,
		borderTopLeftRadius: 30,
		borderBottomLeftRadius: 30,
	},
	btnDefault: {
		height: hp('6%'),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 25,
		backgroundColor: '#cc1e06'
	},
	lottie: {
	    width: 100,
	    height: 100
	},
	close: {
		position: 'absolute',
		right: 0,
		margin: 15,
		zIndex: 1,
		width: wp('8%')
	}
})

ModalLacak.propTypes = {
	onClose: PropTypes.func.isRequired,
	navigateBarcode: PropTypes.func.isRequired,
	list: PropTypes.array.isRequired,
	nomor: PropTypes.string.isRequired
	// value: PropTypes.string.isRequired
}	

export default ModalLacak;