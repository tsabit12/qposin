import React, { useEffect, useState } from 'react';
import { 
	View, 
	Text,
	StyleSheet,
	ImageBackground,
	TouchableOpacity,
	BackHandler
} from 'react-native';
import { Icon, Text as TextNote } from 'native-base';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons, FontAwesome, AntDesign } from '@expo/vector-icons'; 
import {
	AlamatView,
	KelurahanView
} from './components';
import { CommonActions, StackActions } from '@react-navigation/native';

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}


const EditAlamatView = props => {
	const { params } = props.route;
	const [state, setState] = useState({});
	const [alamatVisible, setAlamatVisible] = useState(false);
	const [kelurahanVisible, setKelurahanVisible] = useState(false);

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
	    
	    return () => {
	      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
	    };
	}, [handleBackButtonClick, state]);

	useEffect(() => {
		if (params.newPayload) {
			setState(state => ({
				...state,
				...params.newPayload
			}))
		}else if(params){
			setState(params);
		}
	}, [params])

	const handleBackButtonClick = () => {
		if (props.navigation.isFocused()) {
			handleGoback();
		}else{
			const popAction = StackActions.pop(1);
			props.navigation.dispatch(popAction);
		}
		return true;
	}

	const handleUpdateAlamat = (value) => {
		setState(state => ({
			...state,
			alamatOl: value
		}))
		setAlamatVisible(false);
	}

	const handleUpdateKelurahan = (value) => {
		setState(state => ({
			...state,
			kelurahan: value
		}))
		setKelurahanVisible(false);
	}

	const handleGoback = () => { 
		props.navigation.dispatch(stateNavigation => {
			const routes = stateNavigation.routes.filter(r => r.name !== 'UpdateAlamat');
			const newRoutes = [];

			routes.forEach(row => {
				if (row.name === 'Profile') {
					newRoutes.push({
						key: row.key,
						name: row.name,
						params: {
							...state
						}
					})
				}else{
					newRoutes.push(row);
				}
			})
			
			return CommonActions.reset({
			    ...stateNavigation,
			    routes: newRoutes,
			    index: routes.length - 1,
			 });
		});

		// props.navigation.replace('Profile', {
		// 	...state
		// })
	}

	return(
		<View style={styles.root}>
			<ImageBackground 
				source={require('../../assets/images/background.png')} 
				style={{
					height: hp('10.5%')
				}}
			>	
				{ alamatVisible && 
					<AlamatView 
						handleClose={() => setAlamatVisible(false)}
						value={state.alamatOl}
						onUpdate={handleUpdateAlamat}
					/> }

				{ kelurahanVisible && 
					<KelurahanView 
						onUpdate={handleUpdateKelurahan}
						handleClose={() => setKelurahanVisible(false)}
						value={state.kelurahan}
					/> }

				<View style={styles.header}>
					<TouchableOpacity 
						style={styles.btn} 
						onPress={() => handleGoback()}
					>
						<Icon name='ios-arrow-back' style={{color: '#FFF', fontSize: 25, marginTop: 20}} />
					</TouchableOpacity>
					<View style={{marginTop: 20}}>
						<Text style={[styles.text, {fontSize: 17}]}>
							Profil
						</Text>
						<Text style={[styles.subtitle, {fontSize: 16}]}>
							Update alamat
						</Text>
					</View>
				</View>
			</ImageBackground>

			<View style={{flex: 1}}>
				<TouchableOpacity 
					style={styles.list}
					activeOpacity={0.5}
					onPress={() => setAlamatVisible(true)}
				>
					<View style={styles.listLeft}>
						<View style={styles.icon}>
							<FontAwesome name="street-view" size={24} color="#919191" />
						</View>
						<View style={styles.labelTitle}>
							<Text style={styles.textLabel}>Alamat Utama</Text>
							<TextNote note>
								{state.alamatOl}
							</TextNote>
						</View>
					</View>
					<MaterialCommunityIcons name="pencil" size={24} color="#b3b3b3" />
				</TouchableOpacity>
				
				<TouchableOpacity 
					style={styles.list}
					activeOpacity={0.5}
					onPress={() => setKelurahanVisible(true)}
				>
					<View style={styles.listLeft}>
						<View style={styles.icon}>
							<AntDesign name="home" size={24} color="#919191" />
						</View>
						<View style={styles.labelTitle}>
							<Text style={styles.textLabel}>Kelurahan</Text>
							<TextNote note>
								{ !state.kelurahan ? '-' : capitalize(state.kelurahan)}
							</TextNote>
						</View>
					</View>
					<MaterialCommunityIcons name="pencil" size={24} color="#b3b3b3" />
				</TouchableOpacity>

				<TouchableOpacity 
					style={styles.list}
					activeOpacity={0.5}
					onPress={() => props.navigation.navigate('Kota', {
						type: 'empty'
					})}
				>
					<View style={styles.listLeft}>
						<View style={styles.icon}>
							<AntDesign name="home" size={24} color="#919191" />
						</View>
						<View style={styles.labelTitle}>
							<Text style={styles.textLabel}>Kota & Kecamatan</Text>
							<TextNote note numberOfLines={2}>
								{capitalize(state.kota)}, {capitalize(state.kecamatan)} ({state.kodepos})
							</TextNote>
						</View>
					</View>
					<View style={styles.rightIcon}>
						<Icon name='ios-arrow-forward' style={{color: '#b3b3b3', fontSize: 25}} />
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1
	},
	header: {
		height: hp('10.5%'),
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
	textBlack: {
		fontFamily: 'Nunito-Bold'		
	},
	subtitle: {
		fontFamily: 'Nunito',
		color: '#FFF'
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
		width: wp('88%'),
	},
	icon: {
		width: wp('8%'),
		// backgroundColor: 'red',
		justifyContent: 'center',
	},
	textLabel: {
		color: 'black', 
		fontSize: 15
	},
	rightIcon: {
		justifyContent: 'center',
		flex: 1,
		alignItems: 'center'
	},
	labelTitle: {
		marginLeft: 8, 
		width: wp('75%')
	}
})

EditAlamatView.propTypes = {
	user: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	return{
		user: state.auth.session
	}
}

export default connect(mapStateToProps, null)(EditAlamatView);