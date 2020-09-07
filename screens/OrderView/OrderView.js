import React, { useState, useEffect } from 'react';
import { 
	View, 
	Text, 
	ImageBackground, 
	StyleSheet,
	TouchableOpacity,
	TextInput,
	ScrollView,
	StatusBar
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
	ListTarif
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
		disabled: false
	})

	const { data, errors } = state;

	const { params } = props.route;
	console.log(params);

	const handlePress = (type) => {
		props.navigation.navigate('Kota', {
			type,
			fromRoute: 'order' 
		});
	} 

	const senderValues = {
		kec: props.order.kecamatanA,
		kota: props.order.kotaA,
		kodepos: props.order.kodeposA
	};

	const receiverValue = {
		kec: props.order.kecamatanB,
		kota: props.order.kotaB,
		kodepos: props.order.kodeposB
	};

	useEffect(() => {
		if (props.order.kecamatanA) {
			setState(state => ({ 
				...state,
				errors:{
					...state.errors,
					pengirim: undefined
				}
			}))
		}else if(props.order.kecamatanB){
			setState(state => ({ 
				...state,
				errors:{
					...state.errors,
					penerima: undefined
				}
			}))
		}
	}, [props.order]);

	useEffect(() => {
		if (state.listTarif.length > 0) {
			setState(state => ({
				...state,
				disabled: true
			}))
		}
	}, [state.listTarif])

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

			const panjangVal = data.panjang ? data.panjang : '0';
			const lebarVal = data.lebar ? data.lebar : '0';
			const tinggiVal = data.tinggi ? data.tinggi : '0';
			const param1 = `#1#${data.jenis}#${values.kodeposA}#${values.kodeposB}#${data.berat}#${panjangVal}#${lebarVal}#${tinggiVal}#0#${data.nilai}`;

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
		if (!props.order.kecamatanA) errors.pengirim = 'Alamat pengirim belum dipilih';
		if (!props.order.kecamatanB) errors.penerima = 'Alamat penerima belum dipilih';
		if (!data.nilai) errors.nilai = 'Nilai barang belum diisi';
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
				kec: props.order.kecamatanA,
				kota: props.order.kotaA,
				kodepos: props.order.kodeposA	
			},
			penerima: {
				kec: props.order.kecamatanB,
				kota: props.order.kotaB,
				kodepos: props.order.kodeposB
			}
		}

		props.navigation.navigate('DataPenerima', {
			data: payload
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
			<View style={{flex: 1, backgroundColor: '#f5f7f6'}}>
				<ScrollView>
					<React.Fragment>
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
							/>
							<Berat 
								value={data.berat}
								onPress={handleSaveBerat}
								error={!!errors.berat}
								disabled={state.disabled}
							/>
							<Cod 
								value={data.isCod}
								onSimpan={(val) => setState(state => ({
									...state,
									data: {
										...state.data,
										isCod: val
									}
								}))}
								disabled={state.disabled}
							/>
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
								error={!!errors.nilai}
								disabled={state.disabled}
							/>
						</List>
						<View style={{alignItems: 'center'}}>
				            <View style={styles.group}>
				            	<View style={styles.field}>
				            		<Text style={styles.text}>Panjang</Text>
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
				            		<Text style={styles.text}>Lebar</Text>
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
				            		<Text style={styles.text}>Tinggi</Text>
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
		            </React.Fragment>

		            { state.listTarif.length > 0 && 
		            	<ListTarif 
		            		data={state.listTarif} 
		            		onChoose={handleChooseTarif}
		            	/> }
	            </ScrollView>
			</View>
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
		elevation: 3
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
	}
})

OrderView.propTypes = {
	order: PropTypes.object.isRequired,
	resetOrder: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	return{
		order: state.order
	}
}

export default connect(mapStateToProps, { resetOrder })(OrderView);