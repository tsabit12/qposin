import React from 'react';
import { View, TextInput, StyleSheet, Text as TextDefault, TouchableOpacity } from 'react-native';
import { ListItem, Text, Left, Body, Right, Switch, List, Thumbnail } from 'native-base';
import { Entypo, FontAwesome, Feather } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen'; 

const FormTarif = props => {
	return(
		<View>
			<List>
	            <ListItem avatar onPress={() => alert('presed')} activeOpacity={0.6}>
	              <Left>
	                <Entypo name="location-pin" size={24} color="black" />
	              </Left>
	              <Body>
	                <Text>Dari</Text>
	                <Text note>Jakarta</Text>
	              </Body>
	              <Right style={{justifyContent: 'center'}}>
	                <Ionicons name="ios-arrow-forward" size={24} color="black" />
	              </Right>
	            </ListItem>
	            <ListItem avatar>
	              <Left>
	                <Entypo name="location-pin" size={24} color="black" />
	              </Left>
	              <Body>
	                <Text>Ke</Text>
	                <Text note>Mando</Text>
	              </Body>
	              <Right style={{justifyContent: 'center'}}>
	                <Ionicons name="ios-arrow-forward" size={24} color="black" />
	              </Right>
	            </ListItem>
	            <ListItem avatar>
	              <Left>
	                <Feather name="box" size={23} color="black" />
	              </Left>
	              <Body>
	                <Text>Isi kiriman</Text>
	                <Text note>Pakaian</Text>
	              </Body>
	              <Right style={{justifyContent: 'center'}}>
	                <Ionicons name="ios-arrow-forward" size={24} color="black" />
	              </Right>
	            </ListItem>

	            <ListItem avatar>
	              <Left>
	                <FontAwesome name="balance-scale" size={20} color="black" />
	              </Left>
	              <Body>
	                <Text>Berat</Text>
	                <Text note>1 kg</Text>
	              </Body>
	              <Right style={{justifyContent: 'center'}}>
	                <Ionicons name="ios-arrow-forward" size={24} color="black" />
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
			            	/>
		            	</View>
		            	<View style={styles.field}>
		            		<TextDefault style={styles.text}>Lebar</TextDefault>
			            	<TextInput 
			            		style={styles.input}
			            		placeholder='cm'
			            		textAlign='center'
			            	/>
		            	</View>
		            	<View style={styles.field}>
		            		<TextDefault style={styles.text}>Tinggi</TextDefault>
			            	<TextInput 
			            		style={styles.input}
			            		placeholder='cm'
			            		textAlign='center'
			            	/>
		            	</View>
		            </View>
		            <TouchableOpacity style={styles.button} activeOpacity={0.7}>
		            	<TextDefault style={[styles.text, {color: '#FFF'}]}>Cek Tarif</TextDefault>
		            </TouchableOpacity>
	            </View>
          	</List>
		</View>
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
		elevation: 3
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
	}
})

export default FormTarif;