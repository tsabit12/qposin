import React, { useState, useEffect } from 'react';
import { 
	View, 
	ImageBackground, 
	StyleSheet,
	Text,
	TouchableOpacity,
	Image,
	ScrollView,
	BackHandler,
	AsyncStorage
} from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Icon, Thumbnail, Text as TextNote, Toast } from 'native-base';
import { connect } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import {
	EmailView,
	NamaView
} from './components';
import { updateProfil } from '../../redux/actions/auth';
import AnimatedLoader from "react-native-animated-loader";

const numberWithCommas = (number) => {
	if (isNaN(number)) {
		return number; 
	}else{
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
}

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}


const numberPhone = (number) => {
	return number.toString().replace(/\B(?=(\d{4})+(?!\d))/g, "-");
}


const ProfileView = props => {
	const { user, userid } = props;	
	const [state, setState] = useState({});
	const [emailVisible, setEmailVisible] = useState(false);
	const [namaVisible, setNamaVisible] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
	    
	    return () => {
	      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
	    };
	}, [handleBackButtonClick, state]);

	//if email is update then must reset storage
	useEffect(() => {
		if (Object.keys(user).length > 0) {
			setState(user)
		}
	}, [user])

	const handleUpdateEmail = (value) => {
		setState(state => ({
			...state,
			email: value
		}));

		setEmailVisible(false);
	}

	const handleUpdateNama = (value) => {
		setState(state => ({
			...state,
			nama: value
		}));

		setNamaVisible(false);
	}

	const handleBackButtonClick = () => {
		const update = shouldUpdateProfile(props.user);
		if (update) {
			setLoading(true);
			const param1 = `${props.userid}|${state.alamatOl}|${state.provinsi}|${state.kota}|${state.kecamatan}|${state.kelurahan}|${state.kodepos}|${state.nama}|${state.email}`;
			
			props.updateProfil(param1, state)
				.then(async () => {
					const newLocaluser = {
						...props.local,
						email: state.email
					};

					props.navigation.goBack();
					// try{
					// 	await AsyncStorage.setItem('qobUserPrivasi', JSON.stringify(newLocaluser));
					// }catch(error){
					// 	props.navigation.goBack();
					// 	Toast.show({
			  //               text: 'Fail',
			  //               textStyle: { textAlign: 'center' },
			  //               duration: 1000
			  //           })
					// }
				})
				.catch(err => {
					props.navigation.goBack();
					// setLoading(false);
					if (err.global) {
						Toast.show({
			                text: err.global,
			                textStyle: { textAlign: 'center' },
			                duration: 1000
			            })
					}else{
						Toast.show({
			                text: 'Gagal update profil',
			                textStyle: { textAlign: 'center' },
			                duration: 1000
			            })
					}
				})

		}else{
			props.navigation.goBack();
		}
		return true;
	}

	const shouldUpdateProfile = (defaultValue) => {
		if (defaultValue.email !== state.email) return true;
		if (defaultValue.nama !== state.nama) return true;
		return false;
	}

	return(
		<ImageBackground 
			source={require('../../assets/images/background.png')} 
			style={{flex: 1}}
		>	
			<AnimatedLoader
		        visible={loading}
		        overlayColor="rgba(0,0,0,0.6)"
		        source={require("../../assets/images/loader/3098.json")}
		        animationStyle={styles.lottie}
		        speed={1}
		    />

			{ emailVisible && 
				<EmailView 
					handleClose={() => setEmailVisible(false)} 
					values={state.email}
					onUpdate={handleUpdateEmail}
				/> }

			{ namaVisible && 
				<NamaView 
					handleClose={() => setNamaVisible(false)} 
					values={state.nama}
					onUpdate={handleUpdateNama}
				/> }
			<View style={styles.header}>
				<TouchableOpacity 
					style={styles.btn} 
					onPress={() => props.navigation.goBack()}
				>
					<Icon name='ios-arrow-back' style={{color: '#FFF', fontSize: 25, marginTop: 20}} />
				</TouchableOpacity>
				<Text style={[styles.text, {marginTop: 20, fontSize: 17}]}>
					Informasi Akun
				</Text>
			</View>
			<ScrollView style={{backgroundColor: '#FFF'}}>
				<View style={{flex: 1, backgroundColor: '#f5f7f6'}}>
					<View style={styles.highlight}>
						<View style={styles.thumbnail}>
							<Thumbnail 
								large 
								source={require('../../assets/images/icon/profile.png')} 
							/>
						</View>
						<View style={{height: hp('8%'), alignItems: 'center'}}>
							<Text style={[styles.text, {color: 'black', fontSize: 17}]}>{capitalize(user.nama.replace(/ .*/,''))}</Text>
							<Text>
								User ID:  {userid}
							</Text>
						</View>
						<TouchableOpacity 
							style={styles.button}
							activeOpacity={0.7}
							disabled={user.norek !== '-' ? true : false}
							onPress={() => props.navigation.navigate('ConnectGiro')}
						>
							<Text style={styles.text}>
								{ user.norek === '-' ? 'Hubungkan dengan Akun Giro' : `Rp ${numberWithCommas(user.saldo)}` }
							</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.info}>
						<View style={styles.label}>
							<Text style={[styles.text, {fontSize: 15, color: 'black'}]}>Informasi Akun</Text>
						</View>
						
						<View style={styles.list}>
							<View style={styles.listLeft}>
								<View style={styles.icon}>
									<Image 
										source={require('../../assets/images/icon/pebisol.png')}
										style={{
											height: hp('4%'),
											width: wp('6%')
										}}
									/>
								</View>
								<View style={{marginLeft: 8}}>
									<Text style={[styles.text, {color: '#ffa200', fontSize: 16.9}]}>Apakah anda pebisnis online</Text>
									<Text style={[styles.text, {color: '#ffa200', fontSize: 14}]}>
										{ userid.substring(0, 3) === '440' ? 'Ya' : 'Bukan'}
									</Text>
								</View>
							</View>
							
						</View>

						<TouchableOpacity 
							style={styles.list}
							onPress={() => setNamaVisible(true)}
							activeOpacity={0.5}
						>
							<View style={styles.listLeft}>
								<View style={styles.icon}>
									<Icon name='md-person' style={{color: '#919191', fontSize: 30}} />
								</View>
								<View style={{marginLeft: 8}}>
									<Text style={styles.textLabel}>Nama Lengkap</Text>
									<TextNote note>
										{capitalize(state.nama)}
									</TextNote>
								</View>
							</View>
							<MaterialCommunityIcons name="pencil" size={24} color="#b3b3b3" />
						</TouchableOpacity>

						<View style={styles.list}>
							<View style={styles.listLeft}>
								<View style={styles.icon}>
									<Icon name='ios-call' style={{color: '#919191', fontSize: 30}} />
								</View>
								<View style={{marginLeft: 8}}>
									<Text style={styles.textLabel}>Nomor Handphone</Text>
									<TextNote note>
										{numberPhone(user.nohp)}
									</TextNote>
								</View>
							</View>
						</View>

						<TouchableOpacity 
							style={styles.list}
							onPress={() => setEmailVisible(true)}
							activeOpacity={0.5}
						>
							<View style={styles.listLeft}>
								<View style={styles.icon}>
									<Icon name='ios-mail' style={{color: '#919191', fontSize: 30}} />
								</View>
								<View style={{marginLeft: 8}}>
									<Text style={styles.textLabel}>Email</Text>
									<TextNote note>
										{state.email}
									</TextNote>
								</View>
							</View>
							<MaterialCommunityIcons name="pencil" size={24} color="#b3b3b3" />
						</TouchableOpacity>

						<TouchableOpacity 
							style={styles.list}
							activeOpacity={0.5}
							//onPress={() => props.navigation.navigate('UpdateAlamat')}
						>
							<View style={styles.listLeft}>
								<View style={styles.icon}>
									<Icon name='ios-home' style={{color: '#919191', fontSize: 30}} />
								</View>
								<View style={{marginLeft: 8}}>
									<Text style={styles.textLabel}>Alamat</Text>
									<TextNote note numberOfLines={1}>
										{ user.kota !== '-' ? `${capitalize(user.kota)}, ${capitalize(user.kecamatan)} (${user.kodepos})` : '-'}
									</TextNote>
								</View>
							</View>
							{/*<View style={styles.rightIcon}>
								<MaterialCommunityIcons name="pencil" size={24} color="#b3b3b3" />
							</View> */}
						</TouchableOpacity>

						<TouchableOpacity 
							style={styles.list}
							onPress={() => props.navigation.navigate('Ubahpin')}
							activeOpacity={0.5}
						>
							<View style={styles.listLeft}>
								<View style={styles.icon}>
									<Icon name='ios-lock' style={{color: '#919191', fontSize: 30}} />
								</View>
								<View style={{marginLeft: 8}}>
									<Text style={styles.textLabel}>PIN</Text>
									<TextNote note>
										******
									</TextNote>
								</View>
							</View>
							<View style={styles.rightIcon}>
								<Icon name='ios-arrow-forward' style={{color: '#b3b3b3', fontSize: 25}} />
							</View>
						</TouchableOpacity>
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
	highlight: {
		backgroundColor: 'white',
		height: hp('30.3%'),
		alignItems: 'center'
	},
	thumbnail: {
		alignItems: 'center',
		width: wp('20%'),
		height: hp('13%'),
		marginTop: 10,
		justifyContent: 'center'
	},
	button: {
		backgroundColor: '#c91c0c',
		justifyContent: 'center',
		alignItems: 'center',
		height: hp('6.5%'),
		width: wp('70%'),
		borderRadius: 30,
		elevation: 2
	},
	info: {
		marginTop: 7,
		backgroundColor: 'white',
		// height: hp('6%'),
		flex: 1
	},
	icon: {
		width: wp('8%'),
		// backgroundColor: 'red',
		justifyContent: 'center',
	},
	label: {
		height: hp('5%'), 
		padding: 10, 
		borderBottomWidth: 0.3,
		borderColor: '#c7c9c8'
	},
	list: {
		height: hp('9%'),
		borderBottomWidth: 0.3,
		borderColor: '#c7c9c8',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 10,
		alignItems: 'center'
	},
	listLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		width: wp('88%')
	},
	textLabel: {
		color: 'black', 
		fontSize: 15
	},
	lottie: {
		height: 100,
		width: 100
	},
	rightIcon: {
		justifyContent: 'center',
		flex: 1,
		alignItems: 'center'
	}
})

function mapStateToProps(state) {
	return{
		user: state.auth.session,
		userid: state.auth.localUser.userid,
		local: state.auth.localUser
	}
}

export default connect(mapStateToProps, { updateProfil })(ProfileView);