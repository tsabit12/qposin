import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import {
	Item,
	Icon,
	Input,
	Button,
	Text
} from 'native-base';

const PebisolForm = props => {
	return(
		<View style={styles.container}>
			<View style={{borderBottomWidth: 0.3, padding: 10, borderColor: '#b1b5b4'}}>
				<Text style={styles.title}>Hai Pebisol</Text>
				<Text style={{fontSize: 14}}>Silahkan lengkapi data anda dibawah ini</Text>
			</View>
			<KeyboardAvoidingView
				style={{flex:1}} 
				behavior="padding" 
				enabled={false}
			>
				<ScrollView>
					<View style={{marginLeft: 10, marginRight: 10, marginTop: 20}}>
			          <Item>
			            <Icon active name='home' />
			            <Input placeholder='Icon Textbox'/>
			          </Item>
			          <Item>
			            <Icon active name='home' />
			            <Input placeholder='Icon Textbox'/>
			          </Item>
			          <Item>
			            <Icon active name='home' />
			            <Input placeholder='Icon Textbox'/>
			          </Item>
			          <Item>
			            <Icon active name='home' />
			            <Input placeholder='Icon Textbox'/>
			          </Item>
			          <Item>
			            <Icon active name='home' />
			            <Input placeholder='Icon Textbox'/>
			          </Item>
			          <Item>
			            <Icon active name='home' />
			            <Input placeholder='Icon Textbox'/>
			          </Item>
			          <Item>
			            <Icon active name='home' />
			            <Input placeholder='Icon Textbox'/>
			          </Item>
			          <Item>
			            <Icon active name='home' />
			            <Input placeholder='Icon Textbox'/>
			          </Item>
			          <Item>
			            <Icon active name='home' />
			            <Input placeholder='Icon Textbox'/>
			          </Item>
			          <Button block success style={{marginTop: 10}}>
			          	<Text>DAFTAR SEKARANG</Text>
			          </Button>
			        </View>
			    </ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFF',
		flex: 1,
		marginTop: 10,
		marginLeft: 10,
		marginRight: 10,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		justifyContent: 'center'
	},
	title: {
		fontFamily: 'Nunito-Bold',
		fontSize: 20
	}
})

export default PebisolForm;