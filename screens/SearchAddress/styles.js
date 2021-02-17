import { StyleSheet } from "react-native";
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';

export default StyleSheet.create({
    root: {
        flex: 1
    },
    header: {
        height: hp('10%'),
        backgroundColor: '#C51C16',
        padding: 10,
        paddingTop: 32,
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        backgroundColor: '#FFF',
        flex: 1,
        height: hp('6%'),
        borderRadius: 5,
        elevation: 2,
        justifyContent: 'space-between',
        padding: 5,
        flexDirection: 'row'
    },
    closeIcon: {
        //backgroundColor: 'red',
        justifyContent: 'center',
        width: wp('8%'),
        alignItems: 'center'
    },
    list: {
        padding: 10,
        borderBottomWidth: 0.4,
        borderColor: '#ababab',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    text: {
        fontFamily: 'Nunito-semi',
        width: wp('87%'),
        fontSize: 13
    },
    iconList: {
        fontSize: 20
    },
    iconContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})