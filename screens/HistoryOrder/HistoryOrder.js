import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ToastAndroid,
	Animated,
	Platform
} from 'react-native';
import { Icon } from 'native-base';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import {
	ListQob,
	ListQ9
} from './components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { 
	getQob, 
	onPickuped, 
	setChoosed,
	removeAllChoosed,
	mutltipletPickuped
} from '../../redux/actions/history';
import { getSchedule } from '../../redux/actions/schedule';
import { addMessage } from '../../redux/actions/message';
import CustomToast from "../CustomToast";

const HistoryOrder = props => {
	const scrollY = new Animated.Value(0);
	// const animateContent = new Animated.Value(-100);

	const [activePage, setActivepage] = useState(1);
	const [errors, setErrors] = useState({});
	const [offestQob, setOffsetQob] = useState(0);
	const [qobIsDone, setQobDone] = useState(false); //notif once
	const [toastVisible, setToastVisible] = useState({
		open: false,
		message: 'Loading....'
	});
	const { email } = props.user;

	const diffClamp =  Animated.diffClamp(scrollY, 0, hp('10%'));
	const translateY = diffClamp.interpolate({
		inputRange: [0, hp('10%')],
		outputRange: [0, hp('-10%')],
		extrapolateLeft: 'clamp'
	})

	//unmount component
	useEffect(() => {
		return () => {
			props.removeAllChoosed();
		};
	}, [])

	useEffect(() => { 
		if (activePage === 1) {
			const payload = {
				email: email,
				status: "0",
				offset: 0,
				extid: "",
				startdate: "2020-12-01",
				enddate: "2021-12-01"
			}

			props.getQob(payload)
				// .then(() => setOffsetQob(offestQob + 10))
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
				//.then(res => setOffsetQob(offestQob + 10))
				.catch(() => {
					if (!qobIsDone) {
						setQobDone(true);
						if(Platform.OS === 'android'){
							ToastAndroid.showWithGravity(
								"Kamu sudah melihat semua history kiriman",
								ToastAndroid.LONG,
								ToastAndroid.BOTTOM
							);
						}else{
							alert('Kamu sudah melihat semua history kiriman');
						}
					}
				})
		}
	}

	const onRefreshQob = async () => {
		const payload = {
			email,
			status: "0",
			offset: 0,
			extid: "",
			startdate: "2020-12-01",
			enddate: "2021-12-01"
		}

		try{
			await props.getQob(payload);
			// setOffsetQob(10);
			return Promise.resolve('oke');
		}catch(err){
			return Promise.reject('not oke');
		}
	}

	const handleHideHeader = (yOffset) => {
		scrollY.setValue(yOffset);
	}

	return(
		<View style={StyleSheet.absoluteFillObject}>
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
					user={props.user}
					onPickup={handlePickup}
					getNewData={handleGetNewDataQob}
					handleRefresh={onRefreshQob}
					onScroll={handleHideHeader}
					setChoosed={props.setChoosed}
					onMultiplePickup={props.mutltipletPickuped}
					showToast={(message) => setToastVisible({ message, open: true})}
					schedules={props.schedules}
					getSchedule={props.getSchedule}
					addMessage={props.addMessage}
				/> }

			{ activePage === 2 && <ListQ9 /> }
			
			<CustomToast 
				open={toastVisible.open} 
				message={toastVisible.message}
				onClose={() => setToastVisible({message: '', open: false})}
			/>
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
	onPickuped: PropTypes.func.isRequired,
	setChoosed: PropTypes.func.isRequired,
	removeAllChoosed: PropTypes.func.isRequired,
	mutltipletPickuped: PropTypes.func.isRequired,
	schedules: PropTypes.array.isRequired,
	getSchedule: PropTypes.func.isRequired,
	addMessage: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	return{
		qob: state.history.qob,
		user: state.auth.localUser,
		schedules: state.schedule
	}
}

export default connect(mapStateToProps, {
	getQob,
	onPickuped,
	setChoosed,
	removeAllChoosed,
	mutltipletPickuped,
	getSchedule,
	addMessage
})(HistoryOrder);