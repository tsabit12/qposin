import React from 'react';
import styles from '../styles';
import PropTypes from 'prop-types';
import AnimatedLoader from 'react-native-animated-loader';
import { StatusBar } from 'react-native';

const LoadingAnimatedComponent = props => {
    return(
        <React.Fragment>
            { props.loading && <StatusBar backgroundColor="rgba(0,0,0,0.5)"/>}
            <AnimatedLoader
                visible={props.loading}
                overlayColor="rgba(0,0,0,0.5)"
                source={require("../../../assets/images/loader/3098.json")}
                animationStyle={styles.lottie}
                speed={3}
            />
        </React.Fragment>
    )
}

LoadingAnimatedComponent.propTypes = {
    loading: PropTypes.bool.isRequired
}

export default LoadingAnimatedComponent;