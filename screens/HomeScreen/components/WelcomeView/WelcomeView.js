import React, { useState, useEffect } from 'react';
import { 
	StyleSheet, 
	View, 
	Image, 
	Dimensions, 
	ImageBackground,
	TouchableOpacity,
	TextInput,
	Animated,
	Keyboard,
	KeyboardAvoidingView,
	ScrollView
} from 'react-native';
import rgba from 'hex-to-rgba';
import Hr from "react-native-hr-component";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Text } from 'native-base';
import Constants from 'expo-constants';
import {
	BarcodeView,
	TracksView
} from './components';
import api from '../../../../api';
import AnimatedLoader from "react-native-animated-loader";
import { Toast } from 'native-base';
import PropTypes from 'prop-types';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = props => {
	const [state, setState] = useState({
		hasPermission: null,
		activePage: 'welcome',
		noresi: '',
		loading: false,
		tracks: []
	})
	
	const { activePage } = state;
	const { user } = props;

	const searchBarcode = (resiValue) => {
		if (resiValue.length === 0) {
			alert('Nomor resi belum diisi');
		}else{
			setState(state => ({
				...state,
				loading: true
			}))

			api.lacakKiriman(resiValue)
				.then(tracks => {
					setState(state => ({
						...state,
						loading: false,
						tracks
					}))
				})
				.catch(err => {
					setState(state => ({
						...state,
						loading: false
					}))

					Toast.show({
		                text: "Kiriman tidak ditemukan",
		                duration: 3000,
		                textStyle: { color: "#FFF", textAlign: 'center' }
		            })
				})
		}
	}

	const handleSearchBarcode = (barcode) => {
		setState(state => ({
			...state,
			activePage: 'welcome'
		}))

		searchBarcode(barcode);
	}

	const handleNavigate = () => {
		if (Object.keys(user).length === 0) {
			props.navigation.navigate('FormRegister');
		}else{
			props.navigation.navigate('Login');
		}
	}

	if (activePage === 'welcome') {
		return(
			<Animated.View style={[props.opacity, {position: 'absolute',
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
				flex: 1
			}]}>
				<ImageBackground 
					source={require('../../../../assets/images/background.png')} 
					style={styles.root}
				>	
					 <AnimatedLoader
				        visible={state.loading}
				        overlayColor="rgba(0,0,0,0.6)"
				        source={require("../../../../assets/images/loader/3098.json")}
				        animationStyle={styles.lottie}
				        speed={1}
				    />
				    { state.tracks.length > 0 && 
				    	<TracksView 
				    		data={state.tracks} 
				    		noresi={state.noresi} 
				    		onClose={() => setState(state => ({
				    			...state,
				    			tracks: [],
				    			noresi: ''
				    		}))}
				    	/> }
					<KeyboardAvoidingView behavior='padding' enabled={false} style={{flex: 1}}>
						<ScrollView showsVerticalScrollIndicator={false}>
							<View style={{alignItems: 'center', marginTop: 20}}>
								<Image 
							      	source={require('../../../../assets/images/logo2.png')}
							      	style={{
							      		width: wp('40%'), 
							      		height: hp('20%')
							      	}}
							      	resizeMode='contain'
							    />
						    </View>
							<View 
								style={{
									alignItems: 'center', 
									height: hp('15%'),
									flex: 1,
									padding: 10,
									justifyContent: 'center'
								}}
							>
							    
						    	<Text style={styles.text}>Halo, Selamat datang</Text>
					    		<TouchableOpacity 
					    			style={[styles.btnrounded, {backgroundColor: '#ffac30', marginTop: 10}]} 
					    			activeOpacity={0.9}
					    			onPress={handleNavigate}
					    		>
						            <Text style={styles.textBtn}>
						            	{Object.keys(user).length === 0 ? 'Registrasi sekarang' : 'Masuk sebagai pengguna'} 
						            </Text>
						        </TouchableOpacity>
						    </View>
							    <View style={styles.container}>
						        	<Text style={[styles.subText, {marginBottom: 10}]}>Cek kiriman kamu disini</Text>
						        	<TextInput
								      style={[styles.input, {marginBottom: 10}]}
								      onChangeText={text => setState(state => ({
								      	...state,
								      	noresi: text
								      }))}
								      onSubmitEditing={() => searchBarcode(state.noresi)}
								      value={state.noresi}
								      placeholderTextColor={rgba('#FFF', 0.6)}
								      placeholder='Masukan nomor resi'
								      textAlign='center'
								      returnKeyType='search'
								      returnKeyLabel='search'
								    />
								    <Hr 
								    	lineColor={rgba('#FFF', 0.7)} 
								    	width={1} 
								    	textPadding={10} 
								    	text="atau" 
								    	textStyles={styles.hr} 
								    	hrPadding={10}
								    />

								    <TouchableOpacity 
								    	style={[styles.btnrounded, {
								    		marginTop: 10, 
								    		borderColor: rgba('#FFF', 0.7), 
								    		borderWidth: 1
								    	}]} 
								    	activeOpacity={0.6}
								    	onPress={() => setState(state => ({
								    		...state,
								    		activePage: 'barcode'
								    	}))}
								    >
							            <Text style={styles.textBtn}>Scan barcode</Text>
							        </TouchableOpacity>
						    	</View>
						    	<View 
						    		style={{
						    			height: hp('20%'),
						    			justifyContent: 'center',
						    			width: wp('100%'),
						    			alignItems: 'center',
						    			flex: 1
						    		}}
						    	>
									<Text 
										style={{
											textAlign: 'center', 
											fontFamily: 'Nunito-Bold', 
											color: rgba('#FFF', 0.8),
											fontSize: 14
										}}
									>
										Butuh Bantuan? <Text style={[styles.text, {fontSize: 14}]}>Hubungi Contact Center 161</Text>
									</Text>
								</View>
						</ScrollView>
					</KeyboardAvoidingView>
				</ImageBackground>
			</Animated.View>
		)
	}else{
		return(
			<Animated.View style={[props.opacity, {position: 'absolute',
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
				flex: 1
			}]}>
			<BarcodeView 
				onClose={() => setState(state => ({
					...state,
					activePage: 'welcome'
				}))}
				onSearch={handleSearchBarcode}
			/>
			</Animated.View>
		)
	}
}

const styles = StyleSheet.create({
	root: {
		paddingTop: Constants.statusBarHeight, 
		backgroundColor: '#ff8e1c',
		flex: 1,
		alignItems: 'center',
		// justifyContent: 'space-around'
	},
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF'
	},
	textBtn: {
		fontFamily: 'Nunito-Bold',
		color: rgba('#FFF', 0.7)
	},
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		height: hp('30%'),
		width: wp('100%'),
		padding: 25,
		marginTop: 10

	},
	btnrounded: {
		padding: 10,
		borderRadius: 25,
		width: wp('90%'),
		height: hp('6%'),
		justifyContent: 'center',
		alignItems: 'center'
	},
	subText: {
		color: '#FFF',
		fontSize: 14
	},
	input: {
		width: wp('90%'),
		height: hp('6%'),
		borderColor: '#FFF',
		borderWidth: 0.3,
		borderRadius: 25,
		padding: 10,
		color: '#FFF'
	},
	hr: {
		color: rgba('#FFF', 0.7)
	},
	lottie: {
	    width: 100,
	    height: 100
	}
})

WelcomeScreen.propTypes = {
	user: PropTypes.object.isRequired
}

export default WelcomeScreen;