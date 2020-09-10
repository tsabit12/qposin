import React, { useEffect, useState } from 'react';
import { 
	View, 
	Text, 
	StyleSheet, 
	ImageBackground, 
	TouchableOpacity,
	TextInput,
	ScrollView,
	StatusBar
} from 'react-native';
import PropTypes from 'prop-types';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import Constants from 'expo-constants';
import { Icon, List, ListItem } from 'native-base';
import { Entypo, Ionicons } from '@expo/vector-icons'; 
import api from '../../api';
import {
	ListKecamatan
} from './components';
import { connect } from 'react-redux';
import { setOrder } from '../../redux/actions/order';

import { CommonActions } from '@react-navigation/native';

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}

const dynamicSort = (property) => {
	var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

import dataKota from '../../refkota.json';

const KotaView = props => {
	const { params } = props.route;
	const [state, setState] = useState({
		kota: [],
		allKota: [],
		active: 1,
		kotaValue: ''
	})

	const { kota, active } = state;

	useEffect(() => {
		setTimeout(function() {
			// dataKota.sort(dynamicSort("kota"));
			setState(state => ({
				...state,
				kota: dataKota,
				allKota: dataKota
			}))
		}, 10);
	}, []);

	useEffect(() => {
		if (state.allKota.length > 0) {
			
			const time = setTimeout(function() {
				const kota = state.allKota.filter(val => val.kota.toLowerCase().indexOf(state.kotaValue.toLowerCase()) > -1);
				setState(state => ({
					...state,
					kota
				}))
			}, 10);

			return () => clearTimeout(time);
		}
	}, [state.kotaValue, state.allKota])

	const list 		= [];
	let grouping 	= ''; 

	if (kota.length > 0) {
		for(var key = 0; key < kota.length; key++){
			let item = kota[key];
			let firstWord = item.kota.substr(0, 1);
			if (grouping !== firstWord) {
				grouping = firstWord;
				list.push(
					<React.Fragment key={key}>
			            <ListItem itemDivider>
			              <Text>{firstWord}</Text>
			            </ListItem>                    
			            <ListItem onPress={() => handlePress(item.kota)}>
			              <Text>{capitalize(item.kota)}</Text>
			            </ListItem>
			        </React.Fragment>
				);
			}else{
				list.push(
					<ListItem onPress={() => handlePress(item.kota)} key={key}>
		              <Text>{capitalize(item.kota)}</Text>
		            </ListItem>
				)
			}
		}	
	}else{
		if (state.kotaValue) {
			list.push(
				<Text key={0} style={{textAlign: 'center'}}>Tidak ditemukan hasil untuk "{state.kotaValue}"</Text>
			)
		}else{
			list.push(
				<Text key={0} style={{textAlign: 'center'}}>Loading...</Text>
			)
		}
	}

	const handlePress = (value) => {
		setState(state => ({
			...state,
			active: 2,
			kotaValue: value
		}))
	}


	const handleChooseKec = (choosedKec) => {
		const payload = {};

		if (params.type === 'empty') {
			payload.kodepos = choosedKec.kodepos;
			payload.kecamatan = capitalize(choosedKec.KEC);
			payload.kota = capitalize(state.kotaValue);

			props.navigation.dispatch(state => {
			  	const routes = state.routes.filter(r => r.name !== 'Kota');
			  	const newRoutes = []
				routes.forEach(row => {
					if (row.name === 'UpdateAlamat') {
						newRoutes.push({
							key: row.key,
							name: row.name,
							params: {
								...row.params,
								newPayload: {
									...payload
								}
							}
						})
					}else{
						newRoutes.push(row);
					}
				})

				return CommonActions.reset({
					...state,
					routes: newRoutes,
					index: routes.length - 1,
				});
			});
		}else{
			if (params.type === 'sender') {
				payload.kodeposA = choosedKec.kodepos;
				payload.kecamatanA = capitalize(choosedKec.KEC);
				payload.kotaA = capitalize(state.kotaValue);
			}else{
				payload.kodeposB = choosedKec.kodepos;
				payload.kecamatanB = capitalize(choosedKec.KEC);
				payload.kotaB = capitalize(state.kotaValue);
			}

			props.setOrder(payload);

			props.navigation.dispatch(state => {
			  const routes = state.routes.filter(r => r.name !== 'Kota');
			  return CommonActions.reset({
			    ...state,
			    routes,
			    index: routes.length - 1,
			  });
			});
		}
	}

	const handelChangeText = (value) => {
		setState({
			...state,
			kotaValue: value
		})
	}

	return(
		<ImageBackground 
			source={require('../../assets/images/background.png')} 
			style={{flex: 1}}
		>	
			<View style={styles.header}>
				<TouchableOpacity 
					style={styles.btn} 
					onPress={() => props.navigation.goBack()}
				>
					<Icon name='ios-arrow-back' style={{color: '#FFF', fontSize: 25, marginTop: 20}} />
				</TouchableOpacity>
				<Text style={[styles.text, {marginTop: 20, fontSize: 17}]}>
					{ params.type === 'empty' && 'Cari kota' }
					{ params.type === 'sender' && 'Cari kota pengirim'}
					{ params.type === 'receiver' && 'Cari kota penerima'}
				</Text>
			</View>
			<View style={{flex: 1, backgroundColor: '#f5f7f6'}}>
				<View style={styles.searchView}>
					<View style={styles.inputSearch}>
						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<View style={{width: wp('7%')}}>
								<Entypo name="location-pin" size={24} color="black" />
							</View>
							<TextInput 
								placeholder='Cari kota disini'
								style={styles.input}
								value={state.kotaValue}
								onChangeText={(text) => handelChangeText(text)}
							/>
						</View>
						<TouchableOpacity style={styles.iconSearch} disabled>
							<Ionicons name="ios-search" size={27} color="black" />
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.listKota}>
					<ScrollView>
						{ active === 1 ? <List>
				            {list}
				        </List> : 
				        <ListKecamatan 
				        	kota={state.kotaValue} 
				        	callApi={(value) => api.getKecamatan(value)} 
				        	onChoose={handleChooseKec}
				        />}
			        </ScrollView>
				</View>
			</View>
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
	searchView: {
		height: hp('13%'),
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center'
	},
	input: {
		width: wp('70%'),
		height: hp('7%')
	},
	inputSearch: {
		backgroundColor: 'white',
		width: wp('90%'),
		height: hp('7%'),
		elevation: 5,
		borderRadius: 30,
		paddingLeft: 10,
		paddingRight: 10,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	iconSearch: {
		//backgroundColor: 'red', 
		justifyContent: 'center', 
		alignItems: 'center', 
		width: wp('7%')
	},
	listKota: {
		backgroundColor: 'white',
		flex: 1,
		marginTop: 10
	},
	lottie: {
	    width: 100,
	    height: 100
	}
})

KotaView.propTypes = {
	setOrder: PropTypes.func.isRequired
}

export default connect(null, { setOrder })(KotaView);