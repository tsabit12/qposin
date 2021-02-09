const { StyleSheet } = require("react-native");
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyImage: {
        width: wp('60%'),
		height: hp('40%')
    },
    button: {
        backgroundColor: '#C51C16',
        width: wp('70%'),
        alignItems: 'center',
        height: hp('6%'),
        borderRadius: 30,
        justifyContent: 'center'
    },
    btnText: {
        color: '#FFF',
        fontFamily: 'Nunito-Bold'
    }
})

export default styles;