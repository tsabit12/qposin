import React from 'react';
import { 
    Image, 
    ImageBackground, 
    Text, 
    TouchableOpacity, 
    View 
} from 'react-native';
import Hr from "react-native-hr-component";
import rgba from 'hex-to-rgba';
import styles from './styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { resetOrder } from '../../redux/actions/order';
import { CommonActions } from '@react-navigation/native';
import { addMessage } from '../../redux/actions/message';

const ChoosePickup = props => {

    const backHome = () => {
        props.resetOrder();
        props.navigation.dispatch(
            CommonActions.reset({
            index: 0,
            routes: [
                {
                name: 'Home'
                },
            ],
            })
        );
    }

    const handlePickup = () => {
        const arrExtid = [{extid: props.route.params.extid}];
        props.navigation.push("ChooseLocation", {extid: arrExtid});
    }

    return(
        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.root}
        >
            <Image 
                source={require('../../assets/images/icon/check.png')}
                style={styles.image}
                resizeMode='contain'
            />
            <View style={styles.content}>
                <Text style={styles.text}>
                    Booking order sukes! apakah kamu ingin melakukan pickup sekarang?
                </Text>
                <View style={styles.optionContent}>
                    <TouchableOpacity 
                        style={[styles.btn, styles.btnRounded]}
                        activeOpacity={0.8}
                        onPress={handlePickup}
                    >
                        <Text style={styles.textBtn}>PICKUP SEKARANG</Text>
                    </TouchableOpacity>
                    <Hr 
                        lineColor={rgba('#FFF', 0.7)} 
                        width={1} 
                        textPadding={10} 
                        text="atau" 
                        textStyles={styles.hr} 
                        hrPadding={15}
                    />
                    <TouchableOpacity 
                        style={[styles.btn, styles.btnFilled]}
                        activeOpacity={0.8}
                        onPress={backHome}
                    >
                        <Text style={styles.textBtn}>MENU UTAMA</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    )
}

ChoosePickup.propTypes = {
    resetOrder: PropTypes.func.isRequired,
    addMessage: PropTypes.func.isRequired
}

function mapStateToProps(state){
    return {
        user: state.auth.localUser
    }
}

export default connect(mapStateToProps, { 
    resetOrder,
    addMessage
})(ChoosePickup);