import React, { useState, useEffect } from 'react';
import { 
	StyleSheet, 
	View, 
	Image, 
	Dimensions, 
	ImageBackground,
	TouchableOpacity,
	TextInput,
	Animated,
	Keyboard,
	KeyboardAvoidingView,
	ScrollView
} from 'react-native';
import rgba from 'hex-to-rgba';
import Hr from "react-native-hr-component";
import { 
	Text
} from 'native-base';
// import rgba from 'hex-to-rgba';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = props => {
	const [isKeyboardVisible, setActiveKeyboard] = useState(false);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
	      'keyboardDidShow',
	      () => {
	        setActiveKeyboard(true);
	      }
	    );

	    const keyboardDidHideListener = Keyboard.addListener(
	      'keyboardDidHide',
	      () => {
	        setActiveKeyboard(false);
	      }
	    );

	    return () => {
	      keyboardDidHideListener.remove();
	      keyboardDidShowListener.remove();
	    };
	}, []);


	return(
		<ImageBackground 
			source={require('../../assets/images/background.png')} 
			style={styles.root}
		>	
			<KeyboardAvoidingView behavior='padding' enabled={false} style={{flex: 1}}>
				<ScrollView>
					<View style={{alignItems: 'center'}}>
						<Image 
					      	source={require('../../assets/images/logo2.png')}
					      	style={{
					      		width: width / 2.7, 
					      		height: height / 5,
					      		marginTop: 50,
					      	}}
					    />
					    <View style={{alignItems: 'center', marginTop: 20}}>
					    	<Text style={styles.text}>Halo, Selamat datang</Text>
				    		<TouchableOpacity 
				    			style={[styles.btnrounded, {marginTop: 10, backgroundColor: '#ffac30'}]} 
				    			activeOpacity={0.9}
				    		>
					            <Text style={styles.textBtn}>Registrasi sekarang</Text>
					        </TouchableOpacity>
				        </View>
				    </View>
					    <View style={styles.container}>
					        <View style={{alignItems: 'center', marginTop: 50}}>
					        	<Text style={[styles.subText, {marginBottom: 10}]}>Cek kiriman kamu disini</Text>
					        	<TextInput
							      style={[styles.input, {marginBottom: 10}]}
							      //onChangeText={text => onChangeText(text)}
							      // value={value}
							      placeholderTextColor={rgba('#FFF', 0.6)}
							      placeholder='Masukan nomor resi'
							      textAlign='center'
							      returnKeyType='search'
							      returnKeyLabel='search'
							    />
							    <Hr 
							    	lineColor={rgba('#FFF', 0.7)} 
							    	width={1} 
							    	textPadding={10} 
							    	text="atau" 
							    	textStyles={styles.hr} 
							    	hrPadding={2}
							    />

							    <TouchableOpacity 
							    	style={[styles.btnrounded, {
							    		marginTop: 10, 
							    		borderColor: rgba('#FFF', 0.7), 
							    		borderWidth: 1
							    	}]} 
							    	activeOpacity={0.6}
							    >
						            <Text style={styles.textBtn}>Scan barcode</Text>
						        </TouchableOpacity>
					        </View>
				    	</View>
				    	<View style={{marginTop: 20}}>
							<Text 
								style={{
									textAlign: 'center', 
									fontFamily: 'Nunito-Bold', 
									color: rgba('#FFF', 0.8),
									fontSize: 14
								}}
							>
								Butuh Bantuan? <Text style={[styles.text, {fontSize: 14}]}>Hubungi Contact Center 161</Text>
							</Text>
						</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</ImageBackground>
	);	
}

const styles = StyleSheet.create({
	root: {
		paddingTop: Constants.statusBarHeight, 
		backgroundColor: '#ff8e1c',
		flex: 1,
		alignItems: 'center',
		// justifyContent: 'space-around'
	},
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF'
	},
	textBtn: {
		fontFamily: 'Nunito-Bold',
		color: rgba('#FFF', 0.7)
	},
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		margin: 35,
		flex: 1
	},
	btnrounded: {
		padding: 10,
		borderRadius: 25,
		minWidth: width / 1.2,
		height: height / 19,
		justifyContent: 'center',
		alignItems: 'center'
	},
	subText: {
		color: '#FFF',
		fontSize: 14
	},
	input: {
		height: height / 19,
		width: width / 1.2,
		borderColor: '#FFF',
		borderWidth: 0.3,
		borderRadius: 25,
		padding: 10,
		color: '#FFF'
	},
	hr: {
		color: rgba('#FFF', 0.7)
	}
})

export default WelcomeScreen;