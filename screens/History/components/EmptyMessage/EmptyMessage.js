import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from '../../styles';
import PropTypes from 'prop-types';

const EmptyMessage = props => {
    return(
        <View style={styles.emptyContent}>
            <Image 
                source={require('../../../../assets/images/empty.png')}
                style={styles.emptyImage}
            />
            <TouchableOpacity 
                style={styles.button} 
                activeOpacity={0.8}
                onPress={props.onClickOrder}
            >
                <Text style={styles.btnText}>BUAT ORDER</Text>
            </TouchableOpacity>
        </View>
    )
}

EmptyMessage.propTypes = {
    onClickOrder: PropTypes.func.isRequired
}

export default EmptyMessage;