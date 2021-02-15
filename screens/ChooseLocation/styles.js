import { StyleSheet } from "react-native";
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';

export default StyleSheet.create({
    btnContainer: {
      position: 'absolute',
      bottom: 10,
      left: 0,
      right: 0,
      alignItems: 'center'
    },
    btn: {
        backgroundColor: '#C51C16',
        width: wp('70%'),
        alignItems: 'center',
        height: hp('6%'),
        justifyContent: 'center',
        borderRadius: 30,
    },
    title: {
        color: '#FFF',
        fontFamily: 'Nunito-Bold'
    }
})