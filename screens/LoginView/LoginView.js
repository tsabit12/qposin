import React, { useRef, useState, useEffect } from 'react';
import md5 from "react-native-md5";
import {
	View,
	Text,
	StyleSheet,
	ImageBackground,
	StatusBar
} from 'react-native';
import PinView from 'react-native-pin-view';
import { Icon } from 'native-base';
import AnimatedLoader from "react-native-animated-loader";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Constants from 'expo-constants';
import api from '../../api';
import { Toast } from 'native-base';
import { setLoggedIn } from '../../redux/actions/auth';

const LoginView = props => {
	const refPinView = useRef();
	const [pin, setPin] = useState('');
	const [showRemoveButton, setShowRemoveButton] = useState(false);
	const [loading, setLoading] = useState(false);

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
					Toast.show({
		                text: res.desk_mess,
		                textStyle: { textAlign: 'center' },
		                duration: 3000
		            })
		            setLoading(false);
		            refPinView.current.clearAll();
				}
			})
			.catch(err => {
				setLoading(false);
				Toast.show({
	              text: err.global,
	              duration: 3000,
	              textStyle: { textAlign: "center", fontSize: 14 }
	            });
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