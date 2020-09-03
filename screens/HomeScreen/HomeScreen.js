import React, { useState, useEffect } from 'react';
import { View, Text, AsyncStorage, Animated, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
// import MaskedView from '@react-native-community/masked-view';

import {
	PinView,
	SliderView
} from './components';

const HomeScreen = props => {

	const [state, setState] = useState({
		animatedDone: false,
		animtedValue: new Animated.Value(0),
		mount: false,
		localUser: {}
	})

	//we are using redux 
	//it will be confused to get data from storage in all component
	//of this app
	//so i'll move data from storage to redux here
	useEffect(() => {
		(async () => {
			const value = await AsyncStorage.getItem("qobUserPrivasi");
			if (value !== null) { //detect user was register
				const toObje  = JSON.parse(value);
				setState(state => ({
					...state,
					mount: true,
					localUser: toObje
				}))
			}else{
				setState(state => ({
					...state,
					mount: true
				}))
			}
		})()
	}, []);

	//start animated
	useEffect(() => {
		if (state.mount) {
			Animated.timing(state.animtedValue, {
	            toValue: 150,
	            duration: 1000,
	            delay: 400,
	            useNativeDriver: true,
	        }).start(() => {
	          setState(state => ({
	            ...state,
	            animatedDone: true
	          }))
	        })
		}
	}, [state.mount]);

	const imageScale = {
      transform: [
        {
          scale: state.animtedValue.interpolate({
            inputRange: [0, 15, 100],
            outputRange: [0.1, 0.06, 16]
          })
        }
      ]
    }

    const opacity = {
      opacity: state.animtedValue.interpolate({
        inputRange: [0, 25, 50],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp'
      })
    }

	return(
		<View style={{flex: 1}}>
			<View style={[StyleSheet.absoluteFill, {backgroundColor: 'white'}]} />
			<View style={styles.centered}>
			<Animated.Image 
	            source={require('../../assets/images/posindo.png')}
	            style={[{ width: 500, height: 500}, imageScale ]}
	        />  
				{ Object.keys(state.localUser).length > 0 ? 
					<PinView onDone={() => props.navigation.navigate('Welcome')} /> : 
					<SliderView 
						opacity={opacity} 
						onDoneSlider={() => props.navigation.navigate('Welcome')}
					/> }
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	centered: {
		justifyContent: 'center',
		flex: 1,
		alignItems: 'center'
	}
})

function mapStateToProps(state) {
	return{
		isLoggedIn: state.auth.logged
	}
}

export default connect(mapStateToProps, null)(HomeScreen);