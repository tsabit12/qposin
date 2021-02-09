import { StyleSheet } from "react-native";
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    header: {
        height: hp('10%'),
        backgroundColor: '#C51C16',
        //justifyContent: 'center',
        padding: 10,
        paddingTop: 25,
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        fontFamily: 'Nunito-Bold',
        fontSize: 17,
        color: '#FFF'
    },
    backButton: {
        marginRight: 13,
        marginTop: 5
    }
})

export default styles;