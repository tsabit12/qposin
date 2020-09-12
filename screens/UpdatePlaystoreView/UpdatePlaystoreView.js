import React, { useState, useEffect } from 'react';
import { 
	View, 
	Text,
	Animated,
	StyleSheet,
	ImageBackground,
	TouchableOpacity
} from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import * as Linking from 'expo-linking';

const UpdatePlaystoreView = props => {
	const [animatedValue] = useState(new Animated.Value(0));

	useEffect(() => {
		Animated.timing(animatedValue, {
            toValue: 150,
            duration: 1000,
            delay: 400,
            useNativeDriver: true,
        }).start()
	}, []);

	const imageScale = {
      transform: [
        {
          scale: animatedValue.interpolate({
            inputRange: [0, 15, 100],
            outputRange: [0.1, 0.06, 16]
          })
        }
      ]
    }

    const opacity = {
      opacity: animatedValue.interpolate({
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
	        <Animated.View style={[opacity, styles.content]}>
	        	<ImageBackground 
					source={require('../../assets/images/background.png')} 
					style={styles.root}
				>	
					<View style={styles.main}>
						<View style={{height: hp('35%')}}>
		        			<Text style={styles.title}>
		        				VERSI BARU TELAH HADIR {'\n'}(V 0.2.4)
		        			</Text>
		        			<View style={styles.list}>
			        			<Text style={styles.subTitle}>
			        				Versi yang kamu install membutuhkan pembaharuan. Silahkan update aplikasi ke versi terbaru
			        			</Text>
			        			<Text style={[styles.subTitle, {marginTop: 8}]}>
			        				Apa yang baru?
			        			</Text>
			        			<View style={styles.point}>
			        				<Text style={[styles.subTitle]}>1. Penambahan fitur notifikasi</Text>
			        				<Text style={[styles.subTitle]}>2. Pencarian history kirman berdasarkan kota/isi kiriman</Text>
			        				<Text style={[styles.subTitle]}>3. Penambahan fitur tracking pickup</Text>
			        				<Text style={[styles.subTitle]}>4. Perbaikan bug di versi sebelumnya</Text>
			        				<Text style={[styles.subTitle]}>5. Dan lainnya</Text>
			        			</View>
		        			</View>
	        			</View>
	        			<TouchableOpacity 
	        				style={styles.btn}
	        				activeOpacity={0.8}
	        				onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.posindonesia.cob')}
	        			>
	        				<Text style={{fontFamily: 'Nunito-Bold'}}>UPDATE</Text>
	        			</TouchableOpacity>
	        		</View>
				</ImageBackground>
	        </Animated.View>
	        </View>
	    </View>
	);
}

const styles = StyleSheet.create({
	centered: {
		justifyContent: 'center',
		flex: 1,
		alignItems: 'center'
	},
	content: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	},
	root: {
		flex: 1,
		justifyContent: 'center',
		//alignItems: 'center'
	},
	title: {
		color: '#FFF',
		fontFamily: 'Nunito-Bold',
		textAlign: 'center',
		fontSize: 20
	},
	main: {
		marginTop: 30,
		alignItems: 'center'
	},
	list: {
		// width: wp('80%'),
		//backgroundColor: '#FFF',
		// height: hp('50%'),
		marginLeft: 10,
		marginTop: 5
	},
	subTitle: {
		fontFamily: 'Nunito',
		color: '#FFF'
	},
	point: {
		marginLeft: 10,
		marginTop: 5
	},
	btn: {
		backgroundColor: 'white',
		width: wp('70%'),
		alignItems: 'center',
		height: hp('6.5%'),
		justifyContent: 'center',
		borderRadius: 30
	}
})

export default UpdatePlaystoreView;