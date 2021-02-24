import { StyleSheet } from "react-native";
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';

export default StyleSheet.create({
    content: {
        backgroundColor: '#FFF',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    message: {
        textAlign: 'center',
        fontFamily: 'Nunito-semi'
    },
    btn: {
        backgroundColor: '#C51C16',
        padding: 10,
        borderRadius: 20,
        width: wp('70%')
    }
})