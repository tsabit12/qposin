import React, { useState } from 'react';
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
import { getSchedule } from '../../redux/actions/schedule';
import { CommonActions } from '@react-navigation/native';
import { ListSchedule } from './components';
import AnimatedLoader from 'react-native-animated-loader';
import api from '../../api';
import { addMessage } from '../../redux/actions/message';

const ChoosePickup = props => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // console.log(props.route.params);

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

    const handleOpenSchedule = () => {
        setOpen(true);
        props.getSchedule({ id: ''})
            .then(() => console.log('oke'))
            .catch(err => console.log(err));
    }

    const onChooseJadwal = async (scheduleId) => {
        setLoading(true);
        setOpen(false);

        const payload = {
            pickupstatus: '1',
            pickupdate: scheduleId,
            email: props.user.email,
            data: [{ extid: props.route.params.extid }]
        }

        try {
            const pickup = await api.qob.requestPickup(payload);
            if(pickup.respcode === '000'){
                props.addMessage(`(000) ${pickup.respmsg}`, 'success');
                backHome();
            }else{
                props.addMessage(`(${pickup.respcode}) ${pickup.respmsg}`, 'error');
            }
        } catch (error) {
            if(error.response){
                props.addMessage(`(410) Terdapat kesalahan`, 'error');
            }else if(error.request){
                props.addMessage(`(400) Request error`, 'error');
            }else{
                props.addMessage(`(500) Internal server error`, 'error');
            }
        }

        setLoading(false);
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
            <AnimatedLoader
		        visible={loading}
		        overlayColor="rgba(0,0,0,0.6)"
		        source={require("../../assets/images/loader/3098.json")}
		        animationStyle={styles.lottie}
		        speed={2}
		    />
            <ListSchedule 
                open={open}
                list={props.schedules}
                handleClose={() => setOpen(false)}
                handleChoose={onChooseJadwal}
            />
            <View style={styles.content}>
                <Text style={styles.text}>
                    Booking order sukes! apakah kamu ingin melakukan pickup sekarang?
                </Text>
                <View style={styles.optionContent}>
                    <TouchableOpacity 
                        style={[styles.btn, styles.btnRounded]}
                        activeOpacity={0.8}
                        onPress={handleOpenSchedule}
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
    schedules: PropTypes.array.isRequired,
    getSchedule: PropTypes.func.isRequired,
    addMessage: PropTypes.func.isRequired
}

function mapStateToProps(state){
    return {
        schedules: state.schedule,
        user: state.auth.localUser
    }
}

export default connect(mapStateToProps, { 
    resetOrder,
    getSchedule,
    addMessage
})(ChoosePickup);