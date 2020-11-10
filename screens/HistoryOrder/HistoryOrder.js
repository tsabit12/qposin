import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ImageBackground,
	ToastAndroid,
	Animated,
	StatusBar
} from 'react-native';
import { Icon, Footer, FooterTab, Button, Content } from 'native-base';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import {
	ListQob,
	ListQ9,
	SearchForm
} from './components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getQob, onPickuped } from '../../redux/actions/history';
import AnimatedLoader from "react-native-animated-loader";

const daysInMonth = (iMonth, iYear) => {
	return 32 - new Date(iYear, iMonth, 32).getDate();
}

const HistoryOrder = props => {
	const scrollY = new Animated.Value(0);
	// const animateContent = new Animated.Value(-100);

	const [activePage, setActivepage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [offestQob, setOffsetQob] = useState(0);
	const [searchQob, setSeacrhQob] = useState(false);
	const [qobIsDone, setQobDone] = useState(false); //notif once
	const { email } = props.user;

	const diffClamp =  Animated.diffClamp(scrollY, 0, hp('10%'));
	const translateY = diffClamp.interpolate({
		inputRange: [0, hp('10%')],
		outputRange: [0, hp('-10%')],
		extrapolateLeft: 'clamp'
	})

	useEffect(() => {
		if (activePage === 1) {
			const payload = {
				email: email,
				status: "0",
				offset: 0
			}

			props.getQob(payload)
				.then(() => setOffsetQob(offestQob + 10))
				.catch(err => {
					if (err.msg) {
						setErrors({
							qob: err.msg
						})
					}else{
						setErrors({
							qob: `Oppps, terdapat kesalahan`
						})
					}
				})
		}
	}, [activePage]);

	// useEffect(() => {
	// 		Animated.spring(animateContent, {
	// 			toValue: 0,
	// 			useNativeDriver: true
	// 		}).start();
	// }, [searchQob])

	const handlePickup = (pickupNumber, extid) => props.onPickuped(pickupNumber, extid)

	const handleGetNewDataQob = () => {
		// console.log(offestQob);
		if (offestQob !== 0) {
			const payload = {
				email,
				status: "0",
				offset: offestQob
			}
		
			props.getQob(payload)
				.then(res => setOffsetQob(offestQob + 10))
				.catch(() => {
					if (!qobIsDone) {
						setQobDone(true);
						 ToastAndroid.showWithGravity(
					      "Kamu sudah melihat semua history kiriman",
					      ToastAndroid.LONG,
					      ToastAndroid.BOTTOM
					    );
					}
				})
		}
	}

	const onRefreshQob = async () => {
		const payload = {
			email,
			status: "0",
			offset: 0
		}

		try{
			await props.getQob(payload);
			setOffsetQob(10);
			return Promise.resolve('oke');
		}catch(err){
			return Promise.reject('not oke');
		}
	}

	const handleHideHeader = (yOffset) => {
		scrollY.setValue(yOffset);
	}

	// const scaleY = animateContent.interpolate({
	// 	inputRange: [0, 20, 40, 60],
 //  		outputRange: [100, 80, 60, 0]
	// })

	return(
		<View style={StyleSheet.absoluteFillObject}> 
			<AnimatedLoader
		        visible={loading}
		        overlayColor="rgba(0,0,0,0.1)"
		        source={require("../../assets/images/loader/3098.json")}
		        animationStyle={styles.lottie}
		        speed={1}
		    />
		    <StatusBar backgroundColor="#C51C16"/>
		    <Animated.View style={[styles.header, { transform: [{ translateY }]}]}>
		    	<View style={{flexDirection: 'row', marginLeft: 20,  marginTop: 20}}>
					<TouchableOpacity 
						style={styles.btn} 
						onPress={() => props.navigation.goBack()}
					>
						<Icon name='ios-arrow-back' style={{color: '#FFF', fontSize: 25}} />
					</TouchableOpacity>
					
					<Text style={[styles.text, {fontSize: 17}]}>
						History kiriman
					</Text>
				</View>
			</Animated.View>
			
			{ activePage === 1 && 
				<ListQob 
					error={errors.qob}
					list={props.qob}
					navigation={props.navigation}
					setLoading={(bool) => setLoading(bool)}
					userid={props.user.userid}
					onPickup={handlePickup}
					getNewData={handleGetNewDataQob}
					handleRefresh={onRefreshQob}
					onScroll={handleHideHeader}
				/> }

			{ activePage === 2 && <ListQ9 /> }
	
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1
	},
	header: {
		height: hp('10%'),
		flexDirection: 'row',
		backgroundColor: '#C51C16',
		justifyContent: 'space-between',
		alignItems: 'center',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 100
	},
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF'
	},
	btn: {
		width: wp('7%'),
	},
	tab: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10
	},
	tabbtn: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: 'white',
		height: hp('6%'),
		borderRadius: 30,
		marginLeft: 10,
		marginRight: 10,
		elevation: 2
	},
	lottie: {
		width: 100,
		height: 100
	}
})

HistoryOrder.propTypes = {
	qob: PropTypes.array.isRequired,
	getQob: PropTypes.func.isRequired,
	onPickuped: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	return{
		qob: state.history.qob,
		user: state.auth.localUser
	}
}

export default connect(mapStateToProps, {
	getQob,
	onPickuped
})(HistoryOrder);