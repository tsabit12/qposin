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
        paddingTop: 28,
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
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f7f7f7',
        margin: 10,
        height: hp('8%'),
        borderRadius: 5,
        justifyContent: 'center',
        padding: 10,
        elevation: 3
    },
    loadingContent: {
        flexDirection: 'row',
        //backgroundColor: 'red',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 8
    },
    loadingText: {
        fontFamily: 'Nunito-semi',
        flex: 1,
        marginRight: 8
    },
    subtitle: {
        color: '#FFF',
        fontFamily: 'Nunito-semi',
        fontSize: 12
    },
    titleContent: {
        //backgroundColor: 'yellow',
        width: wp('80%')
    },
    lottie: {
        width: 100,
	    height: 100
    }
})

export default styles;