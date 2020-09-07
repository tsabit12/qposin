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
import AnimatedLoader from "react-native-animated-loader";
import {
	ListKecamatan
} from './components';
import { connect } from 'react-redux';
import { setOrder } from '../../redux/actions/order';

import { CommonActions } from '@react-navigation/native';

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
		loading: true,
		active: 1,
		kotaValue: ''
	})

	const { kota, loading, active } = state;

	useEffect(() => {
		setTimeout(function() {
			dataKota.sort(dynamicSort("kota"));
			setState(state => ({
				...state,
				kota: dataKota,
				allKota: dataKota,
				loading: false
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
			}, 70);

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
			              <Text>{item.kota}</Text>
			            </ListItem>
			        </React.Fragment>
				);
			}else{
				list.push(
					<ListItem onPress={() => handlePress(item.kota)} key={key}>
		              <Text>{item.kota}</Text>
		            </ListItem>
				)
			}
		}	
	}

	const handlePress = (value) => {
		setState(state => ({
			...state,
			//loading: true,
			active: 2,
			kotaValue: value
		}))
	}


	const handleChooseKec = (choosedKec) => {
		const payload = {};

		if (params.type === 'sender') {
			payload.kodeposA = choosedKec.kodepos;
			payload.kecamatanA = choosedKec.KEC;
			payload.kotaA = state.kotaValue;
		}else{
			payload.kodeposB = choosedKec.kodepos;
			payload.kecamatanB = choosedKec.KEC;
			payload.kotaB = state.kotaValue;
		}

		props.setOrder(payload);

		if (params.fromRoute === 'order') {
			props.navigation.dispatch(state => {
			  const routes = state.routes.filter(r => r.name !== 'Kota');
			  return CommonActions.reset({
			    ...state,
			    routes,
			    index: routes.length - 1,
			  });
			});
		}else{
			props.navigation.dispatch(
			  CommonActions.reset({
			    index: 0,
			    routes: [
			      {
			        name: 'Home'
			      },
			    ],
			  })
			);
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
			<AnimatedLoader
		        visible={loading}
		        overlayColor="rgba(0,0,0,0.6)"
		        source={require("../../assets/images/loader/3098.json")}
		        animationStyle={styles.lottie}
		        speed={1}
		    />
		    { loading &&  <StatusBar backgroundColor="rgba(0,0,0,0.6)"/> }
			<View style={styles.header}>
				<TouchableOpacity 
					style={styles.btn} 
					onPress={() => props.navigation.goBack()}
				>
					<Icon name='ios-arrow-back' style={{color: '#FFF', fontSize: 25, marginTop: 20}} />
				</TouchableOpacity>
				<Text style={[styles.text, {marginTop: 20, fontSize: 17}]}>
					Cari kota {params.type === 'sender' ? 'pengirim' : 'penerima'}
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
								placeholder={params.type === 'sender' ? 'Cari kota kamu disini' : 'Cari kota penerima disini'}
								style={styles.input}
								value={state.kotaValue}
								onChangeText={(text) => handelChangeText(text)}
							/>
						</View>
						<TouchableOpacity style={styles.iconSearch}>
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