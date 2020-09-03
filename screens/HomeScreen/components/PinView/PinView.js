import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'native-base';


const PinView = props => {
	return(
		<View>
			<Text>Pin View</Text>
			<Button onPress={props.onDone}>
				<Text>Goo</Text>
			</Button>
		</View>
	);
}

export default PinView;