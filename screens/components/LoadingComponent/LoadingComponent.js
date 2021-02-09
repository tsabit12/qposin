import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Text, View } from 'react-native';
import styles from '../styles';

const LoadingComponent = props => {
    const { loading, text } = props;

    if(loading){
        return(
            <View style={styles.loading}>
                <View style={styles.loadingContent}>
                    <Text numberOfLines={2} style={styles.loadingText}>{text ? text : 'Loading...'}</Text>
                    <ActivityIndicator size="large" />
                </View>
            </View>
        )
    }else{
        return null;
    }
}

LoadingComponent.propTypes = {
    loading: PropTypes.bool.isRequired,
    text: PropTypes.string
}

export default LoadingComponent;