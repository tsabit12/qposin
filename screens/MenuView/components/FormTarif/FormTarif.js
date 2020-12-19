import React, { useState, useEffect } from 'react';
import { 
	View, 
	TextInput, 
	StyleSheet, 
	Text as TextDefault, 
	TouchableOpacity,
	Modal,
	Platform,
	Keyboard
} from 'react-native';
import { ListItem, Text, Left, Body, Right, Switch, List, Thumbnail } from 'native-base';
import { Entypo, FontAwesome, Feather } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen'; 
import PropTypes from 'prop-types';
import {
	PilihJenis,
	EntriBerat
} from './components';

const FormTarif = props => {
	const { values } = props;
	const [state, setState] = useState({
		data: {
			panjang: '',
			lebar: '',
			tinggi: '',
			berat: '100',
			jenis: '1'
		},
		loading: false,
		showJenis: false,
		showBerat: false
	})
	const [isKeyboardVisible, setKeyboardVisible] = useState({
		open: false,
		height: 0
	});

	const { data, showJenis, showBerat } = state;

	useEffect(() => {
		if(Platform.OS === 'ios'){
			const keyboardDidShowListener = Keyboard.addListener(
				'keyboardDidShow',
			(e) => {
				setKeyboardVisible({
					open: true,
					height: e.endCoordinates.height
				}); // or some other action
			}
			);
			const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',
				() => {
					setKeyboardVisible(prevState => ({
						...prevState,
						open: false
					}))
				}
			);
	
			return () => {
				keyboardDidHideListener.remove();
				keyboardDidShowListener.remove();
			};
		}
	}, []);
  
	const handlePressItem = (type) => {
		props.navigate('Kota', {
			type
		});
	}

	const handleChange = (value, name) => {
		setState(state => ({
			...state,
			data: {
				...state.data,
				[name]: value
			}
		}))
	}

	const onSubmit = () => {
		if (!values.kotaA) {
			alert('Kota pengirim belum diisi');
		}else if(!values.kotaB){
			alert('Kota penerima belum diisi');
		}else{
			const panjangVal = data.panjang ? data.panjang : '0';
			const lebarVal = data.lebar ? data.lebar : '0';
			const tinggiVal = data.tinggi ? data.tinggi : '0';
			const param1 = `#1#${data.jenis}#${values.kodeposA}#${values.kodeposB}#${data.berat}#${panjangVal}#${lebarVal}#${tinggiVal}#0#0`;
			props.onSubmit(param1);
		}
	}

	const handlePressBerat = () => {
		setState(state => ({
			...state,
			showBerat: true
		}))
	}

	const handlePressJenis = () => {
		setState(state => ({
			...state,
			showJenis: true
		}))
	}

	const handleChoosedJenis = (value) => {
		setState(state => ({
			...state,
			data: {
				...state.data,
				jenis: value
			},
			showJenis: false
		}))
	}

	return(
		<React.Fragment>
			{ showJenis && 
				<PilihJenis  
					handleClose={() => setState(state => ({
						...state,
						showJenis: false
					}))}
					onChoosed={handleChoosedJenis}
				/> }

			{ showBerat && 
				<EntriBerat 
					handleClose={() => setState(state => ({
						...state,
						showBerat: false
					}))}
					onChoosed={(value) => setState(state => ({
						...state,
						data: {
							...state.data,
							berat: value
						},
						showBerat: false
					}))}
					isKeyboardVisible={isKeyboardVisible}
				/> }
			<List>
	            <ListItem avatar onPress={() => handlePressItem('sender')}>
	              <Left>
	                <Entypo name="location-pin" size={20} color="black" />
	              </Left>
	              <Body>
	                <Text style={styles.label}>Dari</Text>
	                <Text note numberOfLines={1}>
	                	{ values.kotaA ? `${values.kotaA}, ${values.kecamatanA}, ${values.kodeposA}` : '-' }
	                </Text>
	              </Body>
	              <Right style={{justifyContent: 'center'}}>
				  	<Ionicons name="ios-arrow-forward" size={18} color="black" />
	              </Right>
	            </ListItem>
	            <ListItem avatar onPress={() => handlePressItem('receiver')}>
	              <Left>
	                <Entypo name="location-pin" size={20} color="black" />
	              </Left>
	              <Body>
				  <Text style={styles.label}>Ke</Text>
	                <Text note numberOfLines={1}>
	                	{ values.kotaB ? `${values.kotaB}, ${values.kecamatanB}, ${values.kodeposB}` : '-' }
	                </Text>
	              </Body>
	              <Right style={{justifyContent: 'center'}}>
				  	<Ionicons name="ios-arrow-forward" size={18} color="black" />
	              </Right>
	            </ListItem>


	            <ListItem avatar onPress={handlePressJenis}>
	              <Left>
	                <Feather name="box" size={20} color="black" />
	              </Left>
	              <Body>
				  	<Text style={styles.label}>Jenis Kiriman</Text>
	                <Text note style={{fontSize: 14}}>{data.jenis === '1' ? 'Paket' : 'Surat'}</Text>
	              </Body>
	              <Right style={{justifyContent: 'center'}}>
				  	<Ionicons name="ios-arrow-forward" size={18} color="black" />
	              </Right>
	            </ListItem>


	            <ListItem avatar onPress={handlePressBerat}>
	              <Left>
	                <FontAwesome name="balance-scale" size={17} color="black" />
	              </Left>
	              <Body>
				  	<Text style={styles.label}>Berat</Text>
	                <Text note style={{fontSize: 14}}>{data.berat} gram</Text>
	              </Body>
	              <Right style={{justifyContent: 'center'}}>
	                <Ionicons name="ios-arrow-forward" size={18} color="black" />
	              </Right>
	            </ListItem>
	            <View style={{alignItems: 'center'}}>
		            <View style={styles.group}>
		            	<View style={styles.field}>
		            		<TextDefault style={styles.text}>Panjang</TextDefault>
			            	<TextInput 
			            		style={styles.input}
			            		placeholder='cm'
			            		textAlign='center'
			            		value={data.panjang}
			            		onChangeText={(text) => handleChange(text, 'panjang')}
			            		keyboardType='number-pad'
			            	/>
		            	</View>
		            	<View style={styles.field}>
		            		<TextDefault style={styles.text}>Lebar</TextDefault>
			            	<TextInput 
			            		style={styles.input}
			            		placeholder='cm'
			            		textAlign='center'
			            		value={data.lebar}
			            		keyboardType='number-pad'
			            		onChangeText={(text) => handleChange(text, 'lebar')}
			            	/>
		            	</View>
		            	<View style={styles.field}>
		            		<TextDefault style={styles.text}>Tinggi</TextDefault>
			            	<TextInput 
			            		style={styles.input}
			            		placeholder='cm'
			            		textAlign='center'
			            		value={data.tinggi}
			            		keyboardType='number-pad'
			            		onChangeText={(text) => handleChange(text, 'tinggi')}
			            	/>
		            	</View>
		            </View>
		            <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={onSubmit}>
		            	<TextDefault style={[styles.text, {color: '#FFF'}]}>Cek Tarif</TextDefault>
		            </TouchableOpacity>
	            </View>
          	</List>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	group: {
		flexDirection: 'row',
		// backgroundColor: 'green',
		justifyContent: 'space-between',
		height: hp('11%'),
		width: wp('80%'),
		marginTop: 5
	},
	input: {
		height: hp('5.9%'),
		// borderWidth: 0.3,
		borderRadius: 30,
		backgroundColor: 'white',
		elevation: 3,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 0.2 },
		shadowOpacity: 0.3,
		shadowRadius: 1
	},
	field: {
		flex: 1,
		margin: 5,
		justifyContent: 'space-around',
		height: hp('10%'),
		//backgroundColor: 'yellow'
	},
	text: {
		fontFamily: 'Nunito-Bold'
	},
	button: {
		backgroundColor: '#e0162b',
		width: wp('80%'),
		justifyContent: 'center',
		alignItems: 'center',
		height: hp('5.9%'),
		borderRadius: 30,
		marginTop: 10
	},
	label: {
		fontSize: 14,
		fontFamily: 'Nunito-semi'
	}
})

FormTarif.propTypes = {
	navigate: PropTypes.func.isRequired,
	values: PropTypes.object.isRequired,
	onSubmit: PropTypes.func.isRequired
}

export default FormTarif;