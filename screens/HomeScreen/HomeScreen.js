import React, { useState, useEffect } from 'react';
import { View, Text, AsyncStorage, Animated, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { setLocalUser } from '../../redux/actions/auth';
import PropsTypes from 'prop-types';
import Constants from 'expo-constants';

import {
	WelcomeView,
	SliderView
} from './components';

const HomeScreen = props => {

	const [state, setState] = useState({
		animatedDone: false,
		animtedValue: new Animated.Value(0),
		mount: false,
		displayIntro: true
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
				console.log(toObje);
				console.log(Constants.deviceId);
				// console.log(toObje); 
				props.setLocalUser(toObje); //store to redux
				
				setState(state => ({
					...state,
					mount: true,
					displayIntro: false
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
				{ !state.displayIntro ? 
					<WelcomeView 
						opacity={opacity} 
						navigation={props.navigation}
						user={props.auth.localUser}
					/> : 
					<SliderView 
						opacity={opacity} 
						onDoneSlider={() => setState(state => ({
							...state,
							displayIntro: false
						}))}
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

HomeScreen.propTypes = {
	auth: PropsTypes.object.isRequired,
	setLocalUser: PropsTypes.func.isRequired
}

function mapStateToProps(state) {
	return{
		auth: state.auth
	}
}

export default connect(mapStateToProps, { setLocalUser })(HomeScreen);