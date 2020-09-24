import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	Animated,
	StyleSheet,
} from 'react-native';

const ListQ9 = props => {
	const [bounceValue] = useState(new Animated.Value(460));

	useEffect(() => {
		Animated.spring(bounceValue, {
			toValue: 0,
			useNativeDriver: true,
			friction: 8,
			delay: 100
		}).start();
	}, []);

	return(
		<Animated.View 
			style={[
				{transform: [{translateX: bounceValue }]}
			]}>
			<Text>Hey there</Text>
		</Animated.View>
	);
}

export default ListQ9;