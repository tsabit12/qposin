import React, { useState, useEffect } from 'react';
import { 
	View, 
	Text, 
	ImageBackground, 
	StyleSheet,
	TouchableOpacity,
	TextInput,
	ScrollView,
	StatusBar,
	AsyncStorage,
	Platform,
	Keyboard,
	KeyboardAvoidingView
} from 'react-native';
import { connect } from 'react-redux';
import { resetOrder } from '../../redux/actions/order';
import PropTypes from 'prop-types';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Icon, List, Toast } from 'native-base';
import {
	Pengirim,
	Penerima,
	Jenis,
	Berat,
	Cod,
	Nilai,
	ListTarif,
	UpdateMessage,
	SyncCard
} from './components';
import AnimatedLoader from "react-native-animated-loader";
import api from '../../api';

const handleConvertTarif = (res, type) => {
	const response = res.split('#');
	const toWhatIwant = [];
	response.forEach(x => {
		var values = x.split('*');
		var getId = values[0].split('-')[0];
		//last array is empty space
		if (values.length > 1) {
			toWhatIwant.push({
				id: getId,
				name: values[0],
				refTarif: values[1]
			})
		}
	});

	//let filterVal 	= [];
	if (type === 2) {
		const filterVal = ['210','240','EC2','EC1','1Q9','2Q9','447','401','417'];
		const filters 	= toWhatIwant.filter(x => filterVal.includes(x.id));
		return filters;
	}else{
		const filterVal = ['EC2'];
		const filters 	= toWhatIwant.filter(x => filterVal.includes(x.id));
		return filters;
	}
}

const OrderView = props => {
	const [state, setState] = useState({
		data: {
			jenis: '-',
			isikiriman: '',
			berat: '',
			panjang: '',
			lebar: '',
			tinggi: '',
			isCod: '0',
			nilai: ''
		},
		errors: {},
		loading: false,
		listTarif: [],
		disabled: false,
		mount: false,
		shouldCod: false
	})

	const [visibleSync, setVisibleSync] = useState(false);

	const [senderValues, setSender] = useState({
		kec: '',
		kota: '',
		kodepos: ''
	});

	const [receiverValue, setReceiver] = useState({
		kec: '',
		kota: '',
		kodepos: ''
	})

	const [shouldUpdateAddres, setShouldUpdateAddres] = useState(false);
	const [isKeyboardVisible, setKeyboardVisible] = useState({
		open: false,
		height: 0
	});

	const { data, errors } = state;

	const { params } = props.route;
	const { session, order, local }  = props;

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

	const handlePress = (type) => {
		props.navigation.navigate('Kota', {
			type,
			fromRoute: 'order' 
		});
	} 

	useEffect(() => {
		if (state.mount) {
			if (order.kecamatanA && order.kecamatanB) {
				setSender(sender => ({
					kec: order.kecamatanA,
					kota: order.kotaA,
					kodepos: order.kodeposA
				}));
				setReceiver(sender => ({
					kec: order.kecamatanB,
					kota: order.kotaB,
					kodepos: order.kodeposB
				}))
				setState(state => ({ 
					...state,
					errors:{
						...state.errors,
						penerima: undefined,
						pengirim: undefined
					}
				}))
			}else{
				if (order.kecamatanA) {
					setSender(sender => ({
						kec: order.kecamatanA,
						kota: order.kotaA,
						kodepos: order.kodeposA
					}));
					setState(state => ({ 
						...state,
						errors:{
							...state.errors,
							pengirim: undefined
						}
					}))
				}else if(order.kecamatanB){
					setReceiver(sender => ({
						kec: order.kecamatanB,
						kota: order.kotaB,
						kodepos: order.kodeposB
					}))
					setState(state => ({ 
						...state,
						errors:{
							...state.errors,
							penerima: undefined
						}
					}))
				}else{
					if (session.kecamatan === undefined) {
						setShouldUpdateAddres(true);
					}else{
						if (session.kecamatan !== '-') {
							setSender({
								kec: session.kecamatan,
								kota: session.kota,
								kodepos: session.kodepos
							})
						}else{
							setShouldUpdateAddres(true);
						}
					}
				}
			}
		}
	}, [order, state.mount, session])

	useEffect(() => {
		(async () => {
			if (session.norek !== '-') {
				const value = await AsyncStorage.getItem('isCodBaru'); //define user was syncronize 
				if (value === null) {
					setVisibleSync(true);
					setState(state => ({
						...state,
						mount: true
					}))
				}else{
					setState(state => ({
						...state,
						loading: true
					}))

					api.searchRekeningType(session.norek)
						.then(responseRek => {
							const sisaSaldo = parseInt(responseRek[2]);
							if (sisaSaldo < 10000) {
								setState(state => ({
									...state,
									loading: false,
									mount: true
								}));
								Toast.show({
							        text: 'Untuk menggunakan layanan COD saldo minimal 10 ribu',
							        textStyle: { textAlign: 'center' },
							        duration: 3000
							    })
							}else{
								setState(state => ({
									...state,
									loading: false,
									mount: true,
									shouldCod: true
								}))
							}
						})
						.catch(err => {
							console.log(err);
							setState(state => ({
								...state,
								loading: false,
								mount: true
							}))
						})

				}
			}else{
				setState(state => ({
					...state,
					mount: true
				}))
			}

		})();
	}, [session.norek]);

	useEffect(() => {
		if (state.listTarif.length > 0 && state.mount) {
			setState(state => ({
				...state,
				disabled: true
			}))
		}
	}, [state.listTarif, state.mount])


	const handleSaveBerat = (berat) => {
		setState(state => ({
			...state,
			data: {
				...state.data,
				berat
			},
			errors: {
				...state.errors,
				berat: undefined
			}
		}))
	}

	const handleChange = (value, name) => setState(state => ({
		...state,
		data: {
			...state.data,
			[name]: value
		}
	}))

	const searchTarif = () => {
		const errors = validate(state.data);
		setState(state => ({
			...state,
			errors
		}))

		if (Object.keys(errors).length === 0) {
			const { order : values } = props;
			setState(state => ({
				...state,
				loading: true
			}))	

			const nilaiValue = data.nilai ? data.nilai : '0';
			const panjangVal = data.panjang ? data.panjang : '0';
			const lebarVal = data.lebar ? data.lebar : '0';
			const tinggiVal = data.tinggi ? data.tinggi : '0';
			const param1 = `#1#${data.jenis}#${senderValues.kodepos}#${receiverValue.kodepos}#${data.berat}#${panjangVal}#${lebarVal}#${tinggiVal}#0#${nilaiValue}`;

			api.getTarif(param1)
				.then(res => {
					const convertedTarif = handleConvertTarif(res, params.type);
					if (convertedTarif.length > 0) {
						setState(state => ({
							...state,
							loading: false,
							listTarif: convertedTarif
						}))	
					}else{
						Toast.show({
			                text: 'Tarif tidak ditemukan',
			                textStyle: { textAlign: 'center' },
			                duration: 4000
			            })

			            setState(state => ({
							...state,
							loading: false,
						}))	
					}
				})
				.catch(err => {
					console.log(err);
					setState(state => ({
						...state,
						loading: false
					}))	
					if (err.global) {
						Toast.show({
			                text: err.global,
			                textStyle: { textAlign: 'center' },
			                duration: 4000
			            })
					}else{
						Toast.show({
			                text: 'Request gagal',
			                textStyle: { textAlign: 'center' },
			                duration: 4000
			            })
					}
				})
			// const payload =
		}
	}

	const validate = (field) => {
		const errors = {};
		if (field.jenis === '-') errors.jenis = 'Kiriman belum diisi';
		if (!field.berat){
			errors.berat = 'Berat belum diisi';
		}else{
			if (Number(field.berat) <= 0)  errors.berat = "Harus lebih dari 0";
		}
		if (!senderValues.kec) errors.pengirim = 'Alamat pengirim belum dipilih';
		if (!receiverValue.kec) errors.penerima = 'Alamat penerima belum dipilih';
		if (data.isCod !== '0') {
			if (!data.nilai){
				errors.nilai = 'Nilai barang belum diisi';
			}else if(Number(data.nilai) < 10000){
				errors.nilai = 'Nilai barang minimal 10.000';
			} 
		}
		return errors;
	}

	const handleReset = () => {
		props.resetOrder();
		setTimeout(function() {
			setState(state => ({
				...state,
				data: {
					jenis: '-',
					isikiriman: '',
					berat: '',
					panjang: '',
					lebar: '',
					tinggi: '',
					isCod: '0',
					nilai: ''
				},
				listTarif: [],
				disabled: false
			}))
		}, 10);
	}

	const handleChooseTarif = (payloadTarif) => {
		const payload = {
			payloadTarif,
			...state.data,
			pengirim: {
				kec: senderValues.kec,
				kota: senderValues.kota,
				kodepos: senderValues.kodepos
			},
			penerima: {
				kec: receiverValue.kec,
				kota: receiverValue.kota,
				kodepos: receiverValue.kodepos
			}
		}

		props.navigation.navigate('DataPenerima', {
			data: payload
		})
	}

	const handleCloseUpdate = () => {
		setShouldUpdateAddres(false);

		setTimeout(function() {
			props.navigation.goBack();
		}, 10);
	}

	const handleSubmitUpdate = () => {
		setShouldUpdateAddres(false);

		setTimeout(function() {
			props.navigation.replace('Profile');
		}, 10);
	}

	const validateRekening = () => {
		setState(state => ({
			...state,
			loading: true
		}));

		api.searchRekeningType(session.norek)
			.then(responseRek => {
				const sisaSaldo = parseInt(responseRek[2]);
				if (sisaSaldo < 10000) {
					setState(state => ({
						...state,
						loading: false
					}));

					Toast.show({
				        text: 'Untuk menggunakan layanan COD saldo minimal 10 ribu',
				        textStyle: { textAlign: 'center' },
				        duration: 3000
				    })
				}else{
					setState(state => ({
						...state,
						loading: false,
						shouldCod: true
					}))
				}
			})
			.catch(err => {
				Toast.show({
			        text: `Terdapat kesalahan! ${err.global}`,
			        textStyle: { textAlign: 'center' },
			        duration: 3000
			    })
				setState(state => ({
					...state,
					loading: false
				}))
			})
	}

	const onPressSyncCard = () => {
		setState(state => ({
			...state,
			loading: true
		}))

		api.generateToken(local.userid)
			.then(pin => {
				const payload = {
					email: props.session.email,
					pin: pin.response_data1
				}
				console.log('succes generate pin');

				api.syncronizeUserPwd(payload)
					.then(res => {
						console.log("succes sync user");
						if (res.respcode === '21' || res.respcode === '00') { //was sync and first time sync we keep send
							const payloadSyncGiro = {
								email: props.session.email,
								norek: session.norek
							}
							api.syncronizeCod(payloadSyncGiro)
								.then(async lastResponse => {
									console.log("succes sync giro web");
									setState(prevState => ({
										...prevState,
										loading: false
									}));
									setVisibleSync(false);

									try{
										await AsyncStorage.setItem('isCodBaru', JSON.stringify(true));
										validateRekening();
										console.log("succes save storage");
									}catch(err){
										console.log(err);
									}
								})
								//falied sync web giro
								.catch(err2 => {
									setState(prevState => ({
										...prevState,
										loading: false
									}))
									Toast.show({
								        text: 'Sinkronisasi gagal, silahkan cobalagi!',
								        textStyle: { textAlign: 'center' },
								        duration: 2000
								    })
								})
						}
					})
					//failed sync user
					.catch(err3 => {
						setState(prevState => ({
							...prevState,
							loading: false
						}))

						Toast.show({
					        text: 'Sinkronisasi gagal, silahkan cobalagi!',
					        textStyle: { textAlign: 'center' },
					        duration: 2000
					    })
					})
			})
			//get pin gagal
			.catch(() => {
				Toast.show({
			        text: 'Sinkronisasi gagal, silahkan cobalagi!',
			        textStyle: { textAlign: 'center' },
			        duration: 2000
			    })
			    setState(prevState => ({
					...prevState,
					loading: false
				}))
			})
	} 

	return(
		<ImageBackground 
			source={require('../../assets/images/background.png')} 
			style={{flex: 1}}
		>		
			<AnimatedLoader
		        visible={state.loading}
		        overlayColor="rgba(0,0,0,0.6)"
		        source={require("../../assets/images/loader/3098.json")}
		        animationStyle={styles.lottie}
		        speed={1}
		    />

		    { shouldUpdateAddres && 
		    	<UpdateMessage 
		    		handleClose={handleCloseUpdate} 
		    		onSubmit={handleSubmitUpdate}
		    	/> }
		    { state.loading &&  <StatusBar backgroundColor="rgba(0,0,0,0.6)"/> }

			<View style={styles.header}>
				<View style={styles.subHeader}>
					<TouchableOpacity 
						style={styles.btn} 
						onPress={() => props.navigation.goBack()}
					>
						<Icon name='ios-arrow-back' style={{color: '#FFF', fontSize: 25, marginTop: 20}} />
					</TouchableOpacity>
					<Text style={[styles.text, {marginTop: 20, fontSize: 17, color: '#FFF'}]}>
						{ params.type === 1 ? 'Kiriman E-Commerce' : 'Online Booking' }
					</Text>
				</View>
				{ state.disabled && <TouchableOpacity 
					style={styles.subHeader}
					activeOpacity={0.7}
					onPress={handleReset}
				>
					<Text style={[styles.text, {marginTop: 20, fontSize: 17, color: '#FFF'}]}>
						Reset
					</Text>
					<Icon name='md-refresh' 
						style={{
							color: '#FFF', 
							fontSize: 25, 
							marginTop: 25,
							marginLeft: 15
						}} 
					/>
				</TouchableOpacity> }
			</View>
			<KeyboardAvoidingView 
				behavior='padding' 
				style={{flex: 1}}
				enabled={Platform.OS === 'ios' ? true : false }
			>
				<View style={{flex: 1, backgroundColor: '#f5f7f6'}}>
					{ 
						state.mount && <ScrollView keyboardShouldPersistTaps={'handled'}>
							{ visibleSync && <SyncCard onPress={onPressSyncCard} />}
								<List>
									<Pengirim 
										onPress={handlePress} 
										values={senderValues}
										error={!!errors.pengirim}
										disabled={state.disabled}
									/>
									<Penerima 
										onPress={handlePress} 
										values={receiverValue}
										disabled={state.disabled}
										error={!!errors.penerima}
									/>
									<Jenis 
										onPress={(payload) => setState(state => ({
											...state,
											data: {
												...state.data,
												...payload
											},
											errors: {
												...state.errors,
												jenis: undefined
											}
										}))}
										values={data.jenis}
										isi={data.isikiriman}
										error={!!errors.jenis}
										disabled={state.disabled}
										isKeyboardVisible={isKeyboardVisible}
									/>
									<Berat 
										value={data.berat}
										onPress={handleSaveBerat}
										error={!!errors.berat}
										disabled={state.disabled}
										isKeyboardVisible={isKeyboardVisible}
									/>

									{ state.shouldCod &&  <Cod 
										value={data.isCod}
										onSimpan={(val) => setState(state => ({
											...state,
											data: {
												...state.data,
												isCod: val
											}
										}))}
										disabled={state.disabled}
									/> }

									<Nilai 
										value={data.nilai}
										onPress={(value) => setState(state => ({
											...state,
											data: {
												...state.data,
												nilai: value
											},
											errors: {
												...state.errors,
												nilai: undefined
											}
										}))}
										error={errors.nilai}
										disabled={state.disabled}
										cod={data.isCod}
										isKeyboardVisible={isKeyboardVisible}
									/>
								</List>
								<View style={{alignItems: 'center'}}>
									<View style={styles.group}>
										<View style={styles.field}>
											<Text style={styles.textInput}>Panjang</Text>
											<TextInput 
												style={styles.input}
												placeholder='cm'
												textAlign='center'
												value={data.panjang}
												onChangeText={(text) => handleChange(text, 'panjang')}
												keyboardType='number-pad'
												editable={!state.disabled}
											/>
										</View>
										<View style={styles.field}>
											<Text style={styles.textInput}>Lebar</Text>
											<TextInput 
												style={styles.input}
												placeholder='cm'
												textAlign='center'
												value={data.lebar}
												onChangeText={(text) => handleChange(text, 'lebar')}
												keyboardType='number-pad'
												editable={!state.disabled}
											/>
										</View>
										<View style={styles.field}>
											<Text style={styles.textInput}>Tinggi</Text>
											<TextInput 
												style={styles.input}
												placeholder='cm'
												textAlign='center'
												value={data.tinggi}
												onChangeText={(text) => handleChange(text, 'tinggi')}
												keyboardType='number-pad'
												editable={!state.disabled}
											/>
										</View>
									</View>
									{ !state.disabled && <TouchableOpacity 
										style={styles.button} 
										activeOpacity={0.7} 
										onPress={searchTarif}
									>
										<Text style={[styles.text, {color: '#FFF'}]}>Cek Tarif</Text>
									</TouchableOpacity>}
								</View>

								{ state.listTarif.length > 0 && 
									<ListTarif 
										data={state.listTarif} 
										onChoose={handleChooseTarif}
									/> }
						</ScrollView>
					}
				</View>
			</KeyboardAvoidingView>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	header: {
		height: hp('10%'),
		flexDirection: 'row',
		// backgroundColor: 'white',
		// alignItems: 'center',
		marginLeft: 20,
		marginRight: 20,
		justifyContent: 'space-between'
	},
	subHeader: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		fontFamily: 'Nunito-Bold'
	},
	btn: {
		width: wp('7%'),
	},
	searchView: {
		height: hp('13%'),
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center'
	},
	group: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: hp('11%'),
		width: wp('80%'),
		marginTop: 5
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
	lottie: {
	    width: 100,
	    height: 100
	},
	textInput: {
		fontFamily: 'Nunito-semi',
		fontSize: 15
	}
})

OrderView.propTypes = {
	order: PropTypes.object.isRequired,
	resetOrder: PropTypes.func.isRequired,
	local: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	return{
		order: state.order,
		session: state.auth.session,
		local: state.auth.localUser
	}
}

export default connect(mapStateToProps, { resetOrder })(OrderView);