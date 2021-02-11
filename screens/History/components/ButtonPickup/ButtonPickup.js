import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../../styles';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';

const ButtonPickup = props => {
    return(
        <View style={styles.contentBtnPickup}>
            <TouchableOpacity 
                style={[styles.button, { flexDirection: 'row', justifyContent: 'space-between'}]}
                activeOpacity={0.9}
                onPress={props.onClick}
            >
                <Text style={[styles.btnText, {flex: 1, textAlign: 'center', marginLeft: 10}]}>PICKUP ({props.total}) ITEM</Text>
                <TouchableOpacity 
                    style={{marginRight: 8}} 
                    activeOpacity={0.7}
                    onPress={props.onClose}
                >
                    <Ionicons name="ios-close-circle" size={35} color="white" />
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    )
}

ButtonPickup.propTypes = {
    total: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired
}

export default ButtonPickup;