import React, { useRef, useState, useEffect } from 'react';
import md5 from "react-native-md5";
import {
	View,
	Text,
	StyleSheet,
	ImageBackground,
	StatusBar,
	TouchableOpacity
} from 'react-native';
import PinView from 'react-native-pin-view';
import { Icon } from 'native-base';
import AnimatedLoader from "react-native-animated-loader";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Constants from 'expo-constants';
import api from '../../api';
import { setLoggedIn } from '../../redux/actions/auth';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import CustomToast from '../CustomToast';

const LoginView = props => {
	const refPinView = useRef();
	const [pin, setPin] = useState('');
	const [showRemoveButton, setShowRemoveButton] = useState(false);
	const [loading, setLoading] = useState(false);
	const [openToast, setOpenToast] = useState({
		text: '',
		open: false
	})

	useEffect(() => {
		if (pin.length > 0) {
			setShowRemoveButton(true);
	    }else{
	      	setShowRemoveButton(false);
	    }

	    if (pin.length === 6) {
	    	handleLogin(pin);
	    }
	}, [pin]);

	const handleLogin = (pinValue) => {
		setLoading(true);

		const { userid, nohp, email } = props.localUser;
		const pinMd5 	= md5.hex_md5(userid+pinValue+nohp+email+Constants.deviceId+'8b321770897ac2d5bfc26965d9bf64a1');
		
		const payload 	= `${userid}|${pinMd5}|${nohp}|${email}|${Constants.deviceId}`;

		api.login(payload, userid)
			.then(res => {
				console.log(res);
				if (res.rc_mess === '00') {
					const { response_data1, response_data4, response_data5 } = res;
					const x 	= response_data4.split('|');
					const x2 	= response_data1.split('|'); 

					const session = {
						nama: x2[0],
						email: x2[1],
						nohp: x2[2],
						norek: x2[3],
						saldo: response_data5,
						namaOl: x[0],
						jenisOl: x[1],
						alamatOl: x[2],
						provinsi: x[3],
						kota: x[4],
						kecamatan: x[5],
						kelurahan: x[6],
						kodepos: x[7],
						nopend: res.response_data3,
						pin: pinValue
					};

					props.setLoggedIn(session);
					setLoading(false);
					refPinView.current.clearAll();

				}else{
		            setOpenToast({ text: res.desk_mess, open: true })
		            setLoading(false);
		            refPinView.current.clearAll();
				}
			})
			.catch(err => {
				setLoading(false);
	            setOpenToast({ text: err.global, open: true })
	            refPinView.current.clearAll();
			});
	} 

	return(
		<ImageBackground
			source={require('../../assets/images/background.png')} 
			style={styles.root}
		>
			<AnimatedLoader
		        visible={loading}
		        overlayColor="rgba(0,0,0,0.6)"
		        source={require("../../assets/images/loader/3098.json")}
		        animationStyle={styles.lottie}
		        speed={1}
		    />
		    { loading && <StatusBar backgroundColor="rgba(0,0,0,0.6)"/>}
			<PinView
				ref={refPinView}
	            onValueChange={value => setPin(value)}
	            pinLength={6}
	            buttonSize={75}
	            inputSize={32}
	            buttonAreaStyle={{
	              marginTop: 24,
	            }}
	            inputAreaStyle={{
	              marginBottom: 24,
	            }}
	            inputViewEmptyStyle={{
	              backgroundColor: "transparent",
	              borderWidth: 1,
	              borderColor: "#FFF",
	            }}
	            inputViewFilledStyle={{
	              backgroundColor: "#FFF",
	            }}
	            buttonViewStyle={{
	              backgroundColor: "#FFF",
	              margin: 6
	            }}
	            buttonTextStyle={{
	              color: "black"
	            }}
	            onButtonPress={key => {
	              if (key === "custom_left") {
	                refPinView.current.clear()
	              }
	            }}
	            customLeftButton={showRemoveButton ? 
	            	<Icon name={"ios-backspace"} 
	            		style={{
	            			fontSize: 40,
	            			color: 'white'
	            		}}
	            	/> : undefined}
	        />
	        <TouchableOpacity
	        	style={styles.button}
	        	activeOpacity={0.7}
	        	onPress={() => props.navigation.navigate('Restore', {
	        		type: 1
	        	})}
	        >
	        	<Text style={styles.text}>Lupa PIN</Text>
	        </TouchableOpacity>

	        <CustomToast 
	        	open={openToast.open}
	        	message={openToast.text}
	        	onClose={() => setOpenToast({message: '', open: false})}
	        />
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	lottie: {
	    width: 100,
	    height: 100
	},
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF'
	},
	button: {
		//backgroundColor: 'white',
		height: hp('5%'),
		justifyContent: 'center',
		padding: 5,
		marginTop: 25,
		borderWidth: 1,
		borderColor: '#FFF',
		borderRadius: 30,
		width: wp('70%'),
		alignItems: 'center'
	}
})

LoginView.propTypes = {
	localUser: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	return{
		localUser: state.auth.localUser
	}
}

export default connect(mapStateToProps, { setLoggedIn })(LoginView);