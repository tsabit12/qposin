import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import rgba from 'hex-to-rgba';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { EvilIcons } from '@expo/vector-icons'; 

export const styles = (props) => StyleSheet.create({
    content: {
        position: 'absolute',
		bottom: 10,
		backgroundColor: props === 'error' ? rgba('#282929', 1) : rgba('#24a102', 1),
		left: 5,
		right: 5,
		minHeight: hp('7%'),
		borderRadius: 3,
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white'
    },
    text: {
        fontSize: 15,
		fontFamily: 'Nunito-Bold',
		color: 'white'
    },
    button: {
        height: hp('5%'),
        width: hp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: hp('5%') / 2,
        borderWidth: 1,
        borderColor: 'white'
    }
})

const Notification = props => {
    const fadeAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if(props.open){
            Animated.timing(
                fadeAnim,
                {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                }
            ).start(() => {
                setTimeout(() => {
                    fadeAnim.setValue(0);
                    props.onClose();
                }, 3000);
            });
        }
    }, [props.open, fadeAnim]);
    
    if(props.open){
        return(
            <Animated.View style={[styles(props.variant).content, {opacity: fadeAnim}]}>
                <View style={{flex: 1}}>
                    <Text style={styles(props).text}>{props.message}</Text>
                </View>
                <TouchableOpacity 
                    activeOpacity={0.7} style={styles().button}
                    onPress={props.onClose}
                >
                    <EvilIcons name="close" size={30} color="#FFFF" />
                </TouchableOpacity>
            </Animated.View>
        );
    }else{
        return null;
    }
}

Notification.propTypes = {
    variant: PropTypes.oneOf(['success', 'error']),
    message: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
}

export default Notification;