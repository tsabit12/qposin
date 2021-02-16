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
            <View style={styles.titleContent}>
                <Text style={styles.text}>{title}</Text>
                { props.subtitle && <Text style={styles.subtitle} numberOfLines={1}>{props.subtitle}</Text>}
            </View>
            { props.searching && 
                <TouchableOpacity 
                    style={styles.searchIcon}
                    activeOpacity={0.8}
                    onPress={props.onSearch}
                >
                    <Icon name='ios-search' style={{color: '#FFF', fontSize: 28}} />
                </TouchableOpacity> }
        </View>
    )
}

HeaderComponent.propTypes = {
    onClickBack: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    searching: PropTypes.bool,
    onSearch: PropTypes.func
}

export default HeaderComponent;