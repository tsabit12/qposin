import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles';
import { Icon } from 'native-base';

const HeaderComponent = props => {
    const { title, onClickBack } = props;
    return(
        <View style={styles.header}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={onClickBack}
                activeOpacity={0.8}
            >
                <Icon name='ios-arrow-back' style={{color: '#FFF', fontSize: 25}} />
            </TouchableOpacity>
            <Text style={styles.text}>{title}</Text>
        </View>
    )
}

HeaderComponent.propTypes = {
    onClickBack: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
}

export default HeaderComponent;