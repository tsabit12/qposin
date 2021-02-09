const { StyleSheet } = require("react-native");
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    root: {
        shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.4,
        shadowRadius: 1,
        margin: 5,
        elevation: 2,
        backgroundColor: '#FFF',
        borderRadius: 3
    },
    header: {
        padding: 5,
		flexDirection: 'row',
		justifyContent: 'space-between'
    },
    status: {
        width: wp('45%'),
		color: '#f59300',
		fontSize: 12
    },
    icon: {
        width: wp('5%'),
        height: wp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp('5%') / 2

    },
    box: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	boxinside: {
		flex: 1,
		alignItems: 'center'
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: wp('43%'),
		height: hp('9%')
	},
	hr: {
		height: 1,
		flex: 1,
		marginLeft: 15,
		marginRight: 15,
		backgroundColor: '#a3a3a2'
	},
	image: {
		width: wp('4%'),
		height: hp('5%')
	},
	textItem: {
		fontSize: 12
	},
	left: {
		alignItems: 'center', 
		width: wp('13%')
	},
	textMenu: {
		paddingLeft: 10, 
		paddingBottom: 6, 
		paddingTop: 6
	},
	choosedMode: {
		backgroundColor: 'white',
		flex: 1
    },
    footer: {
		padding: 5,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
})

export default styles;