import React from 'react';
import {
	View
} from 'react-native';
import { ListItem, Body, Left, Right, Text } from 'native-base';
import { Entypo, Ionicons } from '@expo/vector-icons'; 
import PropTypes from 'prop-types';

const Penerima = props => {
	const { values, error } = props;
	return(
		<ListItem 
			avatar 
			onPress={() => props.onPress('receiver')}
			disabled={props.disabled}
		>
			<Left>
				<Entypo name="location-pin" size={24} color="black" />
			</Left>
			<Body>
				<Text style={{color: error ? 'red' : 'black'}}>Ke</Text>
				<Text note numberOfLines={1}>
					{ values.kota ? `${values.kota}, ${values.kec}, ${values.kodepos}` : '-' }
				</Text>
			</Body>
			<Right style={{justifyContent: 'center'}}>
	            <Ionicons name="ios-arrow-forward" size={24} color="black" />
	        </Right>
		</ListItem>
	);
}

Penerima.propTypes = {
	onPress: PropTypes.func.isRequired,
	values: PropTypes.object.isRequired,
	error: PropTypes.bool.isRequired
}

export default Penerima;