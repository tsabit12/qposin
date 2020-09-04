import React from 'react';
import { StyleSheet, View, Text, Animated, ImageBackground, Image, Dimensions } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import PropTypes from 'prop-types';
import Constants from 'expo-constants';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');


const slides = [{
    key: '1',
    title: 'QPOSin AJA adalah',
    text:'Aplikasi resmi PT Pos Indonesia (Persero) yang dapat digunakan oleh para pebisol maupun seluruh masyarakat untuk '+
    	 'melakukan order pengiriman surat atau paket. Dengan aplikasi ini pelanggan dapat melakukan sendiri entri data pengirimannya '+
    	 'dan melakukan permintaan penjemputan kiriman dilokasi pengiriman/pelanggan. Kiriman langsung dijemput oleh petugas pickup ' +
    	 '(Oranger & Faster) ke lokasi pengirim yang melakukan order.'
  },
  {
    key: '2',
    title: 'Dengan Qposin AJA',
    text: 'Data pengiriman serta permintaan penjemputan bisa langsung diakses dan barang kiriman akan langsung dijemput oleh petugas pickup (Oranger & Faster) ke lokasi pengirim yang melakukan order',
    icon: 'ios-information-circle-outline'
  }]


const SliderView = props => {
	const renderItem = ({ item, dimensions }) => (
	    <ImageBackground source={require('../../../../assets/images/background.png')} style={styles.mainContent}>
	      <Image 
	      	source={require('../../../../assets/images/logo2.png')}
	      	style={{
	      		width: wp('40%'), 
				height: hp('20%'),
	      		marginTop: 50
	      	}}
	      />
	      <View style={{position: 'absolute', bottom: 100, left: 5, right: 5}}>
	        <Text style={styles.title}>{item.title}</Text>
	        <Text style={styles.text}>{item.text}</Text>
	      </View>
	    </ImageBackground>
	);

	return(
		<Animated.View style={[styles.content, props.opacity]}>
			<AppIntroSlider
		        data={slides}
		        renderItem={renderItem}
		        showPrevButton
		        showSkipButton
		        onDone={props.onDoneSlider}
		        // onSkip={() => console.log("skipped")}
		    />
	    </Animated.View>
	);
}

const styles = StyleSheet.create({
	text: {
	    color: 'rgba(255, 255, 255, 0.8)',
	    backgroundColor: 'transparent',
	    textAlign: 'center',
	    paddingHorizontal: 20,
	    fontFamily: 'Nunito-Bold'
	},
	title: {
	    fontSize: 20,
	    color: 'white',
	    backgroundColor: 'transparent',
	    textAlign: 'center',
	    marginBottom: 16,
	    fontFamily: 'Nunito-Bold'
	},
	mainContent: {
		flex: 1,
		alignItems: 'center',
		paddingTop: Constants.statusBarHeight
		//justifyContent: 'space-around'
	},
	content: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		flex: 1
	}
})

SliderView.propTypes = {
	opacity: PropTypes.object.isRequired,
	onDoneSlider: PropTypes.func.isRequired
}

export default SliderView;