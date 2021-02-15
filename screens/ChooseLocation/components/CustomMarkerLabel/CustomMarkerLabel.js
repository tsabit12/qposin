import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const CustomMarkerLabel = () => {
    return(
        <View style={styles.container}>
           <View style={styles.bubble}>
             <Text style={styles.amount}>Location</Text>
           </View>
           <View style={styles.arrowBorder} />
           <View style={styles.arrow} />
       </View>
   );
}

const styles = StyleSheet.create({
    container: {
		flexDirection: 'column',
		alignSelf: 'flex-start'
	},
	bubble: {
	    flex: 0,
	    flexDirection: 'row',
	    alignSelf: 'flex-start',
	    backgroundColor: 'orange',
	    padding: 2,
	    borderRadius: 3,
	    borderColor: 'orange',
	    borderWidth: 0.5,
    },
    amount: {
	    color: '#FFFFFF',
	    fontSize: 13,
	    padding: 2,
	    fontWeight: 'bold'
	},
	arrow: {
		backgroundColor: 'transparent',
		borderWidth: 6,
		borderColor: 'transparent',
		borderTopColor: 'orange',
		alignSelf: 'center',
		marginTop: -9,
    },
    arrowBorder: {
		backgroundColor: 'transparent',
		borderWidth: 4,
		borderColor: 'transparent',
		borderTopColor: 'orange',
		alignSelf: 'center',
		marginTop: -0.5,
	},
})

export default CustomMarkerLabel;