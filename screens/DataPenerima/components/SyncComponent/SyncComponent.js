import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';

const SyncComponent = props => {
    return(
        <View style={styles.content}>
            <View style={{marginBottom: 30, marginLeft: 10, marginRight: 10}}>
                <Text style={styles.message}>
                    Sinkronisasi gagal! {'\n'}untuk bisa melakukan booking order anda harus melakukan sinkronisasi terlebih dahulu
                </Text>
            </View>
            <TouchableOpacity 
                style={styles.btn}
                activeOpacity={0.7}
                onPress={props.onSubmit}
            >
                <Text style={[styles.message, {color: '#FFF'}]}>Cobalagi</Text>
            </TouchableOpacity>
        </View>
    )
}

SyncComponent.propTypes = {
    onSubmit: PropTypes.func.isRequired
}

export default SyncComponent;