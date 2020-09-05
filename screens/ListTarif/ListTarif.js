import React from 'react';
import { 
	View, 
	ImageBackground, 
	StyleSheet,
	Text,
	TouchableOpacity
} from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Icon, List, ListItem, Left, Right, Body, Text as TextNote } from 'native-base';
import { AntDesign } from '@expo/vector-icons'; 

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const ListTarif = props => {
	const { data } = props.route.params;

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
					Tarif
				</Text>
			</View>
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<List>
					{ data.map((x, index) => {
						const parsing = x.split('*');
						let produk = parsing[0];
						if (x.length > 0) {
							const tarif = x.split('|');
							let totalTarif = Math.floor(tarif[4]);
							return(
								<ListItem avatar key={index}>
					              <Left>
					                <AntDesign name="checkcircleo" size={24} color="black" />
					              </Left>
					              <Body>
					                <Text style={[styles.text, {color: 'black'}]}>{`Rp. ${numberWithCommas(totalTarif)}`}</Text>
					                <TextNote note>
					                	{produk}
					                </TextNote>
					              </Body>
					              <Right>
					                
					              </Right>
					            </ListItem>
							);
						}
					})}
		        </List>
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
	item: {
		backgroundColor: 'white',
		elevation: 3,
		width: wp('96%'),
		height: hp('10%'),
		borderRadius: 25
	}
})

export default ListTarif;