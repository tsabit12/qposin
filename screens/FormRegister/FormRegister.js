import React from 'react';
import { View, Text } from 'react-native';
import { 
	Container, 
	Header, 
	Left, 
	Body, 
	Right, 
	Button, 
	Icon, 
	Title,
	Subtitle
} from 'native-base';
import Constants from 'expo-constants';
import {
	NonpebisolForm,
	PebisolForm 
} from './components';

const FormRegister = props => {
	const { registerType } = props.route.params;
	return(
		<Container style={{paddingTop: Constants.statusBarHeight, backgroundColor: '#ff8e1c'}}>
	        <Header 
	        	noShadow={true}
	        	androidStatusBarColor='#ff8e1c'
	        	style={{
	        		backgroundColor: '#ff8e1c'
	        	}}
	        >
	          	<Left>
	            	<Button transparent>
	              		<Icon name='arrow-back' />
	            	</Button>
	          	</Left>
	          	<Body>
	            	<Title>Registrasi</Title>
	            	<Subtitle>{registerType}</Subtitle>
	          	</Body>
		        <Right />
	        </Header>
    
	        { registerType === 'Non-pebisol' && <NonpebisolForm /> }
	        { registerType === 'Pebisol' && <PebisolForm /> }
	    </Container>
	);
}

export default FormRegister;