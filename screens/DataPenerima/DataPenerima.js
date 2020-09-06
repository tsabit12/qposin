import React, { useState } from 'react';
import { 
	View, 
	Text, 
	ImageBackground,
	StyleSheet,
	TouchableOpacity,
	TextInput
} from 'react-native';
import { Icon } from 'native-base';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const DataPenerima = props => {
	const [ state, setState ] = useState({
		data: {
			nama: '',
			email: '',
			phone: ''
		}
	})

	const { data } = state;

	const handleChange = (text, name) => setState(state => ({
		...state,
		data: {
			...state.data,
			[name]: text
		}
	}))

	return(
		<ImageBackground 
			source={require('../../assets/images/background.png')} 
			style={styles.root}
		>		
			<View style={styles.header}>
				<TouchableOpacity 
					style={styles.btn} 
					onPress={() => props.navigation.goBack()}
				>
					<Icon name='ios-arrow-back' style={{color: '#FFF', fontSize: 25, marginTop: 20}} />
				</TouchableOpacity>
				<Text style={[styles.text, {marginTop: 20, fontSize: 17}]}>
					Penerima
				</Text>
			</View>
			<View style={{flex: 1, backgroundColor: '#FFF', alignItems: 'center'}}>
				<View style={styles.form}>
					<View style={styles.field}>
						<Text style={styles.label}>Nama</Text>
						<TextInput 
							style={styles.input}
							value={data.nama}
							placeholder='Masukkan nama penerima'
							onChangeText={(text) => handleChange(text, 'nama')}
						/>
					</View>

					<View style={styles.field}>
						<Text style={styles.label}>Email</Text>
						<TextInput 
							style={styles.input}
							placeholder='Masukkan email penerima'
							value={data.email}
							onChangeText={(text) => handleChange(text, 'email')}
						/>
					</View>

					<View style={styles.field}>
						<Text style={styles.label}>Nomor handphone</Text>
						<TextInput 
							style={styles.input}
							placeholder='Masukkan nomor handphone penerima'
							value={data.phone}
							onChangeText={(text) => handleChange(text, 'phone')}
						/>
					</View>
					<TouchableOpacity 
						style={styles.button}
						activeOpacity={0.7}
					>
						<Text style={styles.text}>Order</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1
	},
	header: {
		height: hp('10%'),
		flexDirection: 'row',
		// backgroundColor: 'white',
		alignItems: 'center',
		marginLeft: 20
	},
	btn: {
		width: wp('7%'),
	},
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF'
	},
	form: {
		width: wp('92%'),
		//backgroundColor: 'green',
		height: hp('10%'),
		marginTop: 10
	},
	input: {
		borderRadius: 30,
		//backgroundColor: 'red',
		height: hp('6.6%'),
		borderWidth: 0.3,
		paddingLeft: 10
	},
	field: {
		height: hp('12%'),
		justifyContent: 'space-around',
	},
	label: {
		marginLeft: 8,
		fontFamily: 'Nunito-Bold'
	},
	button: {
		backgroundColor: '#c73504',
		height: hp('6.6%'),
		borderRadius: 30,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20
	}
})

export default DataPenerima;