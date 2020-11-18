import React from 'react';
import { View, Text, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen'; 
import PropTypes from 'prop-types';

const Loader = ({ loading, text }) => {
	return(
		<Modal
			transparent={true}
	        visible={loading}
		>
			<View style={styles.backgroundModal}>
				<View style={styles.container}>
					<Text style={styles.text} numberOfLines={2}>{text}</Text>
					<View style={{marginLeft: 5}}>
						<ActivityIndicator animating={true} size="large" />
					</View>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	backgroundModal: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	container: {
		backgroundColor: 'white',
		width: wp('50%'),
		height: hp('10%'),
		alignItems: 'center',
		padding: 10,
		borderRadius: 3,
		flexDirection: 'row'
	},
	text: {
		flex: 1
	}
})

Loader.propTypes = {
	loading: PropTypes.bool.isRequired,
	text: PropTypes.string.isRequired
}

export default Loader;