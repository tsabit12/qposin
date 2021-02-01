import { StyleSheet } from "react-native";
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontFamily: 'Nunito-Bold',
        color: '#FFFF',
        fontSize: 17,
        textAlign: 'center'
    },
    content: {
        margin: 10,
        alignItems: 'center',
        height: hp('35%'),
        justifyContent: 'space-around'
    },
    btn: {
        // backgroundColor: '#c73504',
        alignItems: 'center',
        justifyContent:'center',
        margin: 10,
        height: hp('6%'),
        borderRadius: 30,
        width: wp('70%')
    },
    btnRounded: {
        borderWidth: 1,
        borderColor: 'white'
    },
    btnFilled: {
        backgroundColor: '#ffac30'
    },
    textBtn: {
        fontFamily: 'Nunito-Bold',
        fontSize: 16,
        color: 'white'
    },
    hr: {
        color: '#FFFF',
        fontFamily: 'Nunito-Bold',
        fontSize: 16
    },
    optionContent: {
        height: hp('20%')
    },
    lottie: {
	    width: 100,
	    height: 100
	}
})

export default styles;